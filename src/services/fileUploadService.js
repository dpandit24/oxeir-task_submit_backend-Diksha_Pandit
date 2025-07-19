const { createClient } = require('@supabase/supabase-js');
const env = require('../utils/env');

/**
 * Service for handling file uploads to Supabase storage
 */
class FileUploadService {
  constructor() {
    const supabaseUrl = env.SUPABASE_URL;
    const supabaseKey = env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase configuration is missing');
      throw new Error('Supabase configuration is missing');
    }

    try {
      this.supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
      
      // Test the connection asynchronously
      this.testConnection();
    } catch (error) {
      console.error(`Failed to initialize Supabase client: ${error.message}`);
      throw error;
    }
  }

  async testConnection() {
    try {
      await this.supabase.storage.getBucket('uploads');
      console.log('Successfully connected to Supabase storage');
    } catch (error) {
      console.error(`Failed to connect to Supabase storage: ${error.message}`);
      // Don't throw here to allow the service to be used even if bucket doesn't exist yet
    }
  }

  /**
   * Upload a single file to Supabase storage
   * @param {Object} file - The file object from multer
   * @param {string} bucket - The storage bucket name
   * @param {string} path - Optional path within the bucket
   * @returns {Promise<string>} The file path in Supabase storage
   */
  async uploadFile(file, bucket = 'uploads', path = 'submissions') {
    try {
      if (!file || !file.buffer) {
        throw new Error('Invalid file: file or file buffer is missing');
      }

      const fileName = `${path}-${Date.now()}-${file.originalname}`;
      const filePath = path ? `${path}/${fileName}` : fileName;

      console.log(`Attempting to upload file to ${bucket}/${filePath}`);
      console.log(`File details: size=${file.size}, mimetype=${file.mimetype}`);

      // First, check if the bucket exists
      const { data: bucketData, error: bucketError } = await this.supabase.storage.getBucket(bucket);
      if (bucketError) {
        console.error(`Bucket check failed: ${bucketError.message}`);
        throw bucketError;
      }

      // Upload the file
      const { data: uploadData, error: uploadError } = await this.supabase.storage
        .from(bucket)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        console.error(`Upload failed: ${uploadError.message}`, {
          error: uploadError,
          bucket,
          filePath,
          fileSize: file.size,
          mimeType: file.mimetype
        });
        throw uploadError;
      }

      if (!uploadData) {
        throw new Error('Upload succeeded but no data returned');
      }

      console.log(`File uploaded successfully: ${filePath}`);
      return filePath;
    } catch (error) {
      console.error(`Error uploading file: ${error.message}`, {
        error,
        bucket,
        path,
        fileName: file?.originalname,
        fileSize: file?.size,
        mimeType: file?.mimetype
      });
      throw error;
    }
  }

  /**
   * Upload multiple files to Supabase storage
   * @param {Array} files - Array of files to upload
   * @param {string} bucket - The storage bucket name
   * @param {string} path - Optional path within the bucket
   * @returns {Promise<Array<string>>} Array of file paths for the uploaded files
   */
  async uploadFiles(files, bucket = 'uploads', path = 'submissions') {
    try {
      const uploadPromises = files.map(file => this.uploadFile(file, bucket, path));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error(`Error uploading files: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete a file from Supabase storage
   * @param {string} bucket - The storage bucket name
   * @param {string} path - The path of the file to delete
   */
  async deleteFile(bucket, path) {
    try {
      const { error } = await this.supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        console.error(`Failed to delete file: ${error.message}`);
        throw error;
      }
    } catch (error) {
      console.error(`Error deleting file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete multiple files from Supabase storage
   * @param {string} bucket - The storage bucket name
   * @param {Array<string>} paths - Array of file paths to delete
   */
  async deleteFiles(bucket, paths) {
    try {
      const { error } = await this.supabase.storage
        .from(bucket)
        .remove(paths);

      if (error) {
        console.error(`Failed to delete files: ${error.message}`);
        throw error;
      }
    } catch (error) {
      console.error(`Error deleting files: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate a signed URL for a file in Supabase storage
   * @param {string} bucket - The storage bucket name
   * @param {string} path - The path of the file
   * @param {number} expiresIn - Optional expiration time in seconds (default: 3600 - 1 hour)
   * @returns {Promise<string>} The signed URL for the file
   */
  async getSignedUrl(bucket, path, expiresIn = 3600) {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (error) {
        console.error(`Failed to generate signed URL: ${error.message}`);
        throw error;
      }

      if (!data?.signedUrl) {
        throw new Error('No signed URL returned from Supabase');
      }

      return data.signedUrl;
    } catch (error) {
      console.error(`Error generating signed URL: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get the public URL for a file in Supabase storage
   * @param {string} bucket - The storage bucket name
   * @param {string} path - The path of the file
   * @returns {string} The public URL for the file
   */
  getPublicUrl(bucket, path) {
    const { data } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
}

// Create a singleton instance
const fileUploadService = new FileUploadService();

module.exports = fileUploadService; 