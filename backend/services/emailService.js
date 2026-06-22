const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password'
  }
});

const sendBookingStatusEmail = async (user, booking, status) => {
  try {
    const statusMessages = {
      approved: 'Your booking has been approved! You can now pay to activate it.',
      active: 'Your booking is now active. The space is reserved for you.',
      cancelled: 'Your booking has been cancelled.',
      completed: 'Your booking has been completed. Thank you!'
    };
    
    const message = statusMessages[status] || `Your booking status has been updated to ${status}.`;
    
    await transporter.sendMail({
      from: '"SamanBhandar" <noreply@samanbhandar.com>',
      to: user.email,
      subject: `Booking #${booking.id} - ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      html: `
        <h2>Booking Update</h2>
        <p>Hello ${user.full_name},</p>
        <p>${message}</p>
        <p><strong>Booking Details:</strong></p>
        <ul>
          <li>Space: ${booking.listing_title || 'N/A'}</li>
          <li>Dates: ${booking.start_date} to ${booking.end_date}</li>
          <li>Amount: Rs ${Number(booking.total_amount).toLocaleString()}</li>
        </ul>
        <p>Login to view details: <a href="${process.env.CLIENT_URL}">SamanBhandar</a></p>
      `
    });
    console.log(`Email sent to ${user.email} for booking #${booking.id} (${status})`);
  } catch (err) {
    console.log('Email sending skipped (dev mode):', err.message);
  }
};

const sendApprovalEmail = async (user) => {
  try {
    await transporter.sendMail({
      from: '"SamanBhandar" <noreply@samanbhandar.com>',
      to: user.email,
      subject: 'Your account has been approved!',
      html: `
        <h2>Welcome to SamanBhandar!</h2>
        <p>Hello ${user.full_name},</p>
        <p>Your ${user.role} account has been approved. You can now login and start using the platform.</p>
        <p><a href="${process.env.CLIENT_URL}/login">Login here</a></p>
      `
    });
    console.log(`Approval email sent to ${user.email}`);
  } catch (err) {
    console.log('Approval email skipped (dev mode):', err.message);
  }
};

module.exports = { sendBookingStatusEmail, sendApprovalEmail };