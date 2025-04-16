
export interface Gig {
  id: string;
  title: string;
  price: number;
  rating?: number;
  reviews_count?: number;
  freelancer_id: string;
  created_at: string;
  updated_at?: string;
  image_url?: string;
  experience_level?: string;
  categories?: string[];
  functions?: string[];
  types?: string[];
  llm_models?: string[];
  hosting_providers?: string[];
  industries?: string[];
  integrations?: string[];
  business_functions?: string[];
  professions?: string[];
}

export interface GigWithProfile extends Gig {
  profiles?: {
    id: string;
    full_name: string | null;
  };
  requirements?: string;
}

export interface GigRequirement {
  id: string;
  gig_id: string;
  requirements: string;
  created_at: string;
  updated_at: string;
}
