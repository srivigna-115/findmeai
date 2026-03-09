// Script to resend match notification emails
require('dotenv').config();
const mongoose = require('mongoose');
const Match = require('./src/models/Match');
const User = require('./src/models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const resendEmails = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🔍 Finding matches...');
    const matches = await Match.find({});
    
    if (matches.length === 0) {
      console.log('❌ No matches found');
      process.exit(0);
    }

    console.log(`📦 Found ${matches.length} match(es)\n`);

    for (const match of matches) {
      console.log('═'.repeat(60));
      console.log(`Processing Match ID: ${match._id}`);
      console.log('═'.repeat(60));

      const [lostUser, foundUser] = await Promise.all([
        User.findById(match.lostUser),
        User.findById(match.foundUser)
      ]);

      if (!lostUser || !foundUser) {
        console.log('❌ Users not found for this match');
        continue;
      }

      const chatLink = `${process.env.CLIENT_URL}/chat/${match.chatRoomId}`;

      console.log(`\n👤 Lost Item Owner: ${lostUser.name} (${lostUser.email})`);
      console.log(`👤 Found Item Owner: ${foundUser.name} (${foundUser.email})`);
      console.log(`💬 Chat Link: ${chatLink}`);
      console.log(`📊 Match Score: ${(match.matchScore * 100).toFixed(2)}%\n`);

      // Send email to lost item owner
      console.log(`📧 Sending email to ${lostUser.email}...`);
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: lostUser.email,
          subject: 'Match Found - FindMe',
          text: `Hi ${lostUser.name},\n\nWe found a potential match for your lost item!\n\nClick here to chat: ${chatLink}\n\n---\nFindMe - Lost and Found Platform`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
              <h2 style="color: #3498db;">🎯 Match Found!</h2>
              <p>Hi <strong>${lostUser.name}</strong>,</p>
              <p>Great news! We found a potential match for your lost item!</p>
              <p style="margin: 30px 0;">
                <a href="${chatLink}" style="background: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                  💬 Open Chat
                </a>
              </p>
              <p style="color: #666; font-size: 14px;">
                Or copy this link: <a href="${chatLink}">${chatLink}</a>
              </p>
              <p style="color: #666; font-size: 14px;">Match Score: ${(match.matchScore * 100).toFixed(2)}%</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px;">
                FindMe - Lost and Found Platform<br>
                <a href="${process.env.CLIENT_URL}">${process.env.CLIENT_URL}</a>
              </p>
            </div>
          `
        });
        console.log(`✅ Email sent to ${lostUser.email}`);
      } catch (error) {
        console.log(`❌ Failed to send email to ${lostUser.email}: ${error.message}`);
      }

      // Send email to found item owner
      console.log(`📧 Sending email to ${foundUser.email}...`);
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: foundUser.email,
          subject: 'Match Found - FindMe',
          text: `Hi ${foundUser.name},\n\nYour found item matches someone's lost item!\n\nClick here to chat: ${chatLink}\n\n---\nFindMe - Lost and Found Platform`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
              <h2 style="color: #3498db;">🎯 Match Found!</h2>
              <p>Hi <strong>${foundUser.name}</strong>,</p>
              <p>Great news! Your found item matches someone's lost item!</p>
              <p style="margin: 30px 0;">
                <a href="${chatLink}" style="background: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                  💬 Open Chat
                </a>
              </p>
              <p style="color: #666; font-size: 14px;">
                Or copy this link: <a href="${chatLink}">${chatLink}</a>
              </p>
              <p style="color: #666; font-size: 14px;">Match Score: ${(match.matchScore * 100).toFixed(2)}%</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px;">
                FindMe - Lost and Found Platform<br>
                <a href="${process.env.CLIENT_URL}">${process.env.CLIENT_URL}</a>
              </p>
            </div>
          `
        });
        console.log(`✅ Email sent to ${foundUser.email}`);
      } catch (error) {
        console.log(`❌ Failed to send email to ${foundUser.email}: ${error.message}`);
      }

      console.log('');
    }

    console.log('═'.repeat(60));
    console.log('✅ All emails sent successfully!');
    console.log('═'.repeat(60));
    console.log('\n📬 Check your email inboxes (and spam folders)!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

console.log('═══════════════════════════════════════════════════════');
console.log('  FindMe - Resend Match Notification Emails');
console.log('═══════════════════════════════════════════════════════\n');

resendEmails();
