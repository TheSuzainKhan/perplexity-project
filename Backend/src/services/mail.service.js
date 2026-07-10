import { google } from "googleapis";
import nodemailer from "nodemailer";

async function getTransporter() {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const { token } = await oauth2Client.getAccessToken();

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.GOOGLE_USER,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken: token,
        },
    });
}

export async function verifyMailTransporter() {
    const transporter = await getTransporter();
    await transporter.verify();
    console.log("Email transporter is ready");
}

export async function sendEmail({ to, subject, html, text }) {
    const transporter = await getTransporter();

    const details = await transporter.sendMail({
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text,
    });

    console.log("Email sent:", details);
    return details;
}