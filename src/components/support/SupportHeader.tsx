
import { ChevronLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SupportHeaderProps {
  onBack: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SupportHeader({ onBack, searchQuery, setSearchQuery }: SupportHeaderProps) {
  return (
    <>
      <header className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="text-gray-400 hover:text-white hover:bg-gray-800 mr-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-white">Support Center</h1>
          </div>
        </div>
      </header>

      <section className="bg-gray-800/50 border-b border-gray-700 px-4 py-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for help..."
            className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
        </div>
      </section>
    </>
  );
}
