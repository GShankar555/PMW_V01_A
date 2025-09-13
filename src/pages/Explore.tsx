import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar, Loader2 } from "lucide-react";
import EventCard from "../components/EventCard";
import SearchBar from "../components/SearchBar";
import WeekendSlot from "../components/WeekendSlot";
import PlannerModal from "../components/PlannerModal";
import { sampleEvents } from "../data/events";
import { useAppContext } from "../context/AppContext";
import { Event } from "../types/Event";

const DraggableEventCard: React.FC<{
  event: Event;
  draggedEvent: Event | null;
  handleMouseDown: (
    event: Event,
    e: React.MouseEvent,
    offset?: { offsetX: number; offsetY: number }
  ) => void;
  handleTouchStart: (
    event: Event,
    e: React.TouchEvent,
    offset?: { offsetX: number; offsetY: number }
  ) => void;
}> = ({ event, draggedEvent, handleMouseDown, handleTouchStart }) => {
  const cardRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      key={event.id}
      ref={cardRef}
      onMouseDown={(e) => {
        const rect = cardRef.current?.getBoundingClientRect();
        const offsetX = e.clientX - (rect?.left ?? 0);
        const offsetY = e.clientY - (rect?.top ?? 0);
        handleMouseDown(event, e, { offsetX, offsetY });
      }}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        const rect = cardRef.current?.getBoundingClientRect();
        const offsetX = touch.clientX - (rect?.left ?? 0);
        const offsetY = touch.clientY - (rect?.top ?? 0);
        handleTouchStart(event, e, { offsetX, offsetY });
      }}
      className={`cursor-grab active:cursor-grabbing ${
        draggedEvent?.id === event.id ? "opacity-50" : ""
      }`}
    >
      <EventCard
        event={event}
        isDraggable
        setIsDragging={() => {}}
        showEditButton={false}
      />
    </div>
  );
};

const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [plannerModalOpen, setPlannerModalOpen] = useState(false);
  const [targetDay, setTargetDay] = useState<"saturday" | "sunday">(null);
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragCurrentPos, setDragCurrentPos] = useState({ x: 0, y: 0 });
  const [dropTarget, setDropTarget] = useState<"saturday" | "sunday" | null>(
    null
  );
  const [dragOffset, setDragOffset] = useState({ offsetX: 0, offsetY: 0 });

  const {
    addToWeekendPlan,
    removeFromWeekendPlan,
    removeEventFromWeekendPlan,
    weekendPlan,
    showToast,
  } = useAppContext();

  const filteredEvents = useMemo(() => {
    try {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return sampleEvents;

      const terms = q.split(/\s+/).filter(Boolean);
      if (terms.length === 0) return sampleEvents;

      const fields = (e: Event) =>
        [
          e.title || "",
          e.description || "",
          e.category || "",
          e.location || "",
          e.vibe || "",
          e.timeSlot || "",
          e.difficulty || "",
          e.cost || "",
        ]
          .join(" ")
          .toLowerCase();

      return sampleEvents.filter((ev) => {
        try {
          const hay = fields(ev);
          return terms.some((t) => hay.includes(t));
        } catch (error) {
          console.warn("Error filtering event:", ev.id, error);
          return false;
        }
      });
    } catch (error) {
      console.error("Search error:", error);
      return sampleEvents;
    }
  }, [searchQuery, sampleEvents]);

  const handleDragStart = (
    event: Event,
    clientX: number,
    clientY: number,
    offset?: { offsetX: number; offsetY: number }
  ) => {
    setDraggedEvent(event);
    setIsDragging(true);
    setDragCurrentPos({ x: clientX, y: clientY });
    setDropTarget(null);
    if (offset) setDragOffset(offset);
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || !draggedEvent) return;

    setDragCurrentPos({ x: clientX, y: clientY });
    const elementBelow = document.elementFromPoint(clientX, clientY);
    const dropZone = elementBelow?.closest("[data-drop-zone]");

    if (dropZone) {
      const day = dropZone.getAttribute("data-drop-zone") as
        | "saturday"
        | "sunday";
      setDropTarget(day);
    } else {
      setDropTarget(null);
    }
  };

  const handleDragEnd = (clientX: number, clientY: number) => {
    if (!isDragging || !draggedEvent) return;
    const elementBelow = document.elementFromPoint(clientX, clientY);
    const dropZone = elementBelow?.closest("[data-drop-zone]");

    if (dropZone) {
      const day = dropZone.getAttribute("data-drop-zone") as
        | "saturday"
        | "sunday";
      const currentEvents = weekendPlan[day] || [];
      const isAlreadyAdded = Array.isArray(currentEvents)
        ? currentEvents.some((e) => e.id === draggedEvent.id)
        : currentEvents?.id === draggedEvent.id;

      if (!isAlreadyAdded) {
        addToWeekendPlan(draggedEvent, day);
        showToast(
          `Added "${draggedEvent.title}" to ${
            day.charAt(0).toUpperCase() + day.slice(1)
          }`
        );
      } else {
        showToast(
          `"${draggedEvent.title}" is already in ${
            day.charAt(0).toUpperCase() + day.slice(1)
          }`
        );
      }
    }
    setDraggedEvent(null);
    setIsDragging(false);
    setDropTarget(null);
    document.body.style.userSelect = "";
    document.body.style.webkitUserSelect = "";
  };
  const handleMouseDown = (
    event: Event,
    e: React.MouseEvent,
    offset?: { offsetX: number; offsetY: number }
  ) => {
    e.preventDefault();
    handleDragStart(event, e.clientX, e.clientY, offset);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      handleDragMove(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      handleDragEnd(e.clientX, e.clientY);
    }
  };

  const handleTouchStart = (
    event: Event,
    e: React.TouchEvent,
    offset?: { offsetX: number; offsetY: number }
  ) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleDragStart(event, touch.clientX, touch.clientY, offset);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging) {
      e.preventDefault();
      const touch = e.touches[0];
      handleDragMove(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (isDragging) {
      e.preventDefault();
      const touch = e.changedTouches[0];
      handleDragEnd(touch.clientX, touch.clientY);
    }
  };
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging]);

  const handleRemoveFromSlot = (day: "saturday" | "sunday") => {
    const events = weekendPlan[day];
    if (events) {
      removeFromWeekendPlan(day);
      const eventTitle = Array.isArray(events)
        ? `${events.length} events`
        : events.title;
      showToast(
        `Removed ${eventTitle} from ${
          day.charAt(0).toUpperCase() + day.slice(1)
        }`
      );
    }
  };

  const handleRemoveEventFromSlot = (
    day: "saturday" | "sunday",
    eventId: string
  ) => {
    const events = weekendPlan[day];
    if (events) {
      if (Array.isArray(events)) {
        const updatedEvents = events.filter((e) => e.id !== eventId);
        if (updatedEvents.length === 0) {
          removeFromWeekendPlan(day);
        } else {
          const eventToRemove = events.find((e) => e.id === eventId);
          if (eventToRemove) {
            removeEventFromWeekendPlan(day, eventToRemove.id);
            showToast(
              `Removed "${eventToRemove.title}" from ${
                day.charAt(0).toUpperCase() + day.slice(1)
              }`
            );
          }
        }
      } else if (events.id === eventId) {
        removeFromWeekendPlan(day);
        showToast(
          `Removed "${events.title}" from ${
            day.charAt(0).toUpperCase() + day.slice(1)
          }`
        );
      }
    }
  };

  const handleSlotAddEvent = (day: "saturday" | "sunday") => {
    setTargetDay(day);
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

  return (
    <main className="min-h-screen bg-background pt-8" id="main-content">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore & Plan Your Weekend
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-6">
            Discover amazing activities and drag them into your weekend planner
          </p>
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4 mb-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">
                  Available Events
                </h2>
                <p className="text-white/60 text-sm">
                  {filteredEvents.length === sampleEvents.length
                    ? `${filteredEvents.length} events • Drag to plan your weekend`
                    : `${filteredEvents.length} event${
                        filteredEvents.length !== 1 ? "s" : ""
                      } found`}
                </p>
              </div>
            </div>
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <DraggableEventCard
                    key={event.id}
                    event={event}
                    draggedEvent={draggedEvent}
                    handleMouseDown={handleMouseDown}
                    handleTouchStart={handleTouchStart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No events found
                  </h3>
                  <p className="text-white/70 mb-6">
                    Try adjusting your search terms or browse all available
                    events.
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 focus-ring"
                  >
                    Show All Events
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-8 pointer-events-auto z-40">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <Calendar size={24} className="text-primary" />
                  <span>Weekend Planner</span>
                </h2>
                <Link
                  to={"/planner"}
                  className="bg-gradient-to-r from-secondary to-primary text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 focus-ring flex items-center space-x-2 text-sm"
                  aria-label="Plan your weekend"
                >
                  <span className="hidden xl:inline">Go To Planner</span>
                </Link>
              </div>

              <div className="space-y-6">
                <div
                  data-drop-zone="saturday"
                  className={`transition-all duration-200 ${
                    dropTarget === "saturday" ? "scale-105" : ""
                  }`}
                >
                  <WeekendSlot
                    day="saturday"
                    events={weekendPlan.saturday}
                    onRemove={() => handleRemoveFromSlot("saturday")}
                    onRemoveEvent={(eventId) =>
                      handleRemoveEventFromSlot("saturday", eventId)
                    }
                    onAddEvent={() => handleSlotAddEvent("saturday")}
                    isCompact={true}
                  />
                </div>
                <div
                  data-drop-zone="sunday"
                  className={`transition-all duration-200 ${
                    dropTarget === "sunday" ? "scale-105" : ""
                  }`}
                >
                  <WeekendSlot
                    day="sunday"
                    events={weekendPlan.sunday}
                    onRemove={() => handleRemoveFromSlot("sunday")}
                    onRemoveEvent={(eventId) =>
                      handleRemoveEventFromSlot("sunday", eventId)
                    }
                    onAddEvent={() => handleSlotAddEvent("sunday")}
                    isCompact={true}
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-white/5 rounded-2xl">
                <p className="text-white/60 text-sm text-center">
                  💡 <strong>Tip:</strong> Drag events from the left or use the
                  "Add" button for touch devices
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:hidden">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Calendar size={20} className="text-primary" />
                <span>Weekend Planner</span>
              </h2>
              <Link
                to={"/planner"}
                className="bg-gradient-to-r from-secondary to-primary text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 focus-ring flex items-center space-x-2 text-sm"
              >
                <span>Go To Planner</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div
                data-drop-zone="saturday"
                className={`transition-all duration-200 ${
                  dropTarget === "saturday" ? "scale-105" : ""
                }`}
              >
                <WeekendSlot
                  day="saturday"
                  events={weekendPlan.saturday}
                  onRemove={() => handleRemoveFromSlot("saturday")}
                  onRemoveEvent={(eventId) =>
                    handleRemoveEventFromSlot("saturday", eventId)
                  }
                  onAddEvent={() => handleSlotAddEvent("saturday")}
                  isCompact={true}
                />
              </div>
              <div
                data-drop-zone="sunday"
                className={`transition-all duration-200 ${
                  dropTarget === "sunday" ? "scale-105" : ""
                }`}
              >
                <WeekendSlot
                  day="sunday"
                  events={weekendPlan.sunday}
                  onRemove={() => handleRemoveFromSlot("sunday")}
                  onRemoveEvent={(eventId) =>
                    handleRemoveEventFromSlot("sunday", eventId)
                  }
                  onAddEvent={() => handleSlotAddEvent("sunday")}
                  isCompact={true}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">
                Available Events
              </h2>
              <p className="text-white/60 text-sm">
                {filteredEvents.length === sampleEvents.length
                  ? `${filteredEvents.length} events • Drag or tap "Add" to plan`
                  : `${filteredEvents.length} event${
                      filteredEvents.length !== 1 ? "s" : ""
                    } found`}
              </p>
            </div>

            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 pb-16">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    onMouseDown={(e) => handleMouseDown(event, e)}
                    onTouchStart={(e) => handleTouchStart(event, e)}
                    className={`cursor-grab active:cursor-grabbing ${
                      draggedEvent?.id === event.id ? "opacity-50" : ""
                    }`}
                  >
                    <EventCard
                      event={event}
                      isDraggable
                      setIsDragging={setIsDragging}
                      showEditButton={false}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No events found
                  </h3>
                  <p className="text-white/70 mb-6">
                    Try adjusting your search terms or browse all available
                    events.
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 focus-ring"
                  >
                    Show All Events
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <PlannerModal
        isOpen={plannerModalOpen}
        onClose={() => setPlannerModalOpen(false)}
        availableEvents={filteredEvents}
        onSelectEvent={handleModalEventSelect}
        targetDay={targetDay}
      />
      {isDragging && draggedEvent && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: dragCurrentPos.x - dragOffset.offsetX + window.scrollX,
            top: dragCurrentPos.y - dragOffset.offsetY + window.scrollY,
          }}
        >
          <div className="transform scale-50 opacity-80">
            <EventCard
              event={draggedEvent}
              isDraggable
              setIsDragging={setIsDragging}
              showEditButton={false}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default Explore;
