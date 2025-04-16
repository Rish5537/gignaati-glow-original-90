
import { supabase } from '@/integrations/supabase/client';
import { SafeUserTrust } from './types';

export const fetchUserTrustData = async (
  statusFilter: string, 
  sortField: string, 
  sortDirection: 'asc' | 'desc'
) => {
  try {
    let query = supabase
      .from('user_trust_records')
      .select(`
        *,
        profile:profiles(*)
      `);
    
    if (statusFilter === 'suspended') {
      query = query.eq('status', 'suspended');
    } else if (statusFilter === 'active') {
      query = query.eq('status', 'active');
    } else if (statusFilter === 'warned') {
      query = query.gt('warning_count', 0).eq('status', 'active');
    }
    
    query = query.order(sortField, { ascending: sortDirection === 'asc' });
    
    const { data, error } = await query;
      
    if (error) {
      throw error;
    }
    
    const transformedData = data?.map(record => {
      // Safely handle the suspension_history field
      const suspensionHistory = record.suspension_history as any[] || [];
      
      return {
        id: record.id,
        user_id: record.user_id,
        trust_score: record.trust_score || 100,
        warning_count: record.warning_count || 0,
        suspension_count: suspensionHistory.length || 0,
        is_suspended: record.status === 'suspended',
        suspension_reason: record.status === 'suspended' && suspensionHistory.length > 0 ? 
          suspensionHistory[0]?.reason || null : null,
        suspension_until: record.status === 'suspended' && suspensionHistory.length > 0 ? 
          suspensionHistory[0]?.until || null : null,
        last_warning_at: record.last_warning_date,
        created_at: record.created_at,
        updated_at: record.updated_at,
        profile: record.profile
      };
    });
    
    return transformedData as SafeUserTrust[];
  } catch (error) {
    console.error('Error fetching user trust data:', error);
    throw error;
  }
};

export const suspendUser = async (userId: string, reason: string, suspensionDays: number) => {
  try {
    const suspensionUntil = new Date();
    suspensionUntil.setDate(suspensionUntil.getDate() + suspensionDays);
    
    const { data: userData, error: fetchError } = await supabase
      .from('user_trust_records')
      .select('suspension_history')
      .eq('id', userId)
      .single();
    
    if (fetchError) throw fetchError;
    
    const suspensionHistory = [
      ...(userData?.suspension_history as any[] || []),
      {
        reason: reason,
        until: suspensionUntil.toISOString(),
        created_at: new Date().toISOString()
      }
    ];
    
    const { error } = await supabase
      .from('user_trust_records')
      .update({
        status: 'suspended',
        suspension_history: suspensionHistory,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (error) throw error;
    
    return {
      is_suspended: true,
      suspension_reason: reason,
      suspension_until: suspensionUntil.toISOString(),
    };
  } catch (error) {
    console.error('Error suspending user:', error);
    throw error;
  }
};

export const warnUser = async (userId: string, reason: string) => {
  try {
    const { data: userData, error: fetchError } = await supabase
      .from('user_trust_records')
      .select('warning_count')
      .eq('id', userId)
      .single();
    
    if (fetchError) throw fetchError;
    
    const warningCount = (userData?.warning_count || 0) + 1;
    const now = new Date().toISOString();
    
    const { error } = await supabase
      .from('user_trust_records')
      .update({
        warning_count: warningCount,
        last_warning_date: now,
        updated_at: now
      })
      .eq('id', userId);
      
    if (error) throw error;
    
    return {
      warning_count: warningCount,
      last_warning_at: now,
    };
  } catch (error) {
    console.error('Error warning user:', error);
    throw error;
  }
};

export const removeSuspension = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('user_trust_records')
      .update({
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (error) throw error;
    
    return {
      is_suspended: false,
      suspension_reason: null,
      suspension_until: null,
    };
  } catch (error) {
    console.error('Error removing suspension:', error);
    throw error;
  }
};
