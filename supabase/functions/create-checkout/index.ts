
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

console.log("Checkout function loaded");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { gigId, packageType, price } = await req.json();
    
    if (!gigId || !packageType || !price) {
      throw new Error("Missing required parameters: gigId, packageType, or price");
    }

    // Create Supabase client using the service role key for writing to database
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Get authenticated user info
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("Authentication error: " + (userError?.message || "User not found"));
    }
    
    const user = userData.user;
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    
    // Check if a Stripe customer record exists for this user
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      // Create a new customer if one doesn't exist
      const newCustomer = await stripe.customers.create({
        email: user.email,
      });
      customerId = newCustomer.id;
    }
    
    // Get gig details from Supabase
    const { data: gigData, error: gigError } = await supabaseAdmin
      .from('gigs')
      .select('title, freelancer_id')
      .eq('id', gigId)
      .single();
    
    if (gigError || !gigData) {
      throw new Error("Error retrieving gig details: " + (gigError?.message || "Gig not found"));
    }
    
    // Create an order in the database
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        gig_id: gigId,
        client_id: user.id,
        freelancer_id: gigData.freelancer_id,
        package_type: packageType,
        price: price,
        status: 'pending'
      })
      .select()
      .single();
    
    if (orderError || !orderData) {
      throw new Error("Error creating order: " + (orderError?.message || "Order creation failed"));
    }
    
    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${gigData.title} - ${packageType.charAt(0).toUpperCase() + packageType.slice(1)} Package`,
            },
            unit_amount: Math.round(price * 100), // Stripe expects amounts in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?orderId=${orderData.id}`,
      cancel_url: `${req.headers.get("origin")}/checkout/${gigId}?package=${packageType}`,
    });
    
    // Create transaction record
    await supabaseAdmin.from('transactions').insert({
      order_id: orderData.id,
      user_id: user.id,
      amount: price,
      payment_status: 'pending',
      stripe_session_id: session.id
    });
    
    return new Response(
      JSON.stringify({ 
        success: true,
        url: session.url,
        orderId: orderData.id
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "An unknown error occurred" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});
