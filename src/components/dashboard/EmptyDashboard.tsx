import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, TrendingUp, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmptyDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 p-8 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-white">Ready to log your first headache?</h2>
          <p className="text-white/70">
            Start tracking your headaches to discover patterns and find relief. The more you log, the better insights you'll get.
          </p>
          <Button 
            onClick={() => navigate('/log')}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-charcoal font-semibold"
          >
            Log New Headache
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gray-800/50 border-gray-700 p-6">
          <FileText className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold text-white mb-2">Track Episodes</h3>
          <p className="text-sm text-white/70">
            Log pain location, intensity, duration, and triggers for each episode.
          </p>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 p-6">
          <TrendingUp className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold text-white mb-2">Discover Patterns</h3>
          <p className="text-sm text-white/70">
            Identify trends and correlations in your headache data over time.
          </p>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 p-6">
          <Calendar className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold text-white mb-2">Get Insights</h3>
          <p className="text-sm text-white/70">
            Receive personalized insights based on your logged episodes.
          </p>
        </Card>
      </div>

      <Card className="bg-gray-800/50 border-gray-700 p-6">
        <h3 className="font-semibold text-white mb-3">Beta Testing Tips</h3>
        <ul className="space-y-2 text-sm text-white/70">
          <li>• Try logging at least 3-5 episodes to see meaningful patterns</li>
          <li>• Explore different sections to test all features</li>
          <li>• Use the feedback button if you encounter any issues</li>
          <li>• Your data helps us improve the app for everyone</li>
        </ul>
      </Card>
    </div>
  );
};
