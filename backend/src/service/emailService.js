const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text, html) => {
    const msg = {
        to,
        from: process.env.FROM_EMAIL,
        subject,
        text,
        html,
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = { sendEmail };