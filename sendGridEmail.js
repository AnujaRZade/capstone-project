const sgmail = require("@sendgrid/mail");
require('dotenv').config(); // Ensure you call the config() method

// Set the SendGrid API key
sgmail.setApiKey(process.env.SENDGRID_API);

// Define the email message
const msg = {
    to:'anujarajeshzade@gmail.com',
    from:'anujazade@gmail.com',  // your verified email id by sendgrid
    subject: 'Sending email with SendGrid is fun',
    text: 'hello, keep going',
    html: '<strong>well doing</strong>'
};

// Send the email
// sgmail.send(msg)
//     .then(() => {
//         console.log("Email sent");
//     })
//     .catch((error) => { 
//         console.error("Error sending email:", error.response.body.errors); // Log specific error details
//     });
