
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { SectionHeading } from './SectionHeading';

interface TreatmentSectionProps {
  title: string;
  children: React.ReactNode;
  isLast?: boolean;
}

export function TreatmentSection({ title, children, isLast = false }: TreatmentSectionProps) {
  return (
    <>
      <div id={title === 'Treatment Timing' ? 'treatment-timing' : title === 'Effectiveness & Outcome' ? 'treatment-outcome' : undefined}>
        <SectionHeading title={title} />
        {children}
      </div>
      
      {!isLast && <Separator className="my-6 bg-gray-700" />}
    </>
  );
}
