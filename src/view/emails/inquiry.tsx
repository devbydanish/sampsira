/**
 * @name InquiryTemplate
 * @file inquiry.tsx
 * @description inquiry emailer template
 */

// Modules
import React from 'react'
import { 
    Column, 
    Container, 
    Html, 
    Img, 
    Link, 
    Row, 
    Section, 
    Text 
} from '@react-email/components'

// Utilities
import { ContactTypes } from '@/core/types'


/**
 * 
 * Styling for template
 */
const main: React.CSSProperties = {
    backgroundColor: '#ffffff',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
    padding: '48px 0',
    lineHeight: 1
}

const container: React.CSSProperties = {
    margin: '0 auto',
    width: 360,
    borderRadius: 16,
    color: '#ffffff',
    backgroundColor: '#196eed'
}

const spaceX: React.CSSProperties = {
    width: 24,
}

const heading: React.CSSProperties = {
    fontSize: 20,
    lineHeight: 1,
    fontWeight: 700,
    color: '#ffffff',
    margin: '0 0 16px'
}

const link: React.CSSProperties = {
    fontSize: 14,
    lineHeight: 1,
    color: '#ffffff',
    textDecoration: 'none'
}

const title: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '1.35',
    color: '#ffffff',
    margin: '0 0 8px'
}

const paragraph: React.CSSProperties = {
    fontSize: 14,
    lineHeight: '1.25',
    color: '#ffffff',
    margin: 0
}


const InquiryTemplate: React.FC<ContactTypes> = (
    {
        firstName,
        lastName,
        email,
        phone,
        message
    }
)  => {
        

    return (
        <Html>
            <Section style={main}>
                <Container style={container}>
                    <Row>
                        <Column style={{height: 32}}></Column>
                    </Row>
                    <Row>
                        <Column style={spaceX}></Column>
                        <Column style={{width: 248}}>
                            <Text style={heading}>{firstName + ' ' + lastName}</Text>
                            <Row align='left'>
                                <Column style={{width: 24}}>
                                    <Img 
                                        src='https://listen-next-two.vercel.app/images/icons/phone.png'
                                        alt='Phone' 
                                        width='16' 
                                        height='16' 
                                    />
                                </Column>
                                <Column>
                                    <Link href={'tel:' + phone} style={link}>{phone}</Link>
                                </Column>
                            </Row>
                            <Row>
                                <Column style={{height: 8}}></Column>
                            </Row>
                            <Row align='left'>
                                <Column style={{width: 24}}>
                                    <Img 
                                        src='https://listen-next-two.vercel.app/images/icons/mail.png'
                                        alt='Email' 
                                        width='16' 
                                        height='16' 
                                    />
                                </Column>
                                <Column>
                                    <Link href={'mailto:' + email} style={link}>{email}</Link>
                                </Column>
                            </Row>
                            {message && (
                                <>
                                    <Row>
                                        <Column style={{height: 24}}></Column>
                                    </Row>
                                    <Row>
                                        <Column>
                                            <Text style={title}>Message:</Text>
                                            <Text style={paragraph}>{message}</Text>
                                        </Column>
                                    </Row>
                                </>
                            )}
                        </Column>
                        <Column style={{width: 16}}></Column>
                        <Column style={{width: 48, verticalAlign: 'top'}}>
                            <Link href={'mailto:' + email} style={{display: 'block', marginTop: '-8px'}}>
                                <Img 
                                    src='https://listen-next-two.vercel.app/images/icons/send.png'
                                    alt='Send' 
                                    width='48' 
                                    height='48' 
                                />
                            </Link>
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


InquiryTemplate.displayName = 'InquiryTemplate'
export default InquiryTemplate