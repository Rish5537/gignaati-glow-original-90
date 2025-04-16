
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

interface RequestBody {
  user_id?: string;
}

serve(async (req) => {
  // Create a Supabase client with the Admin key
  const supabaseClient = createClient(
    // Supabase API URL - env var exported by default
    Deno.env.get("SUPABASE_URL") ?? "",
    // Supabase API ANON KEY - env var exported by default
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // Check if it's authenticated from an admin
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return new Response(
      JSON.stringify({ error: "Not authenticated" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Verify the token and get the user
  const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

  if (authError || !user) {
    return new Response(
      JSON.stringify({ error: "Not authenticated", details: authError }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Check if the requesting user is an admin
  const { data: isAdmin, error: roleError } = await supabaseClient.rpc(
    'has_role',
    {
      user_id: user.id,
      required_role: 'admin'
    }
  );

  if (roleError || !isAdmin) {
    return new Response(
      JSON.stringify({ error: "Not authorized", details: roleError || "User is not an admin" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Parse the request body to get the user ID to delete
    const requestData: RequestBody = await req.json();
    const userIdToDelete = requestData.user_id;

    if (!userIdToDelete) {
      return new Response(
        JSON.stringify({ error: "No user_id provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Delete user roles first (RLS might prevent direct access)
    const { error: deleteRolesError } = await supabaseClient
      .from('user_roles')
      .delete()
      .eq('user_id', userIdToDelete);
    
    if (deleteRolesError) {
      console.error("Error deleting user roles:", deleteRolesError);
    }

    // Delete the user from auth.users (which will cascade to profiles due to our foreign key)
    const { error: deleteUserError } = await supabaseClient.auth.admin.deleteUser(
      userIdToDelete
    );

    if (deleteUserError) {
      return new Response(
        JSON.stringify({ error: "Failed to delete user", details: deleteUserError }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "User deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
