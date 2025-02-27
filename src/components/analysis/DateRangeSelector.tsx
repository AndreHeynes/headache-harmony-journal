
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

interface DateRangeSelectorProps {
  onRangeChange: (range: DateRange | undefined) => void;
}

export function DateRangeSelector({ onRangeChange }: DateRangeSelectorProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    onRangeChange(range);
  };

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return "Select date range";
    if (!range.to) return `From ${format(range.from, "MMM d, yyyy")}`;
    return `${format(range.from, "MMM d")} - ${format(range.to, "MMM d, yyyy")}`;
  };

  const predefinedRanges = [
    { label: "Last 7 days", days: 7 },
    { label: "Last 30 days", days: 30 },
    { label: "Last 90 days", days: 90 },
  ];

  const setPredefinedRange = (days: number) => {
    const to = new Date();
    const from = addDays(new Date(), -days);
    const newRange = { from, to };
    setDateRange(newRange);
    onRangeChange(newRange);
  };

  return (
    <Card className="mb-4 bg-gray-800/50 border-gray-700">
      <CardContent className="p-4 flex items-center justify-between">
        <span className="text-gray-300">{formatDateRange(dateRange)}</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="text-indigo-400">
              <CalendarIcon className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="end">
            <div className="p-3 border-b border-gray-700">
              <div className="flex gap-2 flex-wrap">
                {predefinedRanges.map((range) => (
                  <Button 
                    key={range.days} 
                    variant="outline" 
                    size="sm" 
                    className="bg-gray-700/50 border-gray-600 text-white hover:bg-gray-700"
                    onClick={() => setPredefinedRange(range.days)}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={1}
              className="bg-gray-800 text-white"
            />
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
}
