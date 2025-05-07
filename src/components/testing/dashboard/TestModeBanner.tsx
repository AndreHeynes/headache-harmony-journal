
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function TestModeBanner() {
  const navigate = useNavigate();
  
  return (
    <div className="bg-charcoal text-white p-4 min-h-screen flex flex-col items-center justify-center">
      <Card className="w-full max-w-md bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-center">Test Mode Disabled</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-300 mb-4">
            Please enable test mode in your profile settings to access the test dashboard.
          </p>
          <Button onClick={() => navigate("/profile")}>
            Go to Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
