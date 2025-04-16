
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Location } from './LocationList';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';

interface LocationFormProps {
  locations: Location[];
  editingLocation: Location | null;
  onClose: () => void;
  onSubmit: () => void;
}

const LocationForm = ({ locations, editingLocation, onClose, onSubmit }: LocationFormProps) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState<'country' | 'state' | 'city'>('country');
  const [parentId, setParentId] = useState<string | null>(null);
  const [launchDate, setLaunchDate] = useState<Date | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (editingLocation) {
      setName(editingLocation.name);
      setCode(editingLocation.code);
      setType(editingLocation.type);
      setParentId(editingLocation.parent_id);
      setLaunchDate(editingLocation.launch_date ? new Date(editingLocation.launch_date) : null);
      setIsActive(editingLocation.is_active);
    }
  }, [editingLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const locationData = {
        name,
        code,
        type,
        parent_id: parentId,
        launch_date: launchDate ? launchDate.toISOString() : null,
        is_active: isActive,
      };

      let error;

      if (editingLocation) {
        const { error: updateError } = await supabase
          .from('locations')
          .update(locationData)
          .eq('id', editingLocation.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('locations')
          .insert([locationData]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Location ${editingLocation ? 'updated' : 'created'} successfully`,
      });

      onSubmit();
    } catch (error) {
      console.error('Error saving location:', error);
      toast({
        title: 'Error',
        description: `Failed to ${editingLocation ? 'update' : 'create'} location`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter out the current location from parent options to prevent circular references
  const parentOptions = locations.filter(location => {
    // Can't be its own parent
    if (editingLocation && location.id === editingLocation.id) return false;
    
    // States can only have countries as parents
    if (type === 'state') return location.type === 'country';
    
    // Cities can have states or countries as parents
    if (type === 'city') return location.type === 'state' || location.type === 'country';
    
    // Countries should not have parents
    if (type === 'country') return false;
    
    return true;
  });

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle>{editingLocation ? 'Edit Location' : 'Add New Location'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Location Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter location name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="code">Location Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter location code (e.g. US, CA, NYC)"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Location Type</Label>
              <Select
                value={type}
                onValueChange={(value: 'country' | 'state' | 'city') => {
                  setType(value);
                  // Reset parent if changing from city/state to country
                  if (value === 'country') {
                    setParentId(null);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="country">Country</SelectItem>
                  <SelectItem value="state">State/Province</SelectItem>
                  <SelectItem value="city">City</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {type !== 'country' && (
              <div className="space-y-2">
                <Label htmlFor="parent">Parent Location</Label>
                <Select
                  value={parentId || ''}
                  onValueChange={(value) => setParentId(value === '' ? null : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {parentOptions.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name} ({location.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="launchDate">Launch Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {launchDate ? format(launchDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={launchDate || undefined}
                    onSelect={setLaunchDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2 flex items-end">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : editingLocation ? 'Update Location' : 'Add Location'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LocationForm;
