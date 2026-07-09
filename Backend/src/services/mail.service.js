import dns from "dns";
import nodemailer from "nodemailer";

let transporterPromise;

function getMissingMailEnvVars() {
    const requiredEnvVars = [
        "GOOGLE_USER",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "GOOGLE_REFRESH_TOKEN",
    ];

    return requiredEnvVars.filter((envVar) => !process.env[envVar]);
}

async function getTransporter() {
    if (transporterPromise) {
        return transporterPromise;
    }

    const missingEnvVars = getMissingMailEnvVars();

    if (missingEnvVars.length > 0) {
        throw new Error(`Missing mail configuration: ${missingEnvVars.join(", ")}`);
    }

    transporterPromise = dns.promises.resolve4("smtp.gmail.com")
        .then((addresses) => {
            if (!addresses.length) {
                throw new Error("No IPv4 address found for smtp.gmail.com");
            }

            return nodemailer.createTransport({
                host: addresses[0],
                port: 587,
                secure: false,
                requireTLS: true,
                connectionTimeout: 15000,
                greetingTimeout: 15000,
                socketTimeout: 20000,
                auth: {
                    type: "OAuth2",
                    user: process.env.GOOGLE_USER,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                    clientId: process.env.GOOGLE_CLIENT_ID,
                },
                tls: {
                    servername: "smtp.gmail.com",
                },
            });
        })
        .catch((error) => {
            transporterPromise = null;
            throw error;
        });

    return transporterPromise;
}

export async function verifyMailTransporter() {
    const mailTransporter = await getTransporter();
    await mailTransporter.verify();
    console.log("Email transporter is ready");
}

export async function sendEmail({ to, subject, html, text }) {
    const mailTransporter = await getTransporter();

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
