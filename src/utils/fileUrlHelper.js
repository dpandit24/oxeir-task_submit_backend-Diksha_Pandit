const fileUploadService = require('../services/fileUploadService');
const env = require('./env');

/**
 * Add signed URLs to submission objects
 * @param {Array|Object} submissions - Submission object(s) to process
 * @returns {Array|Object} - Submission(s) with signed URLs added
 */
async function addSignedUrlsToSubmissions(submissions) {
  try {
    // Check if Supabase is configured
    if (!env.SUPABASE_URL || !env.SUPABASE_KEY) {
      console.log('Supabase not configured, adding file paths as URLs');
      // Add file paths as simple URLs for development/testing
      if (!Array.isArray(submissions)) {
        const submissionObj = submissions.toObject ? submissions.toObject() : { ...submissions };
        if (submissionObj.fileUrl) {
          submissionObj.fileUrl = `/uploads/${submissionObj.fileUrl}`;
        }
        return submissionObj;
      }
      
      const processedSubmissions = submissions.map(submission => {
        const submissionObj = submission.toObject ? submission.toObject() : { ...submission };
        if (submissionObj.fileUrl) {
          submissionObj.fileUrl = `/uploads/${submissionObj.fileUrl}`;
        }
        return submissionObj;
      });
      return processedSubmissions;
    }
    
    console.log('Processing submissions for signed URLs:', submissions);
    
    // Handle single submission object
    if (!Array.isArray(submissions)) {
      console.log('Processing single submission:', submissions);
      const submissionObj = submissions.toObject ? submissions.toObject() : { ...submissions };
      if (submissionObj.fileUrl) {
        try {
          console.log('Generating signed URL for:', submissionObj.fileUrl);
          const signedUrl = await fileUploadService.getSignedUrl('uploads', submissionObj.fileUrl, 3600);
          submissionObj.fileUrl = signedUrl;
          console.log('Generated signed URL:', signedUrl);
        } catch (error) {
          console.error('Error generating signed URL for submission:', error.message);
          submissionObj.fileUrl = null;
        }
      } else {
        console.log('No fileUrl found in submission');
      }
      return submissionObj;
    }

    // Handle array of submissions
    console.log('Processing array of submissions, count:', submissions.length);
    const processedSubmissions = await Promise.all(
      submissions.map(async (submission, index) => {
        console.log(`Processing submission ${index}:`, submission);
        const submissionObj = submission.toObject ? submission.toObject() : { ...submission };
        if (submissionObj.fileUrl) {
          try {
            console.log(`Generating signed URL for submission ${index}:`, submissionObj.fileUrl);
            const signedUrl = await fileUploadService.getSignedUrl('uploads', submissionObj.fileUrl, 3600);
            submissionObj.fileUrl = signedUrl;
            console.log(`Generated signed URL for submission ${index}:`, signedUrl);
          } catch (error) {
            console.error(`Error generating signed URL for submission ${index}:`, error.message);
            submissionObj.fileUrl = null;
          }
        } else {
          console.log(`No fileUrl found in submission ${index}`);
        }
        return submissionObj;
      })
    );

    console.log('Final processed submissions:', processedSubmissions);
    return processedSubmissions;
  } catch (error) {
    console.error('Error processing signed URLs:', error.message);
    return submissions;
  }
}

module.exports = { addSignedUrlsToSubmissions }; 