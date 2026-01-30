const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

/**
 * Handles the contact form submission.
 * Sends an email to the admin with the user's message.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.submitContactForm = async (req, res) => {
    const { fullName, emailAddress, message } = req.body;

    // Validate request body
    if (!fullName || !emailAddress || !message) {
        logger.error('❌ Contact form submission failed: missing fields');
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Create a transporter using Gmail service
        // Note: In a production environment, consider using OAuth2 or a dedicated email service provider like SendGrid or AWS SES.
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Send the email
        await transporter.sendMail({
            from: `"${fullName}" <${emailAddress}>`,
            to: process.env.EMAIL_USER,
            subject: `🌱 New Contact from ${fullName}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>New Contact Message</h2>
                    <p><strong>Name:</strong> ${fullName}</p>
                    <p><strong>Email:</strong> ${emailAddress}</p>
                    <p><strong>Message:</strong></p>
                    <blockquote style="border-left: 4px solid #eee; padding-left: 10px; color: #555;">
                        ${message}
                    </blockquote>
                </div>
            `,
        });

        logger.info(`📩 Contact email received from ${emailAddress} by ${fullName}`);
        res.status(200).json({ message: 'Message sent successfully!' });

    } catch (err) {
        logger.error(`❌ Email sending failed from ${emailAddress}: ${err.message}`);
        res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    }
};
