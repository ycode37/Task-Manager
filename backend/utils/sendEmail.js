import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Check if email credentials are configured
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.error('❌ Email credentials not configured!');
    throw new Error('Email credentials not configured. Please set GMAIL_USER and GMAIL_PASS in your .env file.');
  }

  // Validate email credentials format
  if (process.env.GMAIL_USER === 'your-email@gmail.com' || process.env.GMAIL_PASS === 'your-app-password') {
    console.error('❌ Default email credentials detected!');
    throw new Error('Please update the email credentials in your .env file with real Gmail credentials.');
  }

  console.log('📧 Attempting to send email via Gmail...');
  
  const transporter = nodemailer.createTransporter({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `Task Management System <${process.env.GMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', options.to);
    console.log('📨 Message ID:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    throw error;
  }
};

export default sendEmail;

