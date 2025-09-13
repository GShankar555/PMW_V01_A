import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Share2, Calendar, Eye, Grid, Clock, X } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import TimelineView from "../components/TimelineView";
import CalendarView from "../components/CalendarView";
import ThemeSelector from "../components/ThemeSelector";
import LongWeekendPlanner from "../components/LongWeekendPlanner";
import EventEditModal from "../components/EventEditModal";
import SharePosterModal from "../components/SharePosterModal";
import PlannerModal from "../components/PlannerModal";
import { Event } from "../types/Event";
import { sampleEvents } from "../data/events";

type ViewMode = "cards" | "timeline" | "calendar";

const Planner: React.FC = () => {
  const {
    weekendPlan,
    savedWeekendPlans,
    addToWeekendPlan,
    removeFromWeekendPlan,
    removeEventFromWeekendPlan,
    setWeekendTheme,
    toggleLongWeekend,
    updateEvent,
    saveWeekendPlan,
    loadWeekendPlan,
    deleteWeekendPlan,
    showToast,
  } = useAppContext();

  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [plannerModalOpen, setPlannerModalOpen] = useState(false);
  const [targetDay, setTargetDay] = useState<
    "friday" | "saturday" | "sunday" | "monday"
  >(null);
  const [isCommonAddModal, setIsCommonAddModal] = useState(false);
  const [savePlanModalOpen, setSavePlanModalOpen] = useState(false);
  const [planName, setPlanName] = useState("");

  const handleRemoveFromSlot = (day: keyof typeof weekendPlan) => {
    if (
      day === "theme" ||
      day === "isLongWeekend" ||
      day === "startDate" ||
      day === "endDate"
    )
      return;
    const events = weekendPlan[day];
    if (events) {
      removeFromWeekendPlan(day);
      const eventTitle = Array.isArray(events)
        ? `${events.length} events`
        : typeof events === "object"
        ? events.title
        : "event";
      showToast(
        `Removed ${eventTitle} from ${
          day.charAt(0).toUpperCase() + day.slice(1)
        }`
      );
    }
  };

  const handleRemoveEventFromSlot = (
    day: keyof typeof weekendPlan,
    eventId: string
  ) => {
    if (
      day === "theme" ||
      day === "isLongWeekend" ||
      day === "startDate" ||
      day === "endDate"
    )
      return;

    const events = weekendPlan[day];
    if (events) {
      const eventToRemove = Array.isArray(events)
        ? events.find((e) => e.id === eventId)
        : typeof events === "object" && events.id === eventId
        ? events
        : null;

      if (eventToRemove) {
        removeEventFromWeekendPlan(day, eventId);
        showToast(
          `Removed "${eventToRemove.title}" from ${
            day.charAt(0).toUpperCase() + day.slice(1)
          }`
        );
      }
    }
  };

  const handleShareWeekend = async () => {
    const { saturday, sunday, friday, monday } = weekendPlan;
    const hasEvents = saturday || sunday || friday || monday;

    if (!hasEvents) {
      showToast("No events planned to share");
      return;
    }

    setShareModalOpen(true);
  };

  const openAddModalForDay = (
    day: "friday" | "saturday" | "sunday" | "monday"
  ) => {
    setTargetDay(day);
    setIsCommonAddModal(false);
    setPlannerModalOpen(true);
  };

  const openCommonAddModal = () => {
    setTargetDay(null);
    setIsCommonAddModal(true);
    setPlannerModalOpen(true);
  };

  const handleModalEventSelect = (
    event: Event,
    day: "friday" | "saturday" | "sunday" | "monday"
  ) => {
    addToWeekendPlan(event, day);
    showToast(
      `Added "${event.title}" to ${day.charAt(0).toUpperCase() + day.slice(1)}`
    );
  };

  const handleSavePlan = () => {
    if (!planName.trim()) {
      showToast("Please enter a plan name");
      return;
    }
    saveWeekendPlan(planName.trim());
    setPlanName("");
    setSavePlanModalOpen(false);
  };

  const handleLoadPlan = (planId: string) => {
    loadWeekendPlan(planId);
  };

  const handleDeletePlan = (planId: string) => {
    deleteWeekendPlan(planId);
  };

  const handleEventEdit = (event: Event) => {
    setEditingEvent(event);
  };

  const handleEventSave = (updatedEvent: Event) => {
    updateEvent(updatedEvent.id, updatedEvent);
    showToast(`Updated "${updatedEvent.title}"`);
  };

  const getAllEvents = () => {
    const allEvents: Event[] = [];
    (["friday", "saturday", "sunday", "monday"] as const).forEach((day) => {
      const events = weekendPlan[day];
      if (events) {
        if (Array.isArray(events)) {
          allEvents.push(...events);
        } else {
          allEvents.push(events);
        }
      }
    });
    return allEvents;
  };

  const renderViewModeContent = () => {
    switch (viewMode) {
      case "timeline":
        return (
          <div className="space-y-6">
            {(["friday", "saturday", "sunday", "monday"] as const)
              .filter(
                (day) =>
                  weekendPlan.isLongWeekend ||
                  day === "saturday" ||
                  day === "sunday"
              )
              .map((day) => {
                const events = weekendPlan[day];
                const eventList = events
                  ? Array.isArray(events)
                    ? events
                    : [events]
                  : [];

                return (
                  <TimelineView
                    key={day}
                    events={eventList}
                    day={day.charAt(0).toUpperCase() + day.slice(1)}
                    date={new Date()}
                  />
                );
              })}
          </div>
        );

      case "calendar":
        return (
          <CalendarView
            weekendPlan={weekendPlan}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            onEventClick={handleEventEdit}
          />
        );

      default:
        return (
          <LongWeekendPlanner
            weekendPlan={weekendPlan}
            onAddEvent={addToWeekendPlan}
            onRemoveFromSlot={handleRemoveFromSlot}
            onRemoveEventFromSlot={handleRemoveEventFromSlot}
            onToggleLongWeekend={toggleLongWeekend}
            startDate={currentDate}
            onOpenAddModal={openAddModalForDay}
            onOpenCommonAddModal={openCommonAddModal}
          />
        );
    }
  };

  return (
    <main className="min-h-screen bg-background pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-2xl">
              <Calendar size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Weekend Planner
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-6">
            Your comprehensive weekend planning dashboard with multiple views
            and advanced features
          </p>
          <div className="flex items-center justify-center space-x-2 mb-6">
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 focus-ring ${
                viewMode === "cards"
                  ? "bg-primary text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              }`}
            >
              <Grid size={16} />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 focus-ring ${
                viewMode === "timeline"
                  ? "bg-primary text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              }`}
            >
              <Clock size={16} />
              <span>Timeline</span>
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 focus-ring ${
                viewMode === "calendar"
                  ? "bg-primary text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              }`}
            >
              <Eye size={16} />
              <span>Calendar</span>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleShareWeekend}
              className="bg-gradient-to-r from-secondary to-primary text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 focus-ring flex items-center space-x-2 mx-auto sm:mx-0"
            >
              <Share2 size={20} />
              <span>Share Weekend Plan</span>
            </button>

            <button
              onClick={() => setSavePlanModalOpen(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 focus-ring flex items-center space-x-2 mx-auto sm:mx-0"
            >
              <Calendar size={20} />
              <span>Save Plan</span>
            </button>

            <Link
              to="/explore"
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 focus-ring flex items-center space-x-2 mx-auto sm:mx-0"
            >
              <Calendar size={20} />
              <span>Add More Events</span>
            </Link>
          </div>
        </div>
        <div className="mb-8">
          <ThemeSelector
            selectedTheme={weekendPlan.theme}
            onThemeChange={setWeekendTheme}
          />
        </div>
        {savedWeekendPlans.length > 0 && (
          <div className="mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Calendar size={20} className="text-primary" />
                <span>Saved Weekend Plans</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedWeekendPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-white/5 rounded-xl p-4 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white truncate">
                        {plan.name}
                      </h4>
                      <button
                        onClick={() => handleDeletePlan(plan.id!)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-white/60 text-sm mb-3">
                      {plan.isLongWeekend ? "Long Weekend" : "Regular Weekend"}{" "}
                      • {plan.theme || "No theme"}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleLoadPlan(plan.id!)}
                        className="flex-1 bg-primary/20 text-primary px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/30 transition-colors"
                      >
                        Load
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="pb-16">{renderViewModeContent()}</div>

        <div className="text-center py-8 border-t border-white/10">
          <div className="grid grid-cols-3">
            <div>
              <div className="text-2xl font-bold text-primary">
                {getAllEvents().length}
              </div>
              <div className="text-white/60 text-sm">Events Planned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">
                {weekendPlan.isLongWeekend ? "4" : "2"}
              </div>
              <div className="text-white/60 text-sm">Days</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-highlight">
                {weekendPlan.theme ? "1" : "0"}
              </div>
              <div className="text-white/60 text-sm">Theme</div>
            </div>
          </div>
        </div>
      </div>
      {editingEvent && (
        <EventEditModal
          isOpen={!!editingEvent}
          onClose={() => setEditingEvent(null)}
          event={editingEvent}
          onSave={handleEventSave}
        />
      )}

      <SharePosterModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        weekendPlan={weekendPlan}
      />
      <PlannerModal
        isOpen={plannerModalOpen}
        onClose={() => setPlannerModalOpen(false)}
        availableEvents={(() => {
          const plannedIds = new Set(getAllEvents().map((e) => e.id));
          return sampleEvents.filter((ev: Event) => !plannedIds.has(ev.id));
        })()}
        onSelectEvent={handleModalEventSelect}
        targetDay={targetDay}
        isCommonAdd={isCommonAddModal}
        weekendPlan={weekendPlan}
      />

      {savePlanModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-background border border-white/20 rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">
                Save Weekend Plan
              </h2>
              <button
                onClick={() => setSavePlanModalOpen(false)}
                className="text-white/60 hover:text-white transition-colors duration-200 focus-ring rounded-full p-2"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-white font-medium mb-2">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="Enter plan name..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  autoFocus
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSavePlanModalOpen(false)}
                  className="flex-1 px-4 py-3 text-white/70 hover:text-white transition-colors duration-200 focus-ring rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePlan}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 focus-ring"
                >
                  Save Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Planner;
