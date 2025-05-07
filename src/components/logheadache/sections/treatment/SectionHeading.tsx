
import React from 'react';

interface SectionHeadingProps {
  title: string;
}

export function SectionHeading({ title }: SectionHeadingProps) {
  return (
    <h3 className="text-md font-medium text-white mb-4">{title}</h3>
  );
}
