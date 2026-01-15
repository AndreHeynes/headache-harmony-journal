import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, TrendingUp, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmptyDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/30 to-primary/10 border-primary/40 p-8 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Ready to log your first headache?</h2>
          <p className="text-muted-foreground">
            Start tracking your headaches to discover patterns and find relief. The more you log, the better insights you'll get.
          </p>
          <Button 
            onClick={() => navigate('/log')}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            Log New Headache
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border p-6">
          <FileText className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold text-foreground mb-2">Track Episodes</h3>
          <p className="text-sm text-muted-foreground">
            Log pain location, intensity, duration, and triggers for each episode.
          </p>
        </Card>

        <Card className="bg-card border-border p-6">
          <TrendingUp className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold text-foreground mb-2">Discover Patterns</h3>
          <p className="text-sm text-muted-foreground">
            Identify trends and correlations in your headache data over time.
          </p>
        </Card>

        <Card className="bg-card border-border p-6">
          <Calendar className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold text-foreground mb-2">Get Insights</h3>
          <p className="text-sm text-muted-foreground">
            Receive personalized insights based on your logged episodes.
          </p>
        </Card>
      </div>

      <Card className="bg-card border-border p-6">
        <h3 className="font-semibold text-foreground mb-3">Beta Testing Tips</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Try logging at least 3-5 episodes to see meaningful patterns</li>
          <li>• Explore different sections to test all features</li>
          <li>• Use the feedback button if you encounter any issues</li>
          <li>• Your data helps us improve the app for everyone</li>
        </ul>
      </Card>
    </div>
  );
};
