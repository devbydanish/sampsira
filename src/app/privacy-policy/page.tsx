"use client"

import React from 'react'

const PrivacyPolicyPage = () => {
    return (
        <div className="container" style={{ marginTop: '100px' }}>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h1 className="text-white mb-4">Privacy Policy</h1>
                    
                    <div className="text-white mb-4">
                        <p><strong>Effective Date:</strong> June 10, 2025</p>
                        <p>This policy explains how Sampsira, LLC ("Sampsira," "we," "us," or "our") collects, uses, discloses, and safeguards the personal information of visitors and registered users ("you" or "User") of Sampsira.com and any site, application, or service that links to this Policy (collectively, the "Services").</p>

                        <h2 className="mt-5">1. Scope & Controller</h2>
                        <p>Sampsira, LLC, a New Jersey-organized limited-liability company, is the data controller for personal information processed under this Policy. If you do not agree with our practices, refrain from accessing or using the Services.</p>

                        <h2 className="mt-5">2. Information We Collect</h2>
                        <div className="table-responsive">
                            <table className="table table-dark">
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th>Examples</th>
                                        <th>Source</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Account & Identity Data</strong></td>
                                        <td>name, stage name, email, postal address, username, password, profile photo, PRO affiliation</td>
                                        <td>directly from you</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Commercial & Payment Data</strong></td>
                                        <td>purchase history, subscription tier, payment-method identifiers (handled by Stripe/PayPal); payout-account details for Creators</td>
                                        <td>directly from you; payment processor</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Device & Usage Data</strong></td>
                                        <td>IP address, browser type, operating system, referring URLs, pages viewed, click-stream, timestamps, error logs</td>
                                        <td>automatically via cookies, pixels, and similar tech</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Location Data</strong></td>
                                        <td>coarse geolocation inferred from IP; precise GPS only if you enable it</td>
                                        <td>automatically</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Marketing Preferences</strong></td>
                                        <td>opt-in/opt-out selections for email or SMS marketing</td>
                                        <td>directly from you</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Sample-Clearance Data</strong></td>
                                        <td>legal name, publisher/PRO details, songwriting split sheets shared between Creators and Licensees</td>
                                        <td>from you or other Users during clearance workflow</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p>We do <strong>not</strong> intentionally collect "sensitive" data (e.g., health, biometric, or protected-class information) and ask that you do not submit it.</p>

                        <h2 className="mt-5">3. How & Why We Process Your Information</h2>
                        <div className="table-responsive">
                            <table className="table table-dark">
                                <thead>
                                    <tr>
                                        <th>Purpose</th>
                                        <th>Legal Basis (EEA/UK)</th>
                                        <th>Typical Data Used</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Create, authenticate, and maintain your account</td>
                                        <td>Contract performance</td>
                                        <td>Account & Identity Data</td>
                                    </tr>
                                    <tr>
                                        <td>Process transactions, subscriptions, and Creator payouts</td>
                                        <td>Contract performance; Legitimate interest (fraud prevention)</td>
                                        <td>Commercial & Payment Data</td>
                                    </tr>
                                    <tr>
                                        <td>Provide and improve the Services (analytics, debugging, research)</td>
                                        <td>Legitimate interest</td>
                                        <td>Device & Usage Data</td>
                                    </tr>
                                    <tr>
                                        <td>Facilitate sample licensing, clearance, and royalty administration</td>
                                        <td>Contract performance</td>
                                        <td>Sample-Clearance Data</td>
                                    </tr>
                                    <tr>
                                        <td>Communicate with you (service, security, and marketing messages)</td>
                                        <td>Contract performance; Legitimate interest; Consent (for marketing)</td>
                                        <td>Account & Identity Data; Marketing Preferences</td>
                                    </tr>
                                    <tr>
                                        <td>Personalize content or advertising; measure campaign effectiveness</td>
                                        <td>Consent (where required); Legitimate interest</td>
                                        <td>Device & Usage Data</td>
                                    </tr>
                                    <tr>
                                        <td>Detect, investigate, and prevent fraud or security incidents</td>
                                        <td>Legitimate interest; Legal obligation</td>
                                        <td>Any relevant category</td>
                                    </tr>
                                    <tr>
                                        <td>Comply with legal obligations (tax, accounting, AML/KYC)</td>
                                        <td>Legal obligation</td>
                                        <td>Account & Identity Data; Commercial & Payment Data</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p><em>Under Canadian law we rely on express or implied consent; under U.S. state laws we rely on "business purposes" and "legal compliance" grounds as defined by applicable privacy statutes.</em></p>

                        <h2 className="mt-5">4. Cookies & Similar Technologies</h2>
                        <p>We use first- and third-party cookies, pixels, and local storage to:</p>
                        <ul>
                            <li>keep you signed in</li>
                            <li>remember preferences</li>
                            <li>perform analytics (e.g., Google Analytics)</li>
                            <li>serve interest-based ads</li>
                        </ul>
                        <p>You can manage cookies in your browser settings. For detailed opt-out instructions, see our <strong>Cookie Notice</strong> (link forthcoming).</p>

                        <h2 className="mt-5">5. Sharing & Disclosure</h2>
                        <p>We do not sell personal information. We may disclose data:</p>
                        <ol>
                            <li><strong>Service Providers & Sub-processors</strong> – cloud hosting, analytics, payment processors, email platforms, anti-fraud tools (bound by contract).</li>
                            <li><strong>Business Partners</strong> – to complete a collaboration or clearance between a Creator and Licensee (e.g., sharing PRO info for sample clearance).</li>
                            <li><strong>Corporate Transactions</strong> – in connection with a merger, acquisition, or sale of assets.</li>
                            <li><strong>Legal & Compliance</strong> – to courts, regulators, or law-enforcement where required or to enforce our rights.</li>
                            <li><strong>With Your Consent</strong> – for any additional purpose you explicitly approve.</li>
                        </ol>

                        <h2 className="mt-5">6. International Transfers</h2>
                        <p>We host data on servers in the United States. Where EU/UK/Swiss data is transferred abroad, we rely on <em>Standard Contractual Clauses</em> or other lawful transfer mechanisms.</p>

                        <h2 className="mt-5">7. Data Retention</h2>
                        <p>We retain personal information:</p>
                        <ul>
                            <li>while your account is active;</li>
                            <li>as long as necessary to fulfill the purposes outlined above;</li>
                            <li>for longer if required by tax, accounting, litigation-hold, or statutory obligations.</li>
                        </ul>
                        <p>Upon closure we will either delete, de-identify, or securely archive your data.</p>

                        <h2 className="mt-5">8. Security</h2>
                        <p>Sampsira employs industry-standard administrative, technical, and physical safeguards—encryption in transit, role-based access controls, periodic penetration testing—to protect information. No system is 100% secure; you use the Services at your own risk.</p>

                        <h2 className="mt-5">9. Children</h2>
                        <p>The Services are intended for users <strong>18 years or older</strong>. We do not knowingly collect data from minors. If we discover such collection, we will delete the data and suspend the account.</p>

                        <h2 className="mt-5">10. Your Rights</h2>
                        <p>Depending on your jurisdiction, you may have rights to:</p>
                        <ul>
                            <li>access or portability</li>
                            <li>correct or update</li>
                            <li>delete / erasure</li>
                            <li>restrict or object to processing</li>
                            <li>withdraw consent (marketing)</li>
                            <li>opt out of targeted advertising or profiling</li>
                            <li>lodge a complaint with a supervisory authority</li>
                        </ul>
                        <p>Submit requests via <a href="mailto:support@sampsira.com">support@sampsira.com</a> or through your account dashboard. We will verify your identity before acting and respond within the timeframe required by applicable law. Authorized agents may submit requests with signed permission.</p>

                        <h2 className="mt-5">11. Do-Not-Track & Global Privacy Control</h2>
                        <p>Because no uniform DNT or GPC standard has been adopted, we currently do not respond to such signals.</p>

                        <h2 className="mt-5">12. State-Specific & Regional Disclosures</h2>
                        <ul>
                            <li><strong>United States</strong> – Residents of California, Virginia, Colorado, Utah, Texas, Florida, Oregon, and other privacy-law states may exercise the rights in Section 10.</li>
                            <li><strong>EU/UK/EEA</strong> – Sampsira's EU representative is [TBD]. You may lodge complaints with your local Data Protection Authority.</li>
                            <li><strong>Canada</strong> – Our processing is governed by PIPEDA; you may contact the Office of the Privacy Commissioner of Canada.</li>
                            <li><strong>Australia / New Zealand / South Africa</strong> – Additional local rights may apply; contact us to exercise them.</li>
                        </ul>

                        <h2 className="mt-5">13. Changes to This Policy</h2>
                        <p>We may revise this Policy periodically. Material changes will be highlighted on the Services or emailed to registered Users. The "Effective Date" will indicate the latest revision.</p>

                        <h2 className="mt-5">14. Contact Us</h2>
                        <p>
                            Sampsira, LLC<br />
                            <a href="mailto:support@sampsira.com">support@sampsira.com</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicyPage