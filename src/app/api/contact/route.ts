import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { NextResponse } from 'next/server';

// Initialize the SES client
const ses = new SESClient({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, subject, message, recaptchaToken } = body;

        // Validate required fields
        if (!name || !email || !subject || !message || !recaptchaToken) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Verify reCAPTCHA token
        const recaptchaResponse = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
        );
        const recaptchaData = await recaptchaResponse.json();

        if (!recaptchaData.success) {
            return NextResponse.json(
                { error: 'reCAPTCHA verification failed' },
                { status: 400 }
            );
        }

        // Prepare email parameters
        const emailParams = {
            Source: process.env.CONTACT_SENDER_EMAIL,
            Destination: {
                ToAddresses: [process.env.CONTACT_EMAIL!],
            },
            Message: {
                Subject: {
                    Data: `Contact Form: ${subject}`,
                    Charset: 'UTF-8',
                },
                Body: {
                    Text: {
                        Data: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
                        `,
                        Charset: 'UTF-8',
                    },
                    Html: {
                        Data: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Subject:</strong> ${subject}</p>
<h3>Message:</h3>
<p>${message.replace(/\n/g, '<br>')}</p>
                        `,
                        Charset: 'UTF-8',
                    },
                },
            },
            ReplyToAddresses: [email],
        };

        // Send email using AWS SES
        const command = new SendEmailCommand(emailParams);
        await ses.send(command);

        console.log(command)

        return NextResponse.json(
            { message: 'Email sent successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        );
    }
} 