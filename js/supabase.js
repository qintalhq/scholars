// ===========================
// The Scholars - Supabase
// ===========================

// Replace these with your own values
const SUPABASE_URL = "https://purjntpgiycrhlqsesxz.supabase.co";
const SUPABASE_ANON_KEY = "purjntpgiycrhlqsesxz";

// Create Supabase client
const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Make it available to other JavaScript files
window.supabaseClient = supabaseClient;
