
import { supabase } from '@/integrations/supabase/client';
import { EnhancedFlaggedContent, FlaggedContentItem } from './types';

export async function fetchFlaggedContent(
  typeFilter: string, 
  statusFilter: string, 
  sortField: string, 
  sortDirection: 'asc' | 'desc'
): Promise<EnhancedFlaggedContent[]> {
  let query = supabase
    .from('flagged_content')
    .select(`
      *,
      reporter:profiles!reporter_id(full_name)
    `);
  
  if (typeFilter !== 'all') {
    query = query.eq('content_type', typeFilter);
  }
  
  if (statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }
  
  query = query.order(sortField, { ascending: sortDirection === 'asc' });
  
  const { data, error } = await query;
    
  if (error) {
    throw error;
  }
  
  // Transform the data to match our enhanced interface
  const transformedData: EnhancedFlaggedContent[] = data?.map(item => {
    // Handle the reporter data safely
    const reporterData = item.reporter as { full_name: string | null } | null;
    
    return {
      ...item,
      content_preview: 'Preview not available', // Default preview
      reporter_name: reporterData?.full_name || 'Unknown user',
    };
  }) || [];
  
  return transformedData;
}

export async function updateFlaggedContentStatus(
  id: string, 
  status: 'approved' | 'rejected',
  resolution?: string
): Promise<void> {
  const updateData: {
    status: 'approved' | 'rejected';
    resolution?: string;
  } = { status };
  
  if (resolution) {
    updateData.resolution = resolution;
  }
  
  const { error } = await supabase
    .from('flagged_content')
    .update(updateData)
    .eq('id', id);
    
  if (error) throw error;
}
