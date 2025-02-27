
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function PersonalInfoCard() {
  return (
    <Card className="bg-white/5 border-white/10">
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-semibold text-white">Personal Information</h3>
        
        <div className="space-y-3">
          <div>
            <Label className="text-white/60">Display Name</Label>
            <Input placeholder="Enter your name" className="mt-1 bg-white/5 border-white/10 text-white" />
          </div>

          <div>
            <Label className="text-white/60">Age</Label>
            <Input type="number" className="mt-1 bg-white/5 border-white/10 text-white" />
          </div>

          <div>
            <Label className="text-white/60">Gender</Label>
            <Select>
              <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
}
