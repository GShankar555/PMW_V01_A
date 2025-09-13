import React from "react";
import { Calendar, X, Plus } from "lucide-react";
import { Event } from "../types/Event";

interface WeekendSlotProps {
  day: "friday" | "saturday" | "sunday" | "monday";
  events: Event[] | Event | null;
  onRemove: () => void;
  onAddEvent?: () => void;
  isCompact?: boolean;
  onRemoveEvent?: (eventId: string) => void;
}

const WeekendSlot: React.FC<WeekendSlotProps> = ({
  day,
  events,
  onRemove,
  onAddEvent,
  isCompact = false,
  onRemoveEvent,
}) => {
  const dayLabel = day.charAt(0).toUpperCase() + day.slice(1);
  const eventList = events ? (Array.isArray(events) ? events : [events]) : [];

  return (
    <div
      className={`${
        isCompact ? "min-h-[250px]" : "min-h-[300px]"
      } bg-white/5 backdrop-blur-sm rounded-3xl border-2 border-dashed transition-all duration-600 ${"border-white/20 hover:border-white/40"}`}
      role="region"
      aria-label={`${dayLabel} planner slot${
        eventList.length > 0
          ? ` with ${eventList.length} event${
              eventList.length !== 1 ? "s" : ""
            }`
          : " - empty"
      }`}
      aria-live="polite"
    >
      <div className={isCompact ? "p-4" : "p-6"}>
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`${
              isCompact ? "text-lg" : "text-xl"
            } font-semibold text-white flex items-center space-x-2`}
          >
            <Calendar size={20} className="text-primary" />
            <span>{dayLabel}</span>
            {eventList.length > 0 && (
              <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs">
                {eventList.length}
              </span>
            )}
          </h3>
          {eventList.length > 0 && (
            <button
              onClick={onRemove}
              className="text-white/60 hover:text-white transition-colors duration-200 focus-ring rounded-full p-1 hover:bg-white/10"
              aria-label={`Remove all events from ${dayLabel}`}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {eventList.length > 0 ? (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {eventList.map((singleEvent) => (
              <div
                key={singleEvent.id}
                className="bg-white/10 rounded-2xl p-4 border border-white/20"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={singleEvent.image}
                    alt={singleEvent.title}
                    className={`${
                      isCompact ? "w-12 h-12" : "w-16 h-16"
                    } rounded-xl object-cover flex-shrink-0`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 truncate">
                        <h4
                          className={`font-semibold text-white mb-1 ${
                            isCompact ? "text-sm" : ""
                          } truncate`}
                        >
                          {singleEvent.title}
                        </h4>
                        {!isCompact && (
                          <p className="text-white/70 text-sm line-clamp-2">
                            {singleEvent.description}
                          </p>
                        )}
                        <div className="flex items-center text-white/60 text-xs mt-2">
                          <span>{singleEvent.location}</span>
                          <span className="mx-2">•</span>
                          <span>{singleEvent.duration}</span>
                        </div>
                      </div>
                      {onRemoveEvent && (
                        <button
                          onClick={() => onRemoveEvent(singleEvent.id)}
                          className="text-white/40 hover:text-white transition-colors duration-200 focus-ring rounded-full p-1 hover:bg-white/10 ml-2"
                          aria-label={`Remove ${singleEvent.title} from ${dayLabel}`}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center ${isCompact ? "py-8" : "py-12"}`}>
            <div className="text-white/40 mb-4">
              <Calendar size={isCompact ? 32 : 48} className="mx-auto" />
            </div>
            <p className={`text-white/60 mb-2 ${isCompact ? "text-sm" : ""}`}>
              No event planned
            </p>
            <p
              className={`text-white/40 ${
                isCompact ? "text-xs" : "text-sm"
              } mb-4`}
            >
              Drag an event here from the Explore page
            </p>
            {onAddEvent && (
              <button
                onClick={onAddEvent}
                className="bg-white/10 hover:bg-white/20 text-white/70 hover:text-white px-4 py-2 rounded-xl text-sm transition-all duration-200 focus-ring flex items-center space-x-2 mx-auto"
                aria-label={`Add event to ${dayLabel}`}
              >
                <Plus size={16} />
                <span>Add Event</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeekendSlot;
