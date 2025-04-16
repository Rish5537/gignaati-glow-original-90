
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

console.log("Verify payment function loaded");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      throw new Error("Missing required parameter: sessionId");
    }

    // Create Supabase client using the service role key for writing to database
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    
    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Get transaction from database
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from('transactions')
      .select('id, order_id')
      .eq('stripe_session_id', sessionId)
      .single();
    
    if (transactionError || !transaction) {
      throw new Error("Error retrieving transaction: " + (transactionError?.message || "Transaction not found"));
    }
    
    // Update transaction status based on payment status
    const paymentStatus = session.payment_status === 'paid' ? 'completed' : 'pending';
    
    await supabaseAdmin.from('transactions').update({
      payment_status: paymentStatus,
      stripe_payment_intent_id: session.payment_intent,
      updated_at: new Date().toISOString()
    }).eq('id', transaction.id);
    
    // If payment is complete, update the order status
    if (paymentStatus === 'completed') {
      await supabaseAdmin.from('orders').update({
        status: 'paid',
        updated_at: new Date().toISOString()
      }).eq('id', transaction.order_id);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        paymentStatus,
        sessionId
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    
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
