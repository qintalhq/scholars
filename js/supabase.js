// ===========================
// The Scholars - Supabase
// ===========================

// Replace these with your own values
const SUPABASE_URL = "https://purjntpgiycrhlqsesxz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1cmpudHBnaXljcmhscXNlc3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNTU3NDgsImV4cCI6MjEwMDczMTc0OH0.cnCgMp_nNXssYvC_-ftos32u4EsU1HAvwshi8MIsPgA";

// Create Supabase client
const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Make it available to other JavaScript files
window.supabaseClient = supabaseClient;
