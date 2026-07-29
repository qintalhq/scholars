// ===========================
// The Scholars - Supabase
// ===========================

// Replace these with your own values
const SUPABASE_URL = "https://purjntpgiycrhlqsesxz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_K1m-J1D2X1DnvO0h3O4DNw_VuPEq2_j";

// Create Supabase client
const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Make it available to other JavaScript files
window.supabaseClient = supabaseClient;
