
import { supabase } from "@/integrations/supabase/client";
import { FilterState } from "./types";

export const fetchFilteredGigs = async (
  searchQuery: string,
  filters: FilterState
) => {
  try {
    // Start with a base query
    let query = supabase.from('gigs').select(`
      id,
      title,
      price,
      rating,
      reviews_count,
      image_url,
      experience_level,
      categories,
      functions,
      types,
      llm_models,
      hosting_providers,
      industries,
      integrations,
      business_functions,
      professions,
      profiles (
        id,
        full_name
      )
    `);
    
    // Add search filter if provided
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%, profiles.full_name.ilike.%${searchQuery}%`);
    }
    
    // Filter by price range
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
      query = query.gte('price', filters.priceRange[0]).lte('price', filters.priceRange[1]);
    }
    
    // Apply array filters
    const arrayFilters = [
      { key: 'categories', values: filters.categories },
      { key: 'functions', values: filters.functions },
      { key: 'types', values: filters.types },
      { key: 'llm_models', values: filters.llmModels },
      { key: 'hosting_providers', values: filters.hostingProviders },
      { key: 'industries', values: filters.industries },
      { key: 'integrations', values: filters.integrations },
      { key: 'business_functions', values: filters.businessFunctions },
      { key: 'professions', values: filters.professions },
    ];
    
    for (const filter of arrayFilters) {
      if (filter.values.length > 0) {
        query = query.contains(filter.key, filter.values);
      }
    }
    
    // Filter by rating
    if (filters.ratings.length > 0) {
      const minRating = Math.min(...filters.ratings.map(r => parseInt(r)));
      query = query.gte('rating', minRating);
    }
    
    return await query;
  } catch (error) {
    console.error('Error in fetchFilteredGigs:', error);
    throw error;
  }
};

export const fetchGigById = async (id: string) => {
  try {
    return await supabase
      .from('gigs')
      .select(`
        id,
        title,
        price,
        rating,
        reviews_count,
        image_url,
        experience_level,
        categories,
        functions,
        types,
        llm_models,
        hosting_providers,
        industries,
        integrations,
        business_functions,
        professions,
        profiles (
          id,
          full_name
        )
      `)
      .eq('id', id)
      .single();
  } catch (error) {
    console.error('Error in fetchGigById:', error);
    throw error;
  }
};
