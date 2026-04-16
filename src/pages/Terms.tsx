import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <button
        onClick={() => navigate('/')}
        className="hidden md:block fixed top-4 left-4 z-50 p-2 hover:bg-muted rounded-lg transition-colors"
        aria-label="Back to home"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <main className="pt-8 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">
              Last updated: March 2026
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none">
            <div className="bg-card border border-border rounded-2xl p-8 space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using NewsScope, you agree to be bound by these Terms of Service.
                  If you do not agree to these terms, please do not use our service. We reserve the right
                  to modify these terms at any time, and your continued use constitutes acceptance of the changes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  NewsScope provides AI-powered news verification services. Our platform uses machine
                  learning algorithms to analyze news content and provide credibility assessments.
                  The service is provided "as is" and we make no guarantees about the accuracy or
                  completeness of the analysis.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To access certain features, you must create an account. You are responsible for
                  maintaining the confidentiality of your account credentials and for all activities
                  that occur under your account. You agree to notify us immediately of any unauthorized use.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  You agree not to use NewsScope to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Submit malicious content or malware</li>
                  <li>Attempt to circumvent our security measures</li>
                  <li>Engage in automated scraping or data mining</li>
                  <li>Interfere with other users' access to the service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Credits and Payments</h2>
                <p className="text-muted-foreground leading-relaxed">
                  NewsScope operates on a credit-based system. Free users receive limited credits daily.
                  Premium users can purchase additional credits. All purchases are final and non-refundable
                  except where required by law or covered by our money-back guarantee policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content, features, and functionality of NewsScope are owned by us and protected
                  by international copyright, trademark, and other intellectual property laws. You may
                  not reproduce, distribute, or create derivative works without our express permission.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  NewsScope and its creators shall not be liable for any indirect, incidental, special,
                  consequential, or punitive damages resulting from your use or inability to use the service.
                  Our analysis results are provided for informational purposes only and should not be
                  considered legal or professional advice.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Disclaimer of Warranties</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not warrant that the service will be uninterrupted, timely, secure, or error-free.
                  While we strive for accuracy, we make no warranties about the reliability of our AI
                  analysis. Users should exercise their own judgment when interpreting results.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to terminate or suspend your account and access to the service
                  immediately, without prior notice or liability, for any reason whatsoever, including
                  breach of these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of India.
                  Any disputes arising under these Terms shall be subject to the exclusive jurisdiction
                  of the courts in India.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">11. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For any questions about these Terms, please contact us at rohillamanas06@gmail.com.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Terms;