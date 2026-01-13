import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MiniOutfitComposition } from "./MiniOutfitComposition";
import { CalendarDayDialog } from "./CalendarDayDialog";
import { useCalendarOutfits, CalendarOutfit } from "@/hooks/useCalendarOutfits";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay, addMonths, subMonths } from "date-fns";

interface OutfitCalendarProps {
  onScheduleFromComposer?: (date: string) => void;
}

export const OutfitCalendar = ({ onScheduleFromComposer }: OutfitCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const { data: calendarOutfits = [], isLoading } = useCalendarOutfits(year, month);
  
  // Create a map of date -> outfit for quick lookup
  const outfitsByDate = useMemo(() => {
    const map = new Map<string, CalendarOutfit>();
    calendarOutfits.forEach(outfit => {
      map.set(outfit.scheduled_date, outfit);
    });
    return map;
  }, [calendarOutfits]);
  
  // Generate calendar days
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });
    
    // Add padding days for the start of the week (Sunday = 0)
    const startPadding = getDay(start);
    const paddingDays = Array(startPadding).fill(null);
    
    return [...paddingDays, ...days];
  }, [currentDate]);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsDialogOpen(true);
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Calendar Header */}
      <div className="px-4 py-4 border-b border-border bg-gradient-to-r from-purple-600/10 to-transparent">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-semibold">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentDate(new Date())}
              className="text-xs"
            >
              Today
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 border-b border-border">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, idx) => {
          if (!day) {
            return (
              <div
                key={`empty-${idx}`}
                className="aspect-square border-b border-r border-border bg-muted/30"
              />
            );
          }

          const dateStr = format(day, "yyyy-MM-dd");
          const outfit = outfitsByDate.get(dateStr);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);

          return (
            <button
              key={dateStr}
              onClick={() => handleDayClick(day)}
              className={`
                relative aspect-square border-b border-r border-border p-1
                transition-colors hover:bg-accent/5
                ${!isCurrentMonth ? "opacity-40" : ""}
                ${isTodayDate ? "bg-accent/10 ring-2 ring-inset ring-accent/30" : ""}
              `}
            >
              {/* Day Number */}
              <span
                className={`
                  absolute top-1 left-1 text-xs font-medium z-10
                  ${isTodayDate ? "text-accent font-bold" : "text-muted-foreground"}
                `}
              >
                {format(day, "d")}
              </span>

              {/* Outfit Preview or Empty State */}
              {outfit ? (
                <div className="absolute inset-0 p-3 pt-5">
                  <MiniOutfitComposition outfit={outfit} />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Plus className="w-3 h-3 text-purple-500" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Calendar Day Dialog */}
      {selectedDate && (
        <CalendarDayDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          date={selectedDate}
        />
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
          <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
};
