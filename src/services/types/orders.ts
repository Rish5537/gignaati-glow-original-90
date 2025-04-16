
export type Package = {
  id: string;
  gig_id: string;
  title: string;
  description: string;
  price: number;
  delivery_time: string;
  revisions: string;
  package_type: string;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  client_id: string;
  freelancer_id: string;
  gig_id: string;
  package_type: string;
  price: number;
  requirements: string | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  gig?: {
    title: string;
    image_url: string | null;
  };
  client?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  freelancer?: {
    full_name: string | null;
    avatar_url: string | null;
  };
};

export type Transaction = {
  id: string;
  order_id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_method: string | null;
  payment_status: TransactionStatus;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
  order?: Order;
};

export type OrderStatus = 'pending' | 'paid' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';
