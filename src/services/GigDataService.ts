
import { supabase } from "@/integrations/supabase/client";
import { FilterState } from "@/components/GigFilters";

export type Gig = {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviews_count: number;
  freelancer: string;
  xp: string;
  image: string;
  categories?: string[];
  functions?: string[];
  types?: string[];
  llm_models?: string[];
  hosting_providers?: string[];
  industries?: string[];
  integrations?: string[];
  business_functions?: string[];
  professions?: string[];
};

export const getFilteredAndSortedGigs = async (
  searchQuery: string, 
  sortBy: string, 
  filters: FilterState
): Promise<Gig[]> => {
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
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching gigs:', error);
      return [];
    }
    
    // Transform the data to match our Gig type
    const gigs: Gig[] = data.map(gig => ({
      id: gig.id,
      title: gig.title,
      price: gig.price,
      rating: gig.rating || 0,
      reviews_count: gig.reviews_count || 0,
      freelancer: gig.profiles.full_name || 'Anonymous Freelancer',
      xp: gig.experience_level || 'Intermediate',
      image: gig.image_url || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      categories: gig.categories,
      functions: gig.functions,
      types: gig.types,
      llm_models: gig.llm_models,
      hosting_providers: gig.hosting_providers,
      industries: gig.industries,
      integrations: gig.integrations,
      business_functions: gig.business_functions,
      professions: gig.professions,
    }));
    
    // Sort the filtered gigs
    return sortGigs(gigs, sortBy);
  } catch (error) {
    console.error('Error in getFilteredAndSortedGigs:', error);
    return [];
  }
};

function sortGigs(gigs: Gig[], sortBy: string): Gig[] {
  return [...gigs].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return parseInt(b.id) - parseInt(a.id); // Using ID as a proxy for date
      case 'topRated':
        return b.rating - a.rating;
      case 'priceLow':
        return a.price - b.price;
      case 'priceHigh':
        return b.price - a.price;
      case 'popular':
      default:
        return b.reviews_count - a.reviews_count;
    }
  });
}

export const getGigById = async (id: string): Promise<Gig | null> => {
  try {
    const { data, error } = await supabase
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
      
    if (error) {
      console.error('Error fetching gig by ID:', error);
      return null;
    }
    
    return {
      id: data.id,
      title: data.title,
      price: data.price,
      rating: data.rating || 0,
      reviews_count: data.reviews_count || 0,
      freelancer: data.profiles.full_name || 'Anonymous Freelancer',
      xp: data.experience_level || 'Intermediate',
      image: data.image_url || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      categories: data.categories,
      functions: data.functions,
      types: data.types,
      llm_models: data.llm_models,
      hosting_providers: data.hosting_providers,
      industries: data.industries,
      integrations: data.integrations,
      business_functions: data.business_functions,
      professions: data.professions,
    };
  } catch (error) {
    console.error('Error in getGigById:', error);
    return null;
  }
};
