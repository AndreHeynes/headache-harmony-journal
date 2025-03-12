
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface SupportCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  isActive: boolean;
  iconBgColor: string;
  iconColor: string;
  onClick: () => void;
}

export function SupportCard({
  icon,
  title,
  description,
  isActive,
  iconBgColor,
  iconColor,
  onClick,
}: SupportCardProps) {
  return (
    <Card 
      className={`bg-gray-800/50 border-gray-700 p-4 cursor-pointer hover:bg-gray-800 transition-colors ${
        isActive ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
    >
      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${iconBgColor} mb-3`}>
        <div className={iconColor}>{icon}</div>
      </div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </Card>
  );
}
