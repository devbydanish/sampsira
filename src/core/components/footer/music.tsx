/**
 * @name MusicFooter
 * @file music.tsx
 * @description music pages footer component
 */
"use client"


// Modules
import React from 'react'
import Link from 'next/link'

// Components
import DownloadApp from './download-app'

// Utilities
import { BRAND, SOCIAL, NAVBAR_LINK, FOOTER_LINK } from '@/core/constants/constant'


const MusicFooter: React.FC = () => {

    return (
        <footer id="footer" className="footer py-5">
        <div className="container">
            <div className="row">
                {/* Left Column: Logo, Email, and Social Media */}
                <div className="col-md-4 text-center text-md-start mb-4 mb-md-0">
                    <Link href="/" className="d-block">
                    <img src={BRAND.logo} alt="Sampsira" className="footer-logo" />
                    </Link>
                    <ul className="social d-flex justify-content-center justify-content-md-start">
                    {SOCIAL.map((item, index) => (
                        <li key={index} className="me-3">
                        <Link href={item.href} target="_blank" aria-label={item.name}>
                            <item.icon size={20} />
                        </Link>
                        </li>
                    ))}
                    </ul>
                    <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mt-4">
                        <span className="footer-sampsira">© 2025 All Rights Reserved</span>
                        <span className="text-muted">|</span>
                        <Link href="https://la4tainc.com" className="footer-la4tainc">
                            Powered by LA 4TA, INC.
                        </Link>
                    </div>
                </div>

                {/* Middle Column: Navigation Links */}
                <div className="col-md-4 text-center pt-5">
                    <h5 className="footer-title">Links</h5>
                    <ul className="list-unstyled">
                    {NAVBAR_LINK.map((link, index) => (
                        <li key={index}>
                        <Link href={link.href} className="footer-link">
                            {link.name}
                        </Link>
                        </li>
                    ))}
                    </ul>
                </div>

                {/* Right Column: Other Links */}
                <div className="col-md-4 text-center text-md-end pt-5">
                    <h5 className="footer-title">Legal</h5>
                    <ul className="list-unstyled">
                    {FOOTER_LINK.map((link, index) => (
                        <li key={index}>
                        <Link href={link.href} className="footer-link">
                            {link.name}
                        </Link>
                        </li>
                    ))}
                    </ul>
                </div>
                </div>
            </div>
        </footer>

    )
}


MusicFooter.displayName = 'MusicFooter'
export default MusicFooter