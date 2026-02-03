import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
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
  CheckSquare,
  Square,
  AlertCircle,
  Coins,
  Plus,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  const [selectedAnalyses, setSelectedAnalyses] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
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

  const handleSelectAnalysis = (analysisId: number, checked: boolean) => {
    if (checked) {
      setSelectedAnalyses(prev => [...prev, analysisId]);
    } else {
      setSelectedAnalyses(prev => prev.filter(id => id !== analysisId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAnalyses(recentAnalyses.map(analysis => analysis.id));
    } else {
      setSelectedAnalyses([]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedAnalyses.length === 0) return;
    
    setIsDeleting(true);
    try {
      await Promise.all(
        selectedAnalyses.map(id => dashboardApi.deleteAnalysis(id))
      );
      
      toast({
        title: "Success",
        description: `Deleted ${selectedAnalyses.length} analyses`,
      });
      
      setSelectedAnalyses([]);
      await fetchDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete analyses",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      await dashboardApi.deleteAllAnalyses();
      
      toast({
        title: "Success",
        description: "All analyses deleted successfully",
      });
      
      setSelectedAnalyses([]);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20 container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
          </div>
        </div>
        <Footer />
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

          {/* Credit Balance Card */}
          <Card className="mb-8 border-gold/20 bg-gradient-to-br from-gold/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gold">
                <Coins className="h-5 w-5" />
                Credit Balance
              </CardTitle>
              <CardDescription>
                Your available credits for news analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 sm:gap-3">
                    <p className="text-4xl sm:text-5xl font-bold text-gold">{credits}</p>
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm text-muted-foreground">credits</span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">1 credit per analysis</span>
                    </div>
                  </div>
                  {credits <= 2 && (
                    <div className="mt-3 flex items-start gap-2 text-xs sm:text-sm text-orange-500">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span className="leading-tight">Low balance! Buy more credits to continue analyzing.</span>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => setShowBuyCredits(true)}
                  className="bg-gradient-to-r from-gold to-gold-light hover:from-gold/90 hover:to-gold-light/90 text-background font-semibold w-full sm:w-auto"
                  size="default"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Buy Credits
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
                <FileText className="w-4 h-4 text-muted-foreground" />
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
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
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
                <XCircle className="w-4 h-4 text-red-500" />
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
                <Clock className="w-4 h-4 text-muted-foreground" />
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
                <BarChart3 className="w-5 h-5" />
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
                          {getVerdictIcon(verdict)}
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
                  <TrendingUp className="w-5 h-5" />
                  Recent Analyses
                </CardTitle>
                {recentAnalyses.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteAllDialogOpen(true)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 w-full sm:w-auto text-xs sm:text-sm"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="truncate">Delete All</span>
                    </Button>
                    {selectedAnalyses.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteDialogOpen(true)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 w-full sm:w-auto text-xs sm:text-sm"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="truncate">Delete ({selectedAnalyses.length})</span>
                      </Button>
                    )}
                  </div>
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
                  {recentAnalyses.length > 0 && (
                    <div className="flex items-center justify-between mb-4 p-2 bg-muted/30 rounded">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedAnalyses.length === recentAnalyses.length}
                          onCheckedChange={handleSelectAll}
                        />
                        <span className="text-sm font-medium">
                          Select All ({selectedAnalyses.length}/{recentAnalyses.length})
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="space-y-4">
                    {recentAnalyses.map((analysis) => (
                      <div 
                        key={analysis.id}
                        className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={selectedAnalyses.includes(analysis.id)}
                            onCheckedChange={(checked) => handleSelectAnalysis(analysis.id, checked as boolean)}
                            className="mt-1"
                          />
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

      <Footer />

      {/* Delete Selected Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Delete Selected Analyses
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedAnalyses.length} selected analyses? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? 'Deleting...' : `Delete ${selectedAnalyses.length} analyses`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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