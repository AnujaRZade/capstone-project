const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter object
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,//less secure
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    }
});

// Send email function
const SENDEMAIL = async (mailDetails, callback) => {
    try {
        const info = await transporter.sendMail(mailDetails);
        if (callback) callback(info);
    } catch (e) {
        console.log(e);
    }
};
const HTML_TEMPLATE=(text)=>{
    return ` <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Email</title>
       <style>
           body {
               font-family: Arial, sans-serif;
               margin: 0;
               padding: 0;
               background-color: #f4f4f4;
           }
           .container {
               width: 80%;
               margin: 20px auto;
               padding: 20px;
               background-color: #ffffff;
               border-radius: 8px;
               box-shadow: 0 0 10px rgba(0,0,0,0.1);
           }
           .header {
               background-color: #007bff;
               color: #ffffff;
               padding: 10px;
               text-align: center;
               border-radius: 8px 8px 0 0;
           }
           .content {
               padding: 20px;
           }
           .footer {
               background-color: #f1f1f1;
               color: #777;
               padding: 10px;
               text-align: center;
               border-radius: 0 0 8px 8px;
           }
       </style>
   </head>
   <body>
       <div class="container">
           <div class="header">
               <h1>Welcome to Our Service</h1>
           </div>
           <div class="content">
               <p>Hello,</p>
               <p>${text}</p>
               <p>Best regards,</p>
               <p>The Team</p>
           </div>
           <div class="footer">
               <p>&copy; 2024 Company Name. All rights reserved.</p>
           </div>
       </div>
   </body>
   </html>
`
}

const message="hi how are you"
// Email options
const option = {
    from: process.env.EMAIL,  // your verified email id
    to: 'anujazade@gmail.com',
    subject: 'Sending email with Nodemailer is fun',
    text: message,
   html:HTML_TEMPLATE(message),
}

async function emailBuilder(to, subject, text) {
    try {
        const option = {
            from: process.env.EMAIL,  // your verified email id
            to: to,
            subject: subject,
            text: text,
            html: HTML_TEMPLATE(text)
        };
        // Send email
        await SENDEMAIL(option, (info) => {
            console.log("Email sent successfully - messageId:", info.messageId);
        });
    } catch (e) {
        console.log(e);
    }
}


module.exports = {
    SENDEMAIL,
    HTML_TEMPLATE,
    emailBuilder,
};