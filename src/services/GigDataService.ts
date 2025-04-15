
import { fetchFilteredGigs, fetchGigById } from "./gigQueries";
import { sortGigs } from "./gigSorting";
import { Gig, FilterState } from "./types";

// Re-export the Gig type to maintain the same imports in other files
export type { Gig, FilterState };

export const getFilteredAndSortedGigs = async (
  searchQuery: string, 
  sortBy: string, 
  filters: FilterState
): Promise<Gig[]> => {
  try {
    // Fetch filtered gigs from the database
    const { data, error } = await fetchFilteredGigs(searchQuery, filters);
    
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

export const getGigById = async (id: string): Promise<Gig | null> => {
  try {
    const { data, error } = await fetchGigById(id);
      
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

export const getFeaturedGigs = async (): Promise<Gig[]> => {
  // Create an empty filter state with default values
  const emptyFilters: FilterState = {
    categories: [],
    functions: [],
    types: [],
    llmModels: [],
    hostingProviders: [],
    industries: [],
    integrations: [],
    businessFunctions: [],
    professions: [],
    ratings: [],
    priceRange: [0, 1000]
  };
  
  // Use the existing function to get gigs, but with top ratings
  return getFilteredAndSortedGigs("", "topRated", emptyFilters);
};
