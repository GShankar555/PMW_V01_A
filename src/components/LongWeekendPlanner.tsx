import React from "react";
import { Calendar, Plus } from "lucide-react";
import { ExtendedWeekendPlan, Event } from "../types/Event";
import { format, addDays } from "date-fns";
import WeekendSlot from "./WeekendSlot";

interface LongWeekendPlannerProps {
  weekendPlan: ExtendedWeekendPlan;
  onAddEvent: (event: Event, day: keyof ExtendedWeekendPlan) => void;
  onRemoveFromSlot: (day: keyof ExtendedWeekendPlan) => void;
  onRemoveEventFromSlot: (
    day: keyof ExtendedWeekendPlan,
    eventId: string
  ) => void;
  onToggleLongWeekend: () => void;
  startDate?: Date;
  onOpenAddModal?: (day: "friday" | "saturday" | "sunday" | "monday") => void;
  onOpenCommonAddModal?: () => void;
}

const LongWeekendPlanner: React.FC<LongWeekendPlannerProps> = ({
  weekendPlan,
  onRemoveFromSlot,
  onRemoveEventFromSlot,
  onToggleLongWeekend,
  startDate = new Date(),
  onOpenAddModal,
  onOpenCommonAddModal,
}) => {
  const getDayDate = (dayOffset: number) => addDays(startDate, dayOffset);

  const weekendDays = weekendPlan.isLongWeekend
    ? [
        { key: "friday" as const, label: "Friday", offset: -1 },
        { key: "saturday" as const, label: "Saturday", offset: 0 },
        { key: "sunday" as const, label: "Sunday", offset: 1 },
        { key: "monday" as const, label: "Monday", offset: 2 },
      ]
    : [
        { key: "saturday" as const, label: "Saturday", offset: 0 },
        { key: "sunday" as const, label: "Sunday", offset: 1 },
      ];

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar size={20} className="text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-white">
                {weekendPlan.isLongWeekend ? "Long Weekend" : "Regular Weekend"}
              </h3>
              <p className="text-white/60 text-sm">
                {weekendPlan.isLongWeekend
                  ? "Plan your extended 4-day weekend"
                  : "Switch to long weekend for more planning options"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {onOpenCommonAddModal && (
              <button
                onClick={onOpenCommonAddModal}
                className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 focus-ring hover:scale-105 flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Event</span>
              </button>
            )}
            <button
              onClick={onToggleLongWeekend}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 focus-ring hover:scale-105 ${
                weekendPlan.isLongWeekend
                  ? "bg-primary text-white hover:bg-primary/80"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              }`}
            >
              {weekendPlan.isLongWeekend
                ? "Switch to Regular"
                : "Make it Long Weekend"}
            </button>
          </div>
        </div>
      </div>
      <div
        className={`grid gap-6 ${
          weekendPlan.isLongWeekend
            ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-4"
            : "grid-cols-1 lg:grid-cols-2"
        }`}
      >
        {weekendDays.map(({ key, label, offset }) => {
          const dayDate = getDayDate(offset);
          const events = weekendPlan[key] || null;

          return (
            <div key={key} className="space-y-2">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-white">{label}</h4>
                <p className="text-white/60 text-sm">
                  {format(dayDate, "MMM dd")}
                </p>
              </div>
              <WeekendSlot
                day={key}
                events={events}
                onRemove={() => onRemoveFromSlot(key)}
                onRemoveEvent={(eventId) => onRemoveEventFromSlot(key, eventId)}
                onAddEvent={() => onOpenAddModal && onOpenAddModal(key)}
                isCompact={weekendPlan.isLongWeekend}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LongWeekendPlanner;
