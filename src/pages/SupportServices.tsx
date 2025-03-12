
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ThumbsUp, ThumbsDown, Mail, Users, HelpCircle, BookOpen, Headphones, Flag, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import BottomNav from "@/components/layout/BottomNav";
import { toast } from "sonner";

const faqData = [
  {
    category: "Getting Started",
    items: [
      {
        question: "How do I create an account?",
        answer: "To create an account, tap on the 'Let's Start' button on the welcome screen and follow the sign-up process. You'll need to provide your email and create a password."
      },
      {
        question: "How do I log a headache?",
        answer: "Tap on the '+' button located at the bottom of the dashboard or on the 'Log New Headache' button on the dashboard. Follow the steps to record your headache details."
      }
    ]
  },
  {
    category: "Account Management",
    items: [
      {
        question: "How do I reset my password?",
        answer: "On the sign-in screen, tap 'Forgot password?' and follow the instructions sent to your email address."
      },
      {
        question: "Can I change my email address?",
        answer: "Yes. Go to Profile > Personal Information, and update your email address."
      }
    ]
  },
  {
    category: "Feature Usage",
    items: [
      {
        question: "What is the Analysis Dashboard?",
        answer: "The Analysis Dashboard provides insights into your headache patterns, including frequency, triggers, and duration."
      },
      {
        question: "What premium features are available?",
        answer: "Premium features include detailed insights, pattern analysis, extended history, and custom variable tracking."
      }
    ]
  }
];

const SupportServices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    description: ''
  });
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, subject: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Support request submitted", {
      description: "We'll get back to you as soon as possible"
    });
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      description: ''
    });
  };

  const filteredFaqs = faqData.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="min-h-screen bg-charcoal pb-20">
      <header className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleGoBack}
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

      <section className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gray-800/50 border-gray-700 p-4 cursor-pointer hover:bg-gray-800 transition-colors">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 mb-3">
              <HelpCircle className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white">FAQs</h3>
            <p className="text-sm text-gray-400 mt-1">Common questions</p>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700 p-4 cursor-pointer hover:bg-gray-800 transition-colors">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20 mb-3">
              <BookOpen className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="font-semibold text-white">User Guide</h3>
            <p className="text-sm text-gray-400 mt-1">How-to guides</p>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700 p-4 cursor-pointer hover:bg-gray-800 transition-colors">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/20 mb-3">
              <Headphones className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white">Contact</h3>
            <p className="text-sm text-gray-400 mt-1">Get help</p>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700 p-4 cursor-pointer hover:bg-gray-800 transition-colors">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/20 mb-3">
              <Flag className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="font-semibold text-white">Report</h3>
            <p className="text-sm text-gray-400 mt-1">Report an issue</p>
          </Card>
        </div>
      </section>

      <section className="px-4 py-6 bg-gray-800/30">
        <h2 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          <Accordion type="single" collapsible className="space-y-2">
            {filteredFaqs.map((category) => (
              <AccordionItem
                key={category.category}
                value={category.category}
                className="border rounded-lg border-gray-700 bg-gray-800/50 overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 text-white hover:bg-gray-700/50">
                  {category.category}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3">
                  <div className="space-y-3 mt-2">
                    {category.items.map((item, index) => (
                      <div key={index} className="bg-gray-900/30 rounded-lg p-3">
                        <h4 className="font-medium text-white mb-1">{item.question}</h4>
                        <p className="text-sm text-gray-400">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="px-4 py-6 bg-gray-800/50">
        <h2 className="text-lg font-semibold text-white mb-4">Contact Support</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name" className="text-gray-300 mb-2">Name</Label>
            <Input 
              id="name" 
              type="text" 
              className="border-gray-700 bg-gray-900/50 text-white"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-gray-300 mb-2">Email</Label>
            <Input 
              id="email" 
              type="email" 
              className="border-gray-700 bg-gray-900/50 text-white"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="subject" className="text-gray-300 mb-2">Subject</Label>
            <Select onValueChange={handleSelectChange} value={formData.subject}>
              <SelectTrigger id="subject" className="border-gray-700 bg-gray-900/50 text-white">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="technical">Technical Support</SelectItem>
                <SelectItem value="account">Account Issues</SelectItem>
                <SelectItem value="billing">Billing Questions</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description" className="text-gray-300 mb-2">Description</Label>
            <Textarea 
              id="description" 
              rows={4} 
              className="border-gray-700 bg-gray-900/50 text-white"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-charcoal font-medium">
            Submit
          </Button>
        </form>
      </section>

      <section className="px-4 py-6">
        <h2 className="text-lg font-semibold text-white mb-4">Other Ways to Connect</h2>
        <div className="grid grid-cols-1 gap-4">
          <Card className="bg-gray-800/50 border-gray-700 p-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 mr-3">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-white">Email Support</h3>
                <p className="text-sm text-gray-400">support@headachejournal.com</p>
              </div>
            </div>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700 p-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 mr-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-white">Community Forum</h3>
                <p className="text-sm text-gray-400">Join the discussion</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <footer className="bg-gray-800/80 border-t border-gray-700 px-4 py-6">
        <div className="text-center">
          <div className="mb-4">
            <p className="font-medium text-white">Was this helpful?</p>
            <div className="flex justify-center space-x-4 mt-2">
              <Button variant="outline" size="sm" className="px-6 border-gray-700 text-gray-300 hover:bg-gray-700">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Yes
              </Button>
              <Button variant="outline" size="sm" className="px-6 border-gray-700 text-gray-300 hover:bg-gray-700">
                <ThumbsDown className="h-4 w-4 mr-2" />
                No
              </Button>
            </div>
          </div>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
};

export default SupportServices;
