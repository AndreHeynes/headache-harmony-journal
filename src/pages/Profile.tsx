
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import BottomNav from "@/components/layout/BottomNav";
import { ChevronLeft } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-dark to-charcoal pb-20">
      {/* Header */}
      <header className="fixed top-0 w-full bg-charcoal/80 backdrop-blur-sm border-b border-white/5 z-50">
        <div className="flex items-center px-4 h-16">
          <ChevronLeft className="h-6 w-6 text-white/60" />
          <span className="ml-2 font-semibold text-white">Settings</span>
        </div>
      </header>

      <main className="pt-20 px-4 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <img src="https://github.com/shadcn.png" alt="User" />
          </Avatar>
          <div>
            <h2 className="text-xl font-bold text-white">John Doe</h2>
            <p className="text-white/60">johndoe@example.com</p>
          </div>
        </div>

        {/* Personal Information */}
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

        {/* App Settings */}
        <Card className="bg-white/5 border-white/10">
          <div className="p-4 space-y-4">
            <h3 className="text-lg font-semibold text-white">App Settings</h3>
            
            <div className="space-y-3">
              <div>
                <Label className="text-white/60">Language</Label>
                <Select>
                  <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white/60">Time Zone</Label>
                <Select>
                  <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC-05:00 Eastern Time</SelectItem>
                    <SelectItem value="pst">UTC-08:00 Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white/60">Date Format</Label>
                <Select>
                  <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="bg-white/5 border-white/10">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              <Switch />
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-white/60">Daily Check-in Reminders</Label>
                <div className="mt-2">
                  <Slider
                    defaultValue={[4]}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <p className="mt-1 text-sm text-white/60">4 times per day</p>
                </div>
              </div>

              <div>
                <Label className="text-white/60">Episode Duration Tracking</Label>
                <div className="mt-2">
                  <Slider
                    defaultValue={[60]}
                    max={120}
                    step={5}
                    className="w-full"
                  />
                  <p className="mt-1 text-sm text-white/60">60 minutes</p>
                </div>
              </div>

              <div>
                <Label className="text-white/60">Quiet Hours</Label>
                <div className="flex gap-4 mt-2">
                  <Select>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Start time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="22">22:00</SelectItem>
                      <SelectItem value="23">23:00</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="End time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">06:00</SelectItem>
                      <SelectItem value="7">07:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white/60">Notification Style</Label>
                <div className="space-y-2">
                  {[
                    "Sound & Vibration",
                    "Sound Only",
                    "Vibration Only",
                    "Silent"
                  ].map((option) => (
                    <div key={option} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white">{option}</span>
                      <Switch />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
