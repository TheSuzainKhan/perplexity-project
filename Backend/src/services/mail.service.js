import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: "v1", auth: oauth2Client });

function createMimeMessage({ to, subject, html }) {
    const message = [
        `To: ${to}`,
        `From: ${process.env.GOOGLE_USER}`,
        `Subject: ${subject}`,
        `MIME-Version: 1.0`,
        `Content-Type: text/html; charset=utf-8`,
        ``,
        html,
    ].join("\n");

    return Buffer.from(message).toString("base64url");
}

export async function verifyMailTransporter() {
    await oauth2Client.getAccessToken();
    console.log("Email transporter is ready");
}

export async function sendEmail({ to, subject, html }) {
    const raw = createMimeMessage({ to, subject, html });

    const details = await gmail.users.messages.send({
        userId: "me",
        requestBody: { raw },
    });

    console.log("Email sent:", details.data);
    return details.data;
}