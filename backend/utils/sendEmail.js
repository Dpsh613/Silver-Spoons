import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendReservationEmails = async (reservationDetails) => {
    const { name, email, date, time, partySize } = reservationDetails;

    try {
        // 1. Email to Customer
        const customerEmail = await resend.emails.send({
            from: 'Restaurant <onboarding@resend.dev>', // Change when you verify a domain
            to: email,
            subject: 'We received your reservation request!',
            html: `
        <h2>Hi ${name},</h2>
        <p>Thank you for choosing our restaurant. We have received your reservation request for:</p>
        <ul>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${time}</li>
          <li><strong>Party Size:</strong> ${partySize} people</li>
        </ul>
        <p>Your request is currently <strong>Pending</strong>. We will confirm shortly.</p>
      `,
        });

        // 2. Email to Admin
        const adminEmail = await resend.emails.send({
            from: 'System <onboarding@resend.dev>',
            to: process.env.ADMIN_EMAIL,
            subject: `New Booking Request: ${name} (${partySize} pax)`,
            html: `
        <h2>New Reservation Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date/Time:</strong> ${date} at ${time}</p>
        <p><strong>Party Size:</strong> ${partySize}</p>
        <br/>
        <a href="${process.env.ADMIN_URL}/reservations">Login to Dashboard to Confirm</a>
      `,
        });

        console.log('Emails sent successfully');
    } catch (error) {
        console.error('Error sending emails:', error);
    }
};

// phase 2
export const sendVerificationEmail = async (email, name, verificationToken) => {
    // In production, this URL points to your Next.js Admin Dashboard route, 
    // which will then grab the token from the URL and send it to your Backend API.
    const verifyUrl = `${process.env.ADMIN_URL}/verify-email?token=${verificationToken}`;

    try {
        await resend.emails.send({
            from: 'Security <onboarding@resend.dev>', // Update when domain is verified
            to: email,
            subject: 'Verify your Admin Account',
            html: `
                <h2>Hello ${name},</h2>
                <p>You have been invited to join the Admin Portal.</p>
                <p>Please click the button below to verify your email address. Once verified, an Owner will review and approve your access.</p>
                <a href="${verifyUrl}" style="background-color: #d97706; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
                    Verify Email
                </a>
                <p>If the button doesn't work, copy and paste this link: <br> ${verifyUrl}</p>
                <p>This link is valid for 24 hours.</p>
            `,
        });
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
};

export const sendApprovalEmail = async (email, name) => {
    const loginUrl = `${process.env.ADMIN_URL}/login`;

    try {
        await resend.emails.send({
            from: 'Security <onboarding@resend.dev>',
            to: email,
            subject: 'Your Admin Account is Approved!',
            html: `
                <h2>Hello ${name},</h2>
                <p>Great news! An Owner has approved your access to the Admin Portal.</p>
                <p>You can now log in and access your dashboard.</p>
                <a href="${loginUrl}" style="background-color: #d97706; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
                    Log In Now
                </a>
            `,
        });
        console.log(`Approval email sent to ${email}`);
    } catch (error) {
        console.error('Error sending approval email:', error);
    }
};