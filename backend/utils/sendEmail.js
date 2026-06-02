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