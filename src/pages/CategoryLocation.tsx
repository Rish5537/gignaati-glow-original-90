
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CategoryList from '@/components/categories/CategoryList';
import LocationList from '@/components/locations/LocationList';
import { useAuth } from '@/hooks/useAuth';
import AccessDenied from '@/components/ops/AccessDenied';
import { Card, CardContent } from '@/components/ui/card';

const CategoryLocation = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('categories');

  if (!isAdmin) {
    return <AccessDenied />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Category & Location Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories">
          <Card>
            <CardContent className="pt-6">
              <CategoryList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="locations">
          <Card>
            <CardContent className="pt-6">
              <LocationList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CategoryLocation;
