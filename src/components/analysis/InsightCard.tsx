
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
    <Card className="flex-shrink-0 w-[160px] bg-gray-800/50 rounded-xl border-gray-700">
      <CardContent className="p-4 flex flex-col items-center justify-center">
        <div className={`text-3xl ${iconColor} mb-2`}>
          {icon}
        </div>
        <span className="text-sm text-center text-gray-400">{title}</span>
        {children}
      </CardContent>
    </Card>
  );
}
