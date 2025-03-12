
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface SupportCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  isActive: boolean;
  iconBgColor: string;
  iconColor: string;
  onClick: () => void;
  isPremium?: boolean;
  linkTo?: string;
}

export function SupportCard({
  icon,
  title,
  description,
  isActive,
  iconBgColor,
  iconColor,
  onClick,
  isPremium = false,
  linkTo,
}: SupportCardProps) {
  return (
    <Card 
      className={`bg-gray-800/50 border-gray-700 p-4 cursor-pointer hover:bg-gray-800 transition-colors ${
        isActive ? 'ring-2 ring-primary' : ''
      } relative`}
      onClick={onClick}
    >
      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${iconBgColor} mb-3`}>
        <div className={iconColor}>{icon}</div>
      </div>
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-white">{title}</h3>
        {isPremium && (
          <Badge variant="outline" className="ml-2 bg-yellow-500/20 text-yellow-500 border-0">
            Premium
          </Badge>
        )}
        {linkTo && (
          <ExternalLink className="h-4 w-4 text-gray-400" />
        )}
      </div>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </Card>
  );
}
