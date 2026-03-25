import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { 
  BarChart3, 
  Clock, 
  FileText, 
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Trash2,
  AlertCircle,
  Coins,
  Plus,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { dashboardApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { BuyCreditsModal } from '@/components/BuyCreditsModal';

interface DashboardStats {
  total_analyses: number;
  verdict_distribution: {
    REAL: number;
    FAKE: number;
    MISLEADING: number;
    UNCERTAIN: number;
  };
  last_analysis: string | null;
}

interface RecentAnalysis {
  id: number;
  timestamp: string;
  headline: string;
  news_text: string;
  verdict: string;
  confidence: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [deleteIndividualDialogOpen, setDeleteIndividualDialogOpen] = useState(false);
  const [selectedAnalysisForDelete, setSelectedAnalysisForDelete] = useState<number | null>(null);
  const [showBuyCredits, setShowBuyCredits] = useState(false);
  const { toast } = useToast();
  const { credits, refreshCredits } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardApi.getStats();
      if (response.success) {
        setStats(response.statistics);
        setRecentAnalyses(response.recent_analyses);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict.toUpperCase()) {
      case 'REAL':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'FAKE':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'MISLEADING':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <HelpCircle className="w-5 h-5 text-amber-500" />;
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict.toUpperCase()) {
      case 'REAL':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
      case 'FAKE':
        return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'MISLEADING':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      default:
        return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      await dashboardApi.deleteAllAnalyses();
      
      toast({
        title: "Success",
        description: "All analyses deleted successfully",
      });
      
      await fetchDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete all analyses",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setDeleteAllDialogOpen(false);
    }
  };

  const handleDeleteIndividual = async () => {
    if (!selectedAnalysisForDelete) return;
    
    setIsDeleting(true);
    try {
      await dashboardApi.deleteAnalysis(selectedAnalysisForDelete);
      
      toast({
        title: "Success",
        description: "Analysis deleted successfully",
      });
      
      await fetchDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete analysis",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setDeleteIndividualDialogOpen(false);
      setSelectedAnalysisForDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20 container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Your news analysis overview</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_analyses || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  All time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Authentic News</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-500">
                  {stats?.verdict_distribution.REAL || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Verified as real
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">False News</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  {stats?.verdict_distribution.FAKE || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Flagged as fake
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Last Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {stats?.last_analysis 
                    ? formatDate(stats.last_analysis)
                    : 'No analyses yet'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Most recent check
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Verdict Distribution Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Verdict Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats && Object.entries(stats.verdict_distribution).map(([verdict, count]) => {
                  const total = stats.total_analyses;
                  const percentage = total > 0 ? (count / total) * 100 : 0;
                  
                  return (
                    <div key={verdict}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{verdict}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            verdict === 'REAL' ? 'bg-emerald-500' :
                            verdict === 'FAKE' ? 'bg-red-500' :
                            verdict === 'MISLEADING' ? 'bg-orange-500' :
                            'bg-amber-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Analyses */}
          <Card>
            <CardHeader>
          <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  Recent Analyses
                </CardTitle>
                {recentAnalyses.length > 0 && (
                  <button
                    onClick={() => setDeleteAllDialogOpen(true)}
                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete all analyses"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {recentAnalyses.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No analyses yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Start by analyzing your first news article
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {recentAnalyses.map((analysis) => (
                      <div 
                        key={analysis.id}
                        className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1">
                                <h4 className="font-medium line-clamp-1">
                                  {analysis.headline || 'Untitled Analysis'}
                                </h4>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                  {analysis.news_text}
                                </p>
                              </div>
                              <div className={`px-3 py-1 rounded-full border text-xs font-medium whitespace-nowrap ${getVerdictColor(analysis.verdict)}`}>
                                {analysis.verdict}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(analysis.timestamp)}
                              </span>
                              <span>Confidence: {analysis.confidence}%</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedAnalysisForDelete(analysis.id);
                              setDeleteIndividualDialogOpen(true);
                            }}
                            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors flex-shrink-0"
                            title="Delete this analysis"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Delete All Dialog */}
      <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Delete All Analyses
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all {recentAnalyses.length} analyses? This action cannot be undone and will permanently remove all your analysis history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAll}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? 'Deleting...' : 'Delete All Analyses'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Individual Dialog */}
      <AlertDialog open={deleteIndividualDialogOpen} onOpenChange={setDeleteIndividualDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Delete Analysis
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this analysis? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteIndividual}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? 'Deleting...' : 'Delete Analysis'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Buy Credits Modal */}
      <BuyCreditsModal
        isOpen={showBuyCredits}
        onClose={() => setShowBuyCredits(false)}
        onSuccess={refreshCredits}
        currentCredits={credits}
      />
    </div>
  );
};

export default Dashboard;