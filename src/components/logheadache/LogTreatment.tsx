
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { MedicationsSection } from "./sections/MedicationsSection";
import { OtherTreatmentsSection } from "./sections/OtherTreatmentsSection";
import { TreatmentTimingSection } from "./sections/TreatmentTimingSection";
import { EffectivenessSection } from "./sections/EffectivenessSection";
import { SideEffectsSection } from "./sections/SideEffectsSection";
import { NotesSection } from "./sections/NotesSection";

export default function LogTreatment() {
  const [activeTab, setActiveTab] = useState<string>("medications");

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <div className="p-4 space-y-6">
          <h2 className="text-lg font-medium text-white">Treatment Log</h2>
          
          <Tabs defaultValue="medications" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full bg-white/5">
              <TabsTrigger value="medications" className="data-[state=active]:bg-primary">Medications</TabsTrigger>
              <TabsTrigger value="other" className="data-[state=active]:bg-primary">Other Treatments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="medications" className="pt-4">
              <MedicationsSection />
              
              <Separator className="my-6 bg-white/10" />
              
              <TreatmentTimingSection />
              
              <Separator className="my-6 bg-white/10" />
              
              <EffectivenessSection />
              
              <Separator className="my-6 bg-white/10" />
              
              <SideEffectsSection />
            </TabsContent>
            
            <TabsContent value="other" className="pt-4">
              <OtherTreatmentsSection />
              
              <Separator className="my-6 bg-white/10" />
              
              <TreatmentTimingSection />
              
              <Separator className="my-6 bg-white/10" />
              
              <EffectivenessSection />
            </TabsContent>
          </Tabs>
          
          <Separator className="my-6 bg-white/10" />
          
          <NotesSection />
          
          <Button 
            className="w-full mt-6 bg-gradient-to-r from-primary to-primary-dark text-white font-medium"
          >
            Save Treatment Log
          </Button>
        </div>
      </Card>
    </div>
  );
}
