
import { useState } from "react";
import { Search, ThumbsUp, ThumbsDown, Mail, Users, HelpCircle, BookOpen, Headphones, Flag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SupportServices = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#E6FAF8]">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Support Center</h1>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5 text-gray-800 hover:text-black" />
            </Button>
          </div>
        </div>
      </header>

      <section className="bg-white px-4 py-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for help..."
            className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 h-5 w-5" />
        </div>
      </section>

      <section className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mb-3">
              <HelpCircle className="h-6 w-6 text-blue-700" />
            </div>
            <h3 className="font-semibold text-gray-900">FAQs</h3>
            <p className="text-sm text-gray-700 mt-1">Common questions</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 mb-3">
              <BookOpen className="h-6 w-6 text-green-700" />
            </div>
            <h3 className="font-semibold text-gray-900">User Guide</h3>
            <p className="text-sm text-gray-700 mt-1">How-to guides</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 mb-3">
              <Headphones className="h-6 w-6 text-purple-700" />
            </div>
            <h3 className="font-semibold text-gray-900">Contact</h3>
            <p className="text-sm text-gray-700 mt-1">Get help</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 mb-3">
              <Flag className="h-6 w-6 text-red-700" />
            </div>
            <h3 className="font-semibold text-gray-900">Report</h3>
            <p className="text-sm text-gray-700 mt-1">Report an issue</p>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {["Getting Started", "Account Management", "Feature Usage"].map((title, index) => (
            <div key={index} className="border rounded-lg">
              <button className="flex items-center justify-between w-full p-4">
                <span className="font-medium text-gray-900">{title}</span>
                <i className="fa-solid fa-chevron-down text-gray-700"></i>
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Support</h2>
        <form className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">Name</Label>
            <Input id="name" type="text" className="w-full border-gray-300" />
          </div>
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">Email</Label>
            <Input id="email" type="email" className="w-full border-gray-300" />
          </div>
          <div>
            <Label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-2">Subject</Label>
            <Select>
              <SelectTrigger id="subject" className="border-gray-300">
                <SelectValue placeholder="Select subject" className="text-gray-700" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical Support</SelectItem>
                <SelectItem value="account">Account Issues</SelectItem>
                <SelectItem value="billing">Billing Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">Description</Label>
            <Textarea id="description" rows={4} className="w-full border-gray-300" />
          </div>
          <Button type="submit" className="w-full bg-[#0D9488] hover:bg-[#0D9488]/90 text-white font-medium text-base">
            Submit
          </Button>
        </form>
      </section>

      <section className="px-4 py-6 bg-[#E6FAF8]">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Other Ways to Connect</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0D9488]/20 mr-3">
                <Mail className="h-5 w-5 text-[#0D9488]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Email Support</h3>
                <p className="text-sm text-gray-700">support@example.com</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0D9488]/20 mr-3">
                <Users className="h-5 w-5 text-[#0D9488]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Community Forum</h3>
                <p className="text-sm text-gray-700">Join the discussion</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-200 px-4 py-6">
        <div className="text-center">
          <div className="mb-4">
            <p className="font-medium text-gray-900">Was this helpful?</p>
            <div className="flex justify-center space-x-4 mt-2">
              <Button variant="outline" size="sm" className="px-6 border-gray-300 text-gray-800">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Yes
              </Button>
              <Button variant="outline" size="sm" className="px-6 border-gray-300 text-gray-800">
                <ThumbsDown className="h-4 w-4 mr-2" />
                No
              </Button>
            </div>
          </div>
          <div className="flex justify-center space-x-4 text-gray-800">
            <span className="hover:text-black cursor-pointer"><i className="fa-brands fa-twitter text-xl"></i></span>
            <span className="hover:text-black cursor-pointer"><i className="fa-brands fa-facebook text-xl"></i></span>
            <span className="hover:text-black cursor-pointer"><i className="fa-brands fa-linkedin text-xl"></i></span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SupportServices;
