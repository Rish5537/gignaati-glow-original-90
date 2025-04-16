
export interface GigPackage {
  name: string;
  price: number;
  description: string;
  deliveryTime: string;
  revisions: number | string;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  freelancer_id: string;
  price: number;
  rating?: number;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published' | 'archived' | 'pending_review';
  packages?: Record<string, GigPackage>;
}
