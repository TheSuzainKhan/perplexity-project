import nodemailer from "nodemailer";

let transporter;

function getMissingMailEnvVars() {
    const requiredEnvVars = [
        "GOOGLE_USER",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "GOOGLE_REFRESH_TOKEN",
    ];

    return requiredEnvVars.filter((envVar) => !process.env[envVar]);
}

function getTransporter() {
    if (transporter) {
        return transporter;
    }

    const missingEnvVars = getMissingMailEnvVars();

    if (missingEnvVars.length > 0) {
        throw new Error(`Missing mail configuration: ${missingEnvVars.join(", ")}`);
    }

    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.GOOGLE_USER,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            clientId: process.env.GOOGLE_CLIENT_ID,
        },
    });

    return transporter;
}

export async function verifyMailTransporter() {
    const mailTransporter = getTransporter();
    await mailTransporter.verify();
    console.log("Email transporter is ready");
}

export async function sendEmail({ to, subject, html, text }) {
    const mailTransporter = getTransporter();

    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text,
    };

    const details = await mailTransporter.sendMail(mailOptions);
    console.log("Email sent:", details);

    return details;
}
