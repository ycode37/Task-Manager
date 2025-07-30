// Test email service for development - simulates email sending
const testSendEmail = async (options) => {
  console.log('\n=== EMAIL SIMULATION (Development Mode) ===');
  console.log(`To: ${options.to}`);
  console.log(`Subject: ${options.subject}`);
  console.log('Body:', options.html.replace(/<[^>]*>/g, '')); // Strip HTML tags
  console.log('===============================================\n');
  
  // Return success for testing
  return Promise.resolve();
};

export default testSendEmail;
