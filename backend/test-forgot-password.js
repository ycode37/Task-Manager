import fetch from 'node-fetch';

async function testForgotPassword() {
  try {
    console.log('Testing forgot password API...');
    
    const response = await fetch('http://localhost:4000/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com'
      }),
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (data.success) {
      console.log('✅ Forgot password API is working!');
      console.log('📧 Check the server console for the OTP (it will be displayed there for testing)');
    } else {
      console.log('❌ Forgot password API failed:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Error testing forgot password:', error.message);
  }
}

testForgotPassword();
