
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

export type FilterState = {
  categories: string[];
  functions: string[];
  types: string[];
  llmModels: string[];
  hostingProviders: string[];
  industries: string[];
  integrations: string[];
  businessFunctions: string[];
  professions: string[];
  ratings: string[];
  priceRange: [number, number];
};
