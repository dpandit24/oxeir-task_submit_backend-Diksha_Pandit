const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

/**
 * Utility to set up Supabase storage bucket
 */
async function setupSupabaseBucket() {
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase configuration is missing');
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Check if bucket exists
    const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('uploads');
    
    if (bucketError && bucketError.message.includes('not found')) {
      console.log('Creating uploads bucket...');
      
      // Create the bucket
      const { data: createData, error: createError } = await supabase.storage.createBucket('uploads', {
        public: true, // Make bucket public for file access
        allowedMimeTypes: ['application/pdf'], // Only allow PDF files
        fileSizeLimit: env.MAX_FILE_SIZE
      });

      if (createError) {
        console.error('Failed to create bucket:', createError.message);
        return;
      }

      console.log('Successfully created uploads bucket');
    } else if (bucketError) {
      console.error('Error checking bucket:', bucketError.message);
    } else {
      console.log('Uploads bucket already exists');
    }
  } catch (error) {
    console.error('Error setting up Supabase:', error.message);
  }
}

module.exports = { setupSupabaseBucket }; 