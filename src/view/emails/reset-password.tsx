/**
 * @name ResetPasswordTemplate
 * @file reset-password.tsx
 * @description reset password emailer template
 */

// Modules
import React from 'react'
import { 
    Column, 
    Container, 
    Html, 
    Link, 
    Row, 
    Section, 
    Text 
} from '@react-email/components'


/**
 * 
 * Styling for template
 */
const main: React.CSSProperties = {
    backgroundColor: '#ffffff',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
    lineHeight: 1
}

const container: React.CSSProperties = {
    margin: '0 auto',
    width: 540,
    backgroundColor: '#f4f8ff',
    borderRadius: 16,
}

const spaceX: React.CSSProperties = {
    width: 32,
}

const link: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '16px',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: 8,
    backgroundColor: '#196eed',
    display: 'inline-block',
    marginBottom: 16,
    padding: '16px 32px'
}

const paragraph: React.CSSProperties = {
    fontSize: 16,
    lineHeight: '1.35',
    color: '#3e4247',
    margin: '0 0 16px'
}


const ResetPasswordTemplate: React.FC = ()  => {

    return (
        <Html>
            <Section style={main}>
                <Container style={container}>
                    <Row>
                        <Column style={{height: 40}}></Column>
                    </Row>
                    <Row>
                        <Column style={spaceX}></Column>
                        <Column style={{width: 476}}>
                            <Text style={paragraph}>Hi <b>John Deo</b>,</Text>
                            <Text style={paragraph}>You recently requested to reset the password for your Listen account. Click the button below to proceed.</Text>
                            <Link style={link} href='#'>Reset Password</Link>
                            <Text style={paragraph}>If you did not request a password reset, please ignore this email or reply to let us know. This password reset link is only valid for the next 6 hours.</Text>
                            <Text style={paragraph}>Thanks, the Listen team</Text>
                        </Column>
                        <Column style={spaceX}></Column>
                    </Row>
                    <Row>
                        <Column style={{height: 32}}></Column>
                    </Row>
                </Container>
            </Section>
        </Html>
    )
}


ResetPasswordTemplate.displayName = 'ResetPasswordTemplate'
export default ResetPasswordTemplate