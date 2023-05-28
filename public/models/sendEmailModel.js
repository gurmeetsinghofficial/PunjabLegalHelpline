
const nodemailer = require("nodemailer");
const {google} = require("googleapis");

const CLIENT_ID = '389862529956-ebdso6si677i9lre21lrdjr8jj6ufmam.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04SnYv3_ApzL7CgYIARAAGAQSNwF-L9IrmOLJHJdXjKfb_dBKrGYyZROtmgujAGR7OJQqmXsiwSddEVL57WdjubhOU9Ky-d2TQUU';

const oAuth2Client = new google.auth. OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(reqInfo) {
    try{
        let {
            lawyerRequired,
            nameOfClient,
            phnNo,
            date,
        }=reqInfo;
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service:'gmail',
            auth:{
                type: 'OAuth2',
                user: 'gurmeetallawadhi@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            }
        });
        let mailOptions = {
            from: 'gurmeetallawadhi@gmail.com', // sender address
            to: 'myselfjasmeet@gmail.com', // list of receivers
            // to: 'amanindersingh751@gmail.com', // list of receivers
            subject: `Online Appointment for Advocate ${lawyerRequired}`, // Subject line
            text: `Hi sir,\n We have received booking for Lawyer = '${lawyerRequired}'.\nName of the Client = '${nameOfClient}'.\nContact Details of the Client = '${phnNo}'!`, // plain text body
            html: `<b>Hi sir!</b><br/><br/><p>We have received a booking for Lawyer = <b>'${lawyerRequired}'</b>.\nName of the Client = <b>'${nameOfClient}'</b>.\nContact Details of the Client = <b>'${phnNo}'</b> for the date = <b>'${date}'</b>!<br/><br/>Please reply as soon as possible<br/><br/>Regards<br/>Legal Trinity Team` // html body
        };
        console.log(JSON.stringify(mailOptions));
        const result = await transport.sendMail(mailOptions);
        return result;
    } catch(error) {    
        return error;

    }
}

module.exports.sendMailMain = async function sendMailMain(reqInfo) {
    sendMail(reqInfo)
    .then((result) => console.log('Email sent...', result))
    .catch((error) => console.log(error.message));
}
