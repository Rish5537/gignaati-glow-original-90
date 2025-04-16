
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  status: 'read' | 'unread';
  related_entity_type?: string;
  related_entity_id?: string;
  created_at: string;
  read_at?: string;
}

export const getUserNotifications = async (): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
  
  return data || [];
};

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('notifications')
    .update({ 
      status: 'read',
      read_at: new Date().toISOString()
    })
    .eq('id', notificationId);
  
  if (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
  
  return true;
};

export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  entityType?: string,
  entityId?: string
): Promise<string | null> => {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title,
      message,
      related_entity_type: entityType,
      related_entity_id: entityId,
      status: 'unread'
    })
    .select('id')
    .single();
  
  if (error) {
    console.error('Error creating notification:', error);
    return null;
  }
  
  return data?.id || null;
};

export const deleteNotification = async (notificationId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);
  
  if (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
  
  return true;
};

export const clearAllNotifications = async (userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error clearing notifications:', error);
    return false;
  }
  
  return true;
};
