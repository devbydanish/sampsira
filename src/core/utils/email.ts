/**
 * 
 * @file email.ts
 * @description use to send email
 */

// Modules
import nodemailer from 'nodemailer'


type EmailPayloadTypes = {
    to: string
    from: string
    subject: string
    html: string
}

type SMTPOptionTypes = {
    host: string
    port: number
    secure: boolean
    auth: {
        user: string
        pass: string
    }
}

// SMTP options
const options: SMTPOptionTypes = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
        user: process.env.SMTP_USER || 'user',
        pass: process.env.SMTP_PASSWORD || 'password',
    },
}


/**
 * 
 * Send email through the nodemailer
 * @param data 
 * @returns 
 */
export default async function sendEmail(data: EmailPayloadTypes) {

    const transporter = nodemailer.createTransport({...options})
    
    return await transporter.sendMail({...data})
}
