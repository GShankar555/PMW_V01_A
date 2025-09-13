import React from "react";
import { Clock, MapPin, Star } from "lucide-react";
import { Event } from "../types/Event";
import { format } from "date-fns";

interface TimelineViewProps {
  events: Event[];
  day: string;
  date?: Date;
}

const TimelineView: React.FC<TimelineViewProps> = ({ events, day, date }) => {
  const getTimeSlotOrder = (timeSlot: Event["timeSlot"]) => {
    const order = { morning: 1, afternoon: 2, evening: 3, "all-day": 0 };
    return order[timeSlot || "morning"];
  };

  const sortedEvents = [...events].sort(
    (a, b) => getTimeSlotOrder(a.timeSlot) - getTimeSlotOrder(b.timeSlot)
  );

  const getVibeColor = (vibe: Event["vibe"]) => {
    const colors = {
      happy: "bg-yellow-400/20 text-yellow-300",
      relaxed: "bg-blue-400/20 text-blue-300",
      energetic: "bg-red-400/20 text-red-300",
      adventurous: "bg-orange-400/20 text-orange-300",
      social: "bg-purple-400/20 text-purple-300",
      peaceful: "bg-green-400/20 text-green-300",
      fun: "bg-pink-400/20 text-pink-300",
      chill: "bg-cyan-400/20 text-cyan-300",
      romantic: "bg-rose-400/20 text-rose-300",
      creative: "bg-indigo-400/20 text-indigo-300",
      challenging: "bg-amber-400/20 text-amber-300",
      inspiring: "bg-teal-400/20 text-teal-300",
      cultural: "bg-fuchsia-400/20 text-fuchsia-300",
      educational: "bg-lime-400/20 text-lime-300",
      spiritual: "bg-violet-400/20 text-violet-300",
      festive: "bg-red-300/20 text-red-200",
      sporty: "bg-green-300/20 text-green-200",
      cozy: "bg-orange-300/20 text-orange-200",
      mindful: "bg-blue-300/20 text-blue-200",
      exciting: "bg-yellow-300/20 text-yellow-200",
      meditative: "bg-emerald-400/20 text-emerald-300",
      playful: "bg-pink-300/20 text-pink-200",
      default: "bg-gray-400/20 text-gray-300",
    };
    return colors[vibe || "happy"];
  };

  const getTimeSlotLabel = (timeSlot: Event["timeSlot"]) => {
    const labels = {
      morning: "🌅 Morning",
      afternoon: "☀️ Afternoon",
      evening: "🌙 Evening",
      "all-day": "📅 All Day",
    };
    return labels[timeSlot || "morning"];
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
          <Clock size={20} className="text-primary" />
          <span>{day}</span>
        </h3>
        {date && (
          <span className="text-white/60 text-sm">
            {format(date, "MMM dd, yyyy")}
          </span>
        )}
      </div>

      {sortedEvents.length > 0 ? (
        <div className="space-y-4">
          {sortedEvents.map((event, index) => (
            <div key={event.id} className="relative">
              {index < sortedEvents.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-8 bg-gradient-to-b from-primary to-secondary opacity-50" />
              )}

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mt-2">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
                <div className="flex-1 bg-white/10 rounded-2xl p-4 border border-white/20">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">
                        {event.title}
                      </h4>
                      <div className="flex items-center space-x-3 text-sm text-white/70 mb-2">
                        <span className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>{getTimeSlotLabel(event.timeSlot)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin size={14} />
                          <span>{event.location}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {event.vibe && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getVibeColor(
                            event.vibe
                          )}`}
                        >
                          {event.vibe}
                        </span>
                      )}
                      <div className="flex items-center space-x-1">
                        <Star
                          size={14}
                          className="text-highlight fill-current"
                        />
                        <span className="text-white text-sm">
                          {event.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-white/70 text-sm mb-3 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">
                      {event.duration}
                    </span>
                    <div className="flex items-center space-x-2">
                      {event.difficulty && (
                        <span className="bg-white/10 text-white/70 px-2 py-1 rounded-lg text-xs">
                          {event.difficulty}
                        </span>
                      )}
                      {event.cost && (
                        <span className="bg-white/10 text-white/70 px-2 py-1 rounded-lg text-xs">
                          {event.cost}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-white/40 mb-2">
            <Clock size={32} className="mx-auto" />
          </div>
          <p className="text-white/60">No events scheduled</p>
        </div>
      )}
    </div>
  );
};

export default TimelineView;
