const nodemailer = require("nodemailer") ;
const { catchAsync } = require("./catchAsync");

const sendEmails=async(options)=>{
    const transporter =  nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT, // Change to your email service provider
        auth: {
            user: process.env.EMAIL_USER_NAME, // Replace with your email address
            pass: process.env.EMAIL_PASSWORD, // Replace with your email password
        }
    });


    const mailOptions = {
        from: 'Magic Elves <from@example.com>',
        to: options.email,
        subject: options.subject,
        text:options.message
    };

    // Send email
  await transporter.sendMail(mailOptions);


}

module.exports = sendEmails