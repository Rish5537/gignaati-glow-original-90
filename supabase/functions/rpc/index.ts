
// This file demonstrates how to create RPC functions for table management

// Create a function to check if a table exists
export async function tableExists(tableName: string) {
  const { data, error } = await supabase.rpc('table_exists', {
    table_name: tableName
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

// Create orders table if it doesn't exist
export async function createOrdersTableIfNotExists() {
  const { data, error } = await supabase.rpc('create_orders_table_if_not_exists');
  
  if (error) {
    throw error;
  }
  
  return data;
}

// Create packages table if it doesn't exist
export async function createPackagesTableIfNotExists() {
  const { data, error } = await supabase.rpc('create_packages_table_if_not_exists');
  
  if (error) {
    throw error;
  }
  
  return data;
}

// Create transactions table if it doesn't exist
export async function createTransactionsTableIfNotExists() {
  const { data, error } = await supabase.rpc('create_transactions_table_if_not_exists');
  
  if (error) {
    throw error;
  }
  
  return data;
}
