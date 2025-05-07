
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SaveTreatmentButtonProps {
  onClick?: () => void;
}

export function SaveTreatmentButton({ onClick }: SaveTreatmentButtonProps) {
  const handleSave = () => {
    // Here you would save the treatment log data
    toast.success("Treatment log saved successfully");
    if (onClick) onClick();
  };

  return (
    <Button 
      className="w-full mt-6 bg-primary hover:bg-primary-dark text-charcoal font-medium"
      onClick={handleSave}
    >
      Save Treatment Log
    </Button>
  );
}
