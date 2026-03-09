// Test email configuration
require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = async () => {
  console.log('📧 Testing Email Configuration...\n');
  
  console.log('Current SMTP Settings:');
  console.log('  Host:', process.env.SMTP_HOST);
  console.log('  Port:', process.env.SMTP_PORT);
  console.log('  User:', process.env.SMTP_USER);
  console.log('  Pass:', process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'Not set');
  console.log('  From:', process.env.EMAIL_FROM);
  console.log('');

  if (process.env.SMTP_USER === 'demo' || !process.env.SMTP_USER) {
    console.log('❌ SMTP credentials not configured!');
    console.log('📖 Please read EMAIL_SETUP_GUIDE.md for setup instructions.');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  try {
    console.log('🔌 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    const testEmail = process.argv[2] || process.env.SMTP_USER;
    console.log(`📨 Sending test email to: ${testEmail}`);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: testEmail,
      subject: 'Test Email from FindMe',
      text: 'This is a test email from your FindMe application. If you received this, email notifications are working correctly!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>✅ Email Configuration Successful!</h2>
          <p>This is a test email from your FindMe application.</p>
          <p>If you received this, email notifications are working correctly!</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            FindMe - Lost and Found Platform<br>
            <a href="${process.env.CLIENT_URL}">${process.env.CLIENT_URL}</a>
          </p>
        </div>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('\n📬 Check your inbox (and spam folder) for the test email.');
    console.log('');
    console.log('✅ Email notifications are now configured and working!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Email test failed:', error.message);
    console.log('\n📖 Common issues:');
    console.log('   - Gmail: Use App Password, not regular password');
    console.log('   - Check SMTP_HOST and SMTP_PORT are correct');
    console.log('   - Verify credentials are correct');
    console.log('   - Check network/firewall settings');
    console.log('\n📖 Read EMAIL_SETUP_GUIDE.md for detailed setup instructions.');
    process.exit(1);
  }
};

console.log('═══════════════════════════════════════════════════════');
console.log('  FindMe - Email Configuration Test');
console.log('═══════════════════════════════════════════════════════\n');

testEmail();
