const fileUploadService = require('./src/services/fileUploadService');

async function testSignedUrl() {
  try {
    console.log('Testing signed URL generation...');
    
    // Test with the exact file path from the user's example
    const filePath = 'files/files-1752950212102-file-sample_150kB.pdf';
    
    console.log('File path:', filePath);
    
    // Test getting signed URL
    const signedUrl = await fileUploadService.getSignedUrl('uploads', filePath, 3600);
    console.log('✅ Signed URL generated:', signedUrl);
    
    console.log('\n🎉 Signed URL test passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Error details:', error);
  }
}

// Run the test
testSignedUrl(); 