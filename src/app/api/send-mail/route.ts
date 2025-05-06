
// Modules
import { NextRequest } from 'next/server'
import { render } from '@react-email/render'

// Components
import InquiryTemplate from '@/view/emails/inquiry'
import ResetPasswordTemplate from '@/view/emails/reset-password'

// Utilities
import sendEmail from '@/core/utils/email'
import { INVALIDATE, SUCCESSFUL } from '@/core/constants/codes'
import { EmailTemplateNameTypes } from '@/core/types'


/**
 * 
 * Get email template component from name
 * @param name 
 * @param data 
 * @returns 
 */
function getEmailTemplate(name: EmailTemplateNameTypes, data: any) {
    switch (name) {
        case 'inquiry':
            return InquiryTemplate({...data}) as any

        case 'forgot':
            return ResetPasswordTemplate({...data}) as any
    
        default:
            break
    }
}
 

export async function POST(req: NextRequest) {

    // Get passed data
    const body = await req.json()
    const {recipient, subject, Component} = body
    
    const to = recipient ? recipient : process.env.SMTP_USER || ''
    const from = recipient ? process.env.SMTP_USER || '' : body.email

    try {
        await sendEmail({
            to: to,
            from: from,
            subject: subject,
            html: render(getEmailTemplate(Component, body), {pretty: true}),
        })

        return new Response('Mail sent successfully', {status: SUCCESSFUL})
        
    } catch (e) {
        console.error(e)
        return new Response('Failed to send mail', {status: INVALIDATE})
    }
}