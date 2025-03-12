
import { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTestContext } from "@/contexts/TestContext";
import { TestGuide } from "./TestGuide";

export function TestGuideModal() {
  const { showTestGuide, setShowTestGuide, logTestEvent } = useTestContext();
  
  useEffect(() => {
    if (showTestGuide) {
      logTestEvent({
        type: "action",
        details: "Test guide shown",
        component: "TestGuideModal"
      });
    }
  }, [showTestGuide, logTestEvent]);

  const handleClose = () => {
    setShowTestGuide(false);
  };

  return (
    <Dialog open={showTestGuide} onOpenChange={setShowTestGuide}>
      <DialogContent className="sm:max-w-md p-0 bg-transparent border-0 shadow-none">
        <TestGuide onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
