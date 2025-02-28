
import { ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface InsightCardProps {
  title: string;
  icon: ReactNode;
  iconColor: string;
  children?: ReactNode;
}

export function InsightCard({ title, icon, iconColor, children }: InsightCardProps) {
  return (
    <Card className="relative flex-shrink-0 w-[170px] bg-gray-800/50 rounded-xl border-gray-700 hover:bg-gray-800/80 transition-colors">
      <CardContent className="p-4 flex flex-col items-center justify-center text-center">
        <div className={`text-3xl ${iconColor} mb-2`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-white">{title}</span>
        {children}
      </CardContent>
    </Card>
  );
}
