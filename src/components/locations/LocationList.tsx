import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Globe, CalendarClock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LocationForm from './LocationForm';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Location } from '@/types/supabase';

const LocationList = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load locations',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setLocations(prevLocations => 
        prevLocations.filter(location => location.id !== id)
      );
      
      toast({
        title: 'Success',
        description: 'Location deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting location:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete location. It may be in use.',
        variant: 'destructive',
      });
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingLocation(null);
  };

  const handleFormSubmit = async () => {
    handleFormClose();
    await fetchLocations();
  };

  const getParentLocationName = (parentId: string | null) => {
    if (!parentId) return 'None';
    const parent = locations.find(l => l.id === parentId);
    return parent ? parent.name : 'Unknown';
  };

  const isScheduledForFuture = (launchDate: string | null) => {
    if (!launchDate) return false;
    return new Date(launchDate) > new Date();
  };

  if (isLoading) {
    return <div>Loading locations...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Locations</h2>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-1">
          <PlusCircle size={16} />
          Add Location
        </Button>
      </div>

      {isFormOpen && (
        <LocationForm 
          locations={locations}
          editingLocation={editingLocation}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}

      <div className="grid grid-cols-1 gap-4">
        {locations.map(location => (
          <Card key={location.id} className={!location.is_active ? 'opacity-60' : ''}>
            <CardHeader className="py-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <CardTitle className="text-lg">{location.name}</CardTitle>
                  <Badge>{location.type}</Badge>
                  <Badge variant="outline">{location.code}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  {location.launch_date && (
                    <Badge variant={isScheduledForFuture(location.launch_date) ? "secondary" : "default"}>
                      <CalendarClock className="w-3 h-3 mr-1" />
                      {format(new Date(location.launch_date), 'MMM d, yyyy')}
                    </Badge>
                  )}
                  <Badge variant={location.is_active ? "default" : "outline"}>
                    {location.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button variant="outline" size="icon" onClick={() => handleEdit(location)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="outline" size="icon" className="text-destructive" onClick={() => handleDelete(location.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-2">
              {location.parent_id && (
                <div className="text-sm text-muted-foreground">
                  Parent: {getParentLocationName(location.parent_id)}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {locations.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No locations found. Create your first location to get started.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LocationList;
