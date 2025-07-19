const fileUploadService = require('./src/services/fileUploadService');

// Mock file object for testing
const mockFile = {
  originalname: 'test-document.pdf',
  mimetype: 'application/pdf',
  size: 1024,
  buffer: Buffer.from('This is a test PDF file content')
};

async function testSupabaseUpload() {
  try {
    console.log('Testing Supabase file upload...');
    
    // Test single file upload
    const filePath = await fileUploadService.uploadFile(mockFile, 'uploads', 'test');
    console.log('✅ File uploaded successfully:', filePath);
    
    // Test getting signed URL
    const signedUrl = await fileUploadService.getSignedUrl('uploads', filePath, 3600);
    console.log('✅ Signed URL generated:', signedUrl);
    
    // Test multiple file upload
    const mockFiles = [mockFile, { ...mockFile, originalname: 'test-document-2.pdf' }];
    const filePaths = await fileUploadService.uploadFiles(mockFiles, 'uploads', 'test');
    console.log('✅ Multiple files uploaded successfully:', filePaths);
    
    console.log('\n🎉 All tests passed! Supabase integration is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Make sure you have configured SUPABASE_URL and SUPABASE_KEY in your .env file');
  }
}

// Run the test
testSupabaseUpload(); 