import React, { useState } from 'react';
import { 
  Search, 
  Loader2, 
  Newspaper, 
  Link2, 
  FileText,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AnalysisModal } from '@/components/AnalysisModal';
import { useToast } from '@/hooks/use-toast';
import { newsApi } from '@/services/api';

interface AnalysisResult {
  verdict: 'real' | 'fake' | 'uncertain' | 'misleading';
  confidence: number;
  summary: string;
  factors: string[];
  sources: { name: string; url: string; credibility: string }[];
  recommendations: string[];
}

const DetectPage: React.FC = () => {
  const [newsText, setNewsText] = useState('');
  const [newsUrl, setNewsUrl] = useState('');
  const [headline, setHeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async (type: 'text' | 'url') => {
    const content = type === 'text' ? newsText : newsUrl;
    
    if (!content.trim()) {
      toast({
        title: "Input Required",
        description: `Please enter the ${type === 'text' ? 'news content' : 'URL'} to analyze.`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setIsModalOpen(true);

    try {
      // Call the actual Flask backend API
      const response = await newsApi.analyzeNews({
        text: content,
        headline: headline || undefined
      });

      if (response.success && response.data) {
        const data = response.data;
        
        // Transform backend response to match frontend interface
        const analysisResult: AnalysisResult = {
          verdict: data.verdict.toLowerCase() as 'real' | 'fake' | 'uncertain' | 'misleading',
          confidence: data.confidence,
          summary: data.summary || data.detailed_analysis.substring(0, 200) + '...',
          factors: [
            ...data.red_flags.map(flag => `⚠️ ${flag}`),
            ...data.key_claims.slice(0, 3).map(claim => `📌 ${claim}`)
          ],
          sources: data.sources_checked.map(source => ({
            name: source.name,
            url: source.url,
            credibility: source.credibility
          })),
          recommendations: data.verification_suggestions
        };

        setResult(analysisResult);
        
        toast({
          title: "Analysis Complete",
          description: `Checked ${data.total_sources_checked} sources using ${data.ai_model}`,
        });
      } else {
        throw new Error(response.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : 'Could not connect to backend. Make sure the server is running.',
        variant: "destructive"
      });
      
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Detection</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
              News Verification
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Paste your news article, headline, or URL below and let our AI analyze its authenticity.
            </p>
          </div>

          {/* Analysis Card */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
              <Tabs defaultValue="text" className="w-full">
                <div className="border-b border-border bg-muted/30 px-6 pt-6">
                  <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
                    <TabsTrigger value="text" className="gap-2">
                      <FileText className="w-4 h-4" />
                      Paste Text
                    </TabsTrigger>
                    <TabsTrigger value="url" className="gap-2">
                      <Link2 className="w-4 h-4" />
                      Enter URL
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6 md:p-8">
                  <TabsContent value="text" className="mt-0 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Headline (Optional)</label>
                      <Input
                        placeholder="Enter the news headline..."
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">News Content</label>
                      <Textarea
                        placeholder="Paste the news article or social media post you want to verify..."
                        value={newsText}
                        onChange={(e) => setNewsText(e.target.value)}
                        className="min-h-[200px] resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        Tip: Include as much of the original content as possible for better accuracy.
                      </p>
                    </div>

                    <Button 
                      onClick={() => handleAnalyze('text')} 
                      disabled={isLoading || !newsText.trim()}
                      className="w-full h-12"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5" />
                          Analyze News
                        </>
                      )}
                    </Button>
                  </TabsContent>

                  <TabsContent value="url" className="mt-0 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">News Article URL</label>
                      <Input
                        type="url"
                        placeholder="https://example.com/news-article"
                        value={newsUrl}
                        onChange={(e) => setNewsUrl(e.target.value)}
                        className="h-12"
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter the full URL of the news article you want to verify.
                      </p>
                    </div>

                    <Button 
                      onClick={() => handleAnalyze('url')} 
                      disabled={isLoading || !newsUrl.trim()}
                      className="w-full h-12"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Fetching & Analyzing...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5" />
                          Analyze URL
                        </>
                      )}
                    </Button>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              <div className="p-5 bg-card rounded-xl border border-border">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Newspaper className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Multi-Source Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      We cross-reference with 7+ trusted news sources and fact-checking organizations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-card rounded-xl border border-border">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Important Note</h3>
                    <p className="text-sm text-muted-foreground">
                      AI analysis is a tool, not a replacement for critical thinking. Always verify important news.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <AnalysisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        result={result}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DetectPage;
