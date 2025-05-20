
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import LogPainLocation from "@/components/logheadache/LogPainLocation";

export default function LogPainLocationPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#172a46] to-[#0a192f] pb-24">
      <header className="fixed top-0 w-full bg-[#0a192f]/80 backdrop-blur-sm border-b border-white/5 z-50">
        <div className="flex items-center px-4 h-16">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-6 w-6 text-white/60" />
          </Button>
          <span className="ml-2 font-semibold text-white">Pain Location</span>
        </div>
      </header>

      <main className="pt-20 px-4 space-y-6">
        <LogPainLocation />
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-[#0a192f]/80 backdrop-blur-sm border-t border-white/5">
        <Button className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-medium"
                onClick={() => navigate('/log')}>
          Continue
        </Button>
      </footer>
    </div>
  );
}
