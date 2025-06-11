"use client"

import React from 'react'

const TermsPage = () => {
    return (
        <div className="container" style={{ marginTop: '100px' }}>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h1 className="text-white mb-4">Terms & Conditions</h1>
                    
                    <div className="text-white mb-4">
                        <p><strong>Last updated:</strong> June 10, 2025</p>
                        <p>Sampsira, LLC ("Sampsira," "we," "us," or "our") operates the website Sampsira.com and its online music-sample marketplace (the "Platform"). These Terms & Conditions ("Terms") govern your access to and use of the Platform. By registering for or using any portion of the Platform, you ("User," "you," or "your") agree to be bound by these Terms. If you do not accept these Terms, do not access or use the Platform.</p>
                        <p>We reserve the right to amend these Terms at any time; any revisions will be effective upon posting. Your continued use of the Platform after such posting constitutes acceptance of the updated Terms.</p>

                        <h2 className="mt-5">1. Definitions</h2>
                        <ul>
                            <li><strong>Sample:</strong> Any audiovisual asset made available for license on the Platform, including sound recordings, loops, stems, MIDI files, and any underlying musical composition.</li>
                            <li><strong>Creator:</strong> A User who uploads and offers Samples for license.</li>
                            <li><strong>Licensee:</strong> A User who obtains a right to incorporate Samples into their own musical works.</li>
                            <li><strong>Credits:</strong> Units purchased or pre-purchased by Users to license Samples (see § 4).</li>
                            <li><strong>Subscription:</strong> A recurring purchase arrangement under which a User acquires a specified allotment of Credits each billing cycle (see § 2.5).</li>
                        </ul>

                        <h2 className="mt-5">2. Account Registration & Eligibility</h2>
                        <h3>2.1 Registration Requirements</h3>
                        <p>To become a Creator or Licensee, you must provide your full legal name, valid email, physical address, and payment information. You are solely responsible for maintaining the confidentiality of your password and for all activities under your account. Notify us immediately of unauthorized access.</p>

                        <h3>2.2 Legal Capacity</h3>
                        <p>You represent and warrant that you are at least eighteen (18) years of age and have the legal capacity to enter into binding contracts.</p>

                        <h3>2.3 Third-Party Payment Processors</h3>
                        <p>All monetary transactions are processed by third-party services (e.g., Stripe, PayPal). Any dispute arising from payment processing must be resolved with the applicable processor.</p>

                        <h3>2.4 Creator Onboarding</h3>
                        <p>Creators must:</p>
                        <ul>
                            <li>Integrate a verified payout account for distributions;</li>
                            <li>Provide any requested tax or identity documentation;</li>
                            <li>Submit Samples to quality review, which we may approve or reject in our sole discretion.</li>
                        </ul>

                        <h3>2.5 Subscriptions & Credits</h3>
                        <ul>
                            <li>Subscribers commit to a defined number of Credits per billing cycle in exchange for periodic fees.</li>
                            <li>Credits are non-refundable, non-transferable, and expire thirty (30) days after subscription cancellation.</li>
                            <li>We may modify subscription plans or Credit allocations upon fourteen (14) days' notice.</li>
                        </ul>

                        <h2 className="mt-5">3. Sample Licensing</h2>
                        <h3>3.1 License Grant by Creators</h3>
                        <p>By uploading a Sample, you grant Sampsira a worldwide, non-exclusive, royalty-free right to host, display, stream, reproduce, distribute, and promote the Sample in connection with the Platform and our marketing efforts.</p>

                        <h3>3.2 License Grant to Licensees</h3>
                        <p>Upon payment via Credits or one-time purchase, the Creator grants the Licensee a limited, non-exclusive, non-transferable license to incorporate the Sample into one or more new musical productions ("Licensed Works"). Licensees may exploit Licensed Works in any media (music, film, games, advertising, etc.) but may not:</p>
                        <ul>
                            <li>Redistribute or sublicense the raw Sample;</li>
                            <li>Use the Sample for creating derivative sample libraries or virtual instruments;</li>
                            <li>Transfer their license to third parties except as incorporated into Licensed Works where the Licensee is credited.</li>
                        </ul>

                        <h2 className="mt-5">4. Financial Terms</h2>
                        <p>All compensation terms payable to Creators—including, without limitation, per-Sample or revenue-share arrangements—are subject to ongoing development and will be communicated directly to participating Creators via email or account dashboard notifications. Sampsira reserves sole discretion to determine and amend Creator compensation models at any time.</p>
                        <p>Users are responsible for any taxes or fees applicable to payments made or received through the Platform.</p>

                        <h2 className="mt-5">5. User Obligations & Conduct</h2>
                        <h3>5.1 Compliance</h3>
                        <p>You agree not to upload or use content that infringes intellectual property rights or violates applicable law, including content that is defamatory, obscene, or malicious.</p>

                        <h3>5.2 No Reverse Engineering</h3>
                        <p>You shall not decompile, disassemble, scrape, or otherwise attempt to derive the Platform's source code or database contents.</p>

                        <h3>5.3 Enforcement & Termination</h3>
                        <p>We may suspend or terminate any account or activity that breaches these Terms, without notice, and pursue any appropriate legal remedies.</p>

                        <h2 className="mt-5">6. Copyright Infringement & Takedown</h2>
                        <p>We comply with the Digital Millennium Copyright Act (DMCA). If you believe any content infringes your rights, send a written notice containing the information specified under 17 U.S.C. § 512(c)(3) to <a href="mailto:support@sampsira.com">support@sampsira.com</a>. We will investigate and take appropriate action under U.S. law.</p>

                        <h2 className="mt-5">7. Disclaimers & Limitation of Liability</h2>
                        <p>TO THE FULLEST EXTENT PERMITTED BY LAW, THE PLATFORM AND ALL CONTENT ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTY OF ANY KIND. SAMPSIRA DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
                        <p>IN NO EVENT SHALL SAMPSIRA BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR USE OF THE PLATFORM, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>

                        <h2 className="mt-5">8. Governing Law & Venue</h2>
                        <p>These Terms and any disputes arising hereunder shall be governed by the laws of the State of New Jersey, U.S.A., excluding its conflict of law principles. You consent to exclusive jurisdiction and venue in the state and federal courts located in New Jersey.</p>

                        <h2 className="mt-5">9. Miscellaneous</h2>
                        <h3>9.1 Entire Agreement</h3>
                        <p>These Terms, together with our Privacy Policy, constitute the entire agreement regarding your use of the Platform.</p>

                        <h3>9.2 Severability</h3>
                        <p>If any provision is held invalid, illegal, or unenforceable, the remainder shall remain in full force and effect.</p>

                        <h3>9.3 Waiver</h3>
                        <p>No failure or delay by Sampsira to enforce any right shall operate as a waiver of that right.</p>

                        <h3>9.4 Assignment</h3>
                        <p>You may not assign or transfer any rights or obligations under these Terms without our prior written consent; Sampsira may assign freely.</p>

                        <h2 className="mt-5">Contact</h2>
                        <p>For questions or support, please email <a href="mailto:support@sampsira.com">support@sampsira.com</a>.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TermsPage