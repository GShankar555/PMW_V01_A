import React from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { Event, ExtendedWeekendPlan } from "../types/Event";

interface CalendarViewProps {
  weekendPlan: ExtendedWeekendPlan;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onEventClick?: (event: Event) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  weekendPlan,
  currentDate,
  onEventClick,
}) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 4 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventsForDay = (date: Date): Event[] => {
    const dayName = format(date, "EEEE").toLowerCase();
    const events = weekendPlan[dayName as keyof ExtendedWeekendPlan];

    if (!events) return [];
    if (Array.isArray(events)) return events;
    if (typeof events === "object" && events !== null && "id" in events)
      return [events as Event];
    return [];
  };

  const getVibeColor = (vibe: Event["vibe"]) => {
    const colors: Record<string, string> = {
      happy: "bg-yellow-400/30 border-yellow-400/50",
      relaxed: "bg-blue-400/30 border-blue-400/50",
      energetic: "bg-red-400/30 border-red-400/50",
      adventurous: "bg-orange-400/30 border-orange-400/50",
      social: "bg-purple-400/30 border-purple-400/50",
      peaceful: "bg-green-400/30 border-green-400/50",
      chill: "bg-cyan-400/30 border-cyan-400/50",
      inspiring: "bg-pink-400/30 border-pink-400/50",
      fun: "bg-rose-400/30 border-rose-400/50",
      educational: "bg-indigo-400/30 border-indigo-400/50",
    };
    return colors[vibe || "happy"] || "bg-yellow-400/30 border-yellow-400/50";
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div key={day.toISOString()} className="text-center p-3">
            <div className="text-white/60 text-sm font-medium mb-1">
              {format(day, "EEE")}
            </div>
          </div>
        ))}

        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          return (
            <div
              key={`events-${day.toISOString()}`}
              className="min-h-[120px] p-2 rounded-xl border-2 transition-all duration-200 border-white/10 bg-white/5"
            >
              <div className="max-h-52 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent p-1">
                {dayEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onEventClick?.(event)}
                    className={`w-full text-left p-2 rounded-lg border text-xs transition-all duration-200 hover:scale-105 focus-ring ${getVibeColor(
                      event.vibe
                    )}`}
                  >
                    <div className="font-medium text-white truncate">
                      {event.title}
                    </div>
                    <div className="text-white/70 truncate">
                      {event.timeSlot}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex flex-wrap gap-3 justify-center">
          {(
            [
              "happy",
              "relaxed",
              "energetic",
              "adventurous",
              "social",
              "peaceful",
            ] as const
          ).map((vibe) => (
            <div key={vibe} className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full border ${getVibeColor(vibe)}`}
              />
              <span className="text-white/60 text-xs capitalize">{vibe}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
