// mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter;

async function configureTransporter() {
    transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", 
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false // Allow self-signed certificates (optional)
        }
    });
  //     await transporter.verify()
  // .then(() => {
  //   console.log("SMTP connection established successfully.");
  // })
  // .catch(err => {
  //   console.error("SMTP connection failed:", err);
  //   console.error("Error stack trace:", err.stack);
  // });
}

configureTransporter();

module.exports = { 

sendEmail : async(email, text) => {
  const mailOptions = {
    from: '"Learning Platform" <no-reply@yourdomain.com>',
    to: email,
    subject: "Welcome to Learning Platform,Message from Admin",    
    text,
  };

  await transporter.sendMail(mailOptions);
},

sendCourseDetail: async(from_name,to_email, course_name, course_description, y_link, p_link ) => {

    const mailOptions = {
        from: '"Learning Platform" <no-reply@yourdomain.com>',
        to: to_email,
        subject: "Course Information",
        text: `Hello,\n\nHere are the details for the course ${course_name} from Instructor ${from_name}:\n\nCourse Name: ${course_name}\nDescription: ${course_description}\nVideo Link: ${y_link}\nImage Link: ${p_link}\n\nBest Regards,\nYour Team`,
    };
    await transporter.sendMail(mailOptions);

},
sendSummary : async(email,subject, text) => {
    const mailOptions = {
      from: '"Learning Platform" <no-reply@yourdomain.com>',
      to: email,
      subject,
      text,
    };
  
    await transporter.sendMail(mailOptions);
  },
}