// Test email service for development - simulates email sending
const testSendEmail = async (options) => {
  console.log('\n🧪 === EMAIL SIMULATION (Development Mode) ===');
  console.log(`📧 To: ${options.to}`);
  console.log(`📋 Subject: ${options.subject}`);
  
  // Extract OTP from HTML content
  const otpMatch = options.html.match(/<div class="otp-code">([0-9]{6})<\/div>/);
  if (otpMatch) {
    console.log('🔢 OTP CODE: ' + '='.repeat(20));
    console.log(`🎯 ${otpMatch[1]}`);
    console.log('='.repeat(32));
    console.log('💡 Use this OTP in your application!');
  } else {
    console.log('📄 Email Content:');
    console.log(options.html.replace(/<[^>]*>/g, '')); // Strip HTML tags
  }
  
  console.log('\n⚠️  NOTE: This is DEVELOPMENT MODE!');
  console.log('   No actual email was sent.');
  console.log('   To send real emails, configure Gmail credentials in .env');
  console.log('===============================================\n');
  
  // Return success for testing
  return Promise.resolve();
};

export default testSendEmail;
