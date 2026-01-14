
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle, BookOpen, Headphones, Flag } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import { SupportHeader } from "@/components/support/SupportHeader";
import { SupportCard } from "@/components/support/SupportCard";
import { FAQSection } from "@/components/support/FAQSection";
import { ContactForm } from "@/components/support/ContactForm";
import { FeedbackFooter } from "@/components/support/FeedbackFooter";
import UserGuideContent from "@/components/support/UserGuideContent";
import { faqData } from "@/components/support/faqData";

const SupportServices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSectionClick = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const supportCards = [
    {
      id: 'faqs',
      title: 'FAQs',
      description: 'Common questions',
      icon: <HelpCircle className="h-6 w-6" />,
      iconBgColor: 'bg-blue-500/20',
      iconColor: 'text-blue-600'
    },
    {
      id: 'guide',
      title: 'User Guide',
      description: 'How-to guides',
      icon: <BookOpen className="h-6 w-6" />,
      iconBgColor: 'bg-green-500/20',
      iconColor: 'text-green-600'
    },
    {
      id: 'contact',
      title: 'Contact',
      description: 'Get help',
      icon: <Headphones className="h-6 w-6" />,
      iconBgColor: 'bg-purple-500/20',
      iconColor: 'text-purple-600'
    },
    {
      id: 'report',
      title: 'Report',
      description: 'Report an issue',
      icon: <Flag className="h-6 w-6" />,
      iconBgColor: 'bg-red-500/20',
      iconColor: 'text-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <SupportHeader 
        onBack={handleGoBack} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      <section className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          {supportCards.map((card) => (
            <SupportCard
              key={card.id}
              title={card.title}
              description={card.description}
              icon={card.icon}
              iconBgColor={card.iconBgColor}
              iconColor={card.iconColor}
              isActive={activeSection === card.id}
              onClick={() => handleSectionClick(card.id)}
            />
          ))}
        </div>
      </section>

      {activeSection && (
        <section className="px-4 py-6 bg-muted/50">
          {activeSection === 'guide' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">User Guide</h2>
              <UserGuideContent />
            </div>
          )}
          {activeSection === 'faqs' && (
            <FAQSection searchQuery={searchQuery} faqData={faqData} />
          )}
          {activeSection === 'contact' && (
            <ContactForm title="Contact Support" />
          )}
          {activeSection === 'report' && (
            <ContactForm title="Report an Issue" />
          )}
        </section>
      )}

      <FeedbackFooter />

      <BottomNav />
    </div>
  );
};

export default SupportServices;
