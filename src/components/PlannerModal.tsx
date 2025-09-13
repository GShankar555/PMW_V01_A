import React, { useState } from "react";
import { X, Calendar } from "lucide-react";
import { Event } from "../types/Event";
import EventCard from "./EventCard";

interface PlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableEvents: Event[];
  onSelectEvent: (
    event: Event,
    day: "friday" | "saturday" | "sunday" | "monday"
  ) => void;
  targetDay: "friday" | "saturday" | "sunday" | "monday" | null;
  isCommonAdd?: boolean;
  weekendPlan?: any;
}

const PlannerModal: React.FC<PlannerModalProps> = ({
  isOpen,
  onClose,
  availableEvents,
  onSelectEvent,
  targetDay,
  isCommonAdd = false,
  weekendPlan,
}) => {
  const [selectedDay, setSelectedDay] = useState<
    "friday" | "saturday" | "sunday" | "monday" | null
  >(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
      setSelectedDay(null);
      setSelectedEvent(null);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEventSelect = (event: Event) => {
    if (isCommonAdd) {
      setSelectedEvent(event);
    } else {
      onSelectEvent(event, targetDay!);
      onClose();
    }
  };

  const handleDaySelect = (
    day: "friday" | "saturday" | "sunday" | "monday"
  ) => {
    setSelectedDay(day);
  };

  const handleConfirmSelection = () => {
    if (selectedEvent && selectedDay) {
      onSelectEvent(selectedEvent, selectedDay);
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="planner-modal-title"
    >
      <div className="bg-background border border-white/20 rounded-3xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2
            id="planner-modal-title"
            className="text-2xl font-bold text-white"
          >
            {isCommonAdd
              ? "Add Event"
              : `Add Event to ${
                  targetDay?.charAt(0).toUpperCase() + targetDay?.slice(1)
                }`}
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors duration-200 focus-ring rounded-full p-2"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        <div
          className="p-6 overflow-y-auto w-full h-auto"
          style={{ maxHeight: "calc(90vh - 120px)" }}
        >
          {isCommonAdd ? (
            <div className="space-y-6">
              {!selectedEvent && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <Calendar size={20} className="text-primary" />
                    <span>Step 1: Choose an Event</span>
                  </h3>
                  {availableEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableEvents.map((event) => (
                        <div
                          key={event.id}
                          onClick={() => handleEventSelect(event)}
                          className="cursor-pointer hover:scale-105 transition-transform duration-200"
                        >
                          <EventCard
                            event={event}
                            isDraggable={false}
                            setIsDragging={() => {}}
                            showEditButton={false}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-white/60 text-lg">
                        No events available
                      </p>
                      <p className="text-white/40 text-sm mt-2">
                        All events are already in your planner or saved list
                      </p>
                    </div>
                  )}
                </div>
              )}
              {selectedEvent && !selectedDay && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <Calendar size={20} className="text-primary" />
                    <span>Step 2: Choose a Day</span>
                  </h3>
                  <div className="bg-white/5 rounded-2xl p-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedEvent.image}
                        alt={selectedEvent.title}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-white">
                          {selectedEvent.title}
                        </h4>
                        <p className="text-white/60 text-sm">
                          {selectedEvent.location}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {weekendPlan &&
                      (["friday", "saturday", "sunday", "monday"] as const)
                        .filter(
                          (day) =>
                            weekendPlan.isLongWeekend ||
                            day === "saturday" ||
                            day === "sunday"
                        )
                        .map((day) => (
                          <button
                            key={day}
                            onClick={() => handleDaySelect(day)}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 focus-ring"
                          >
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </button>
                        ))}
                  </div>
                </div>
              )}
              {selectedEvent && selectedDay && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <Calendar size={20} className="text-primary" />
                    <span>Step 3: Confirm Selection</span>
                  </h3>
                  <div className="bg-white/5 rounded-2xl p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <img
                        src={selectedEvent.image}
                        alt={selectedEvent.title}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="text-xl font-semibold text-white">
                          {selectedEvent.title}
                        </h4>
                        <p className="text-white/60">
                          {selectedEvent.location}
                        </p>
                        <p className="text-white/40 text-sm">
                          {selectedEvent.duration}
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-white/70 mb-4">
                        Add to{" "}
                        <span className="font-semibold text-primary">
                          {selectedDay.charAt(0).toUpperCase() +
                            selectedDay.slice(1)}
                        </span>
                        ?
                      </p>
                      <button
                        onClick={handleConfirmSelection}
                        className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 focus-ring"
                      >
                        Add Event
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : availableEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availableEvents.map((event) => (
                <div key={event.id} onClick={() => handleEventSelect(event)}>
                  <EventCard
                    event={event}
                    isDraggable={false}
                    setIsDragging={() => {}}
                    showEditButton={false}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">No events available</p>
              <p className="text-white/40 text-sm mt-2">
                All events are already in your planner or saved list
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlannerModal;
