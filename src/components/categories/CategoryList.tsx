
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CategoryForm from './CategoryForm';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

export interface Category {
  id: string;
  name: string;
  description: string;
  parent_id: string | null;
  icon_url: string | null;
  is_active: boolean;
  created_at: string;
}

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategoryVisibility = async (category: Category) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !category.is_active })
        .eq('id', category.id);
        
      if (error) throw error;
      
      setCategories(prevCategories => 
        prevCategories.map(c => 
          c.id === category.id ? { ...c, is_active: !c.is_active } : c
        )
      );
      
      toast({
        title: 'Success',
        description: `Category ${category.is_active ? 'hidden' : 'shown'} successfully`,
      });
    } catch (error) {
      console.error('Error updating category visibility:', error);
      toast({
        title: 'Error',
        description: 'Failed to update category visibility',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setCategories(prevCategories => 
        prevCategories.filter(category => category.id !== id)
      );
      
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete category. It may be in use.',
        variant: 'destructive',
      });
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleFormSubmit = async () => {
    handleFormClose();
    await fetchCategories();
  };

  const getParentCategoryName = (parentId: string | null) => {
    if (!parentId) return 'None';
    const parent = categories.find(c => c.id === parentId);
    return parent ? parent.name : 'Unknown';
  };

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Categories</h2>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-1">
          <PlusCircle size={16} />
          Add Category
        </Button>
      </div>

      {isFormOpen && (
        <CategoryForm 
          categories={categories}
          editingCategory={editingCategory}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}

      <div className="grid grid-cols-1 gap-4">
        {categories.map(category => (
          <Card key={category.id} className={!category.is_active ? 'opacity-60' : ''}>
            <CardHeader className="py-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {category.icon_url && (
                    <img 
                      src={category.icon_url} 
                      alt={category.name} 
                      className="w-6 h-6 object-contain" 
                    />
                  )}
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={category.is_active} 
                    onCheckedChange={() => toggleCategoryVisibility(category)}
                  />
                  <Badge variant={category.is_active ? "default" : "outline"}>
                    {category.is_active ? 'Visible' : 'Hidden'}
                  </Badge>
                  <Button variant="outline" size="icon" onClick={() => handleEdit(category)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="outline" size="icon" className="text-destructive" onClick={() => handleDelete(category.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-2">
              <div className="text-sm text-muted-foreground">{category.description}</div>
              {category.parent_id && (
                <div className="text-xs text-muted-foreground mt-1">
                  Parent: {getParentCategoryName(category.parent_id)}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {categories.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No categories found. Create your first category to get started.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
