
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  category: string;
  items: FAQItem[];
}

interface FAQSectionProps {
  searchQuery: string;
  faqData: FAQCategory[];
}

export function FAQSection({ searchQuery, faqData }: FAQSectionProps) {
  const filteredFaqs = faqData.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="space-y-4">
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
    </div>
  );
}
