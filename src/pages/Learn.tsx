import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, AlertTriangle, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const Learn: React.FC = () => {
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
            <h1 className="text-4xl font-bold mb-4">How News Detection Works</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Learn how NewsScope uses AI to identify authentic news and detect misinformation.
            </p>
          </div>

          {/* Introduction */}
          <div className="bg-muted/30 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-4">Understanding Fake News</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Fake news is intentionally misleading information presented as legitimate news.
              It can spread rapidly through social media and messaging platforms, influencing
              public opinion and causing real-world harm.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              NewsScope helps you identify fake news by analyzing multiple factors using
              advanced artificial intelligence and machine learning algorithms.
            </p>
          </div>



          {/* Red Flags */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-semibold text-red-900">Common Red Flags</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-red-600 mt-0.5" />
                <p className="text-sm text-red-800">Sensational or emotional headlines designed to provoke</p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-red-600 mt-0.5" />
                <p className="text-sm text-red-800">No author byline or credible sources cited</p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-red-600 mt-0.5" />
                <p className="text-sm text-red-800">Poor grammar, spelling errors, or awkward phrasing</p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-red-600 mt-0.5" />
                <p className="text-sm text-red-800">Requests for personal information or urgent action</p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-red-600 mt-0.5" />
                <p className="text-sm text-red-800">Mismatched dates or outdated information presented as new</p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-red-600 mt-0.5" />
                <p className="text-sm text-red-800">Unusual URL structures or domain names</p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
              <h2 className="text-2xl font-semibold text-emerald-900">How to Spot Real News</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-emerald-600 mt-0.5" />
                <p className="text-sm text-emerald-800">Verify the source - check if it's a reputable news organization</p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-emerald-600 mt-0.5" />
                <p className="text-sm text-emerald-800">Check the date - ensure the story is current</p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-emerald-600 mt-0.5" />
                <p className="text-sm text-emerald-800">Look for multiple sources reporting the same story</p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-emerald-600 mt-0.5" />
                <p className="text-sm text-emerald-800">Read beyond headlines - understand the full context</p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-emerald-600 mt-0.5" />
                <p className="text-sm text-emerald-800">Check author credentials and expertise</p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-emerald-600 mt-0.5" />
                <p className="text-sm text-emerald-800">Use NewsScope to verify suspicious content</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Learn;