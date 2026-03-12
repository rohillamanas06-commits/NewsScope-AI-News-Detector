import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Shield, Lock } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: March 2026
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none">
            <div className="bg-card border border-border rounded-2xl p-8 space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  At NewsScope, we take your privacy seriously. This Privacy Policy explains how we collect, 
                  use, disclose, and safeguard your information when you use our news verification service. 
                  Please read this privacy policy carefully. By using NewsScope, you consent to the practices 
                  described in this policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We collect the following types of information:
                </p>
                <div className="space-y-4 ml-4">
                  <div>
                    <h3 className="font-medium mb-1">Personal Information</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Name and email address (when you create an account)</li>
                      <li>Account credentials</li>
                      <li>Payment information (processed securely through our payment provider)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Usage Information</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>News articles you submit for analysis</li>
                      <li>Analysis results and history</li>
                      <li>Credit usage and balance</li>
                      <li>IP address and browser information</li>
                      <li>Device and connection information</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We use your information for the following purposes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>To provide and maintain our news verification service</li>
                  <li>To process your requests and analyze news content</li>
                  <li>To manage your account and credits</li>
                  <li>To communicate with you about service updates and changes</li>
                  <li>To improve our AI algorithms and service quality</li>
                  <li>To detect and prevent fraud and abuse</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  News content submitted for analysis is processed in real-time and not permanently stored. 
                  We retain analysis results for 30 days to allow you to access your history. Personal 
                  information is retained as long as your account is active. You can request deletion of 
                  your account and associated data at any time.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Information Sharing</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We do not sell, trade, or rent your personal information to third parties. We may share 
                  information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>With service providers who assist in operating our platform</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a business transfer or merger</li>
                  <li>With your explicit consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Security Measures</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your 
                  personal information. This includes encryption, secure servers, and regular security audits. 
                  However, no method of transmission over the internet is 100% secure, and we cannot guarantee 
                  absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Depending on your location, you may have the following rights regarding your personal data:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your data</li>
                  <li>Export your data in a portable format</li>
                  <li>Withdraw consent at any time</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  To exercise these rights, please contact us at rohillamanas06@gmail.com.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Cookies and Tracking</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
                  and remember your preferences. You can control cookie settings through your browser. 
                  Disabling cookies may affect some features of our service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  NewsScope is not intended for users under 13 years of age. We do not knowingly collect 
                  personal information from children under 13. If we become aware that we have collected 
                  information from a child under 13, we will delete it immediately.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes 
                  by posting the new policy on this page and updating the "Last updated" date. Continued 
                  use of the service after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">11. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <p className="text-muted-foreground mt-2">
                  Email: rohillamanas06@gmail.com
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Privacy;
