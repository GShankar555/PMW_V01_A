import React, { useState } from "react";
import { X, Clock, MapPin, Star, Zap } from "lucide-react";
import { Event } from "../types/Event";

interface EventEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onSave: (updatedEvent: Event) => void;
}

const EventEditModal: React.FC<EventEditModalProps> = ({
  isOpen,
  onClose,
  event,
  onSave,
}) => {
  const [editedEvent, setEditedEvent] = useState<Event>(event);

  React.useEffect(() => {
    setEditedEvent(event);
  }, [event]);

  React.useEffect(() => {
    if (isOpen) {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(editedEvent);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const vibeOptions: Event["vibe"][] = [
    "happy",
    "relaxed",
    "energetic",
    "adventurous",
    "social",
    "peaceful",
  ];
  const timeSlotOptions: Event["timeSlot"][] = [
    "morning",
    "afternoon",
    "evening",
    "all-day",
  ];
  const difficultyOptions: Event["difficulty"][] = [
    "easy",
    "moderate",
    "challenging",
  ];
  const costOptions: Event["cost"][] = ["free", "low", "medium", "high"];

  const getVibeEmoji = (vibe: Event["vibe"]) => {
    const emojis: Record<string, string> = {
      happy: "😊",
      relaxed: "😌",
      energetic: "⚡",
      adventurous: "🏔️",
      social: "👥",
      peaceful: "🧘",
      chill: "😎",
      inspiring: "✨",
      fun: "🎉",
      educational: "📚",
    };
    return emojis[vibe || "happy"] || "😊";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-edit-modal-title"
    >
      <div className="bg-background border border-white/20 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2
            id="event-edit-modal-title"
            className="text-2xl font-bold text-white"
          >
            Edit Event
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
          className="p-6 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 180px)" }}
        >
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  value={editedEvent.title}
                  onChange={(e) =>
                    setEditedEvent({ ...editedEvent, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={editedEvent.description}
                  onChange={(e) =>
                    setEditedEvent({
                      ...editedEvent,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2 flex items-center space-x-2">
                    <MapPin size={16} />
                    <span>Location</span>
                  </label>
                  <input
                    type="text"
                    value={editedEvent.location}
                    onChange={(e) =>
                      setEditedEvent({
                        ...editedEvent,
                        location: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2 flex items-center space-x-2">
                    <Clock size={16} />
                    <span>Duration</span>
                  </label>
                  <input
                    type="text"
                    value={editedEvent.duration}
                    onChange={(e) =>
                      setEditedEvent({
                        ...editedEvent,
                        duration: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-3 flex items-center space-x-2">
                <Zap size={16} />
                <span>Vibe</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {vibeOptions.map((vibe) => (
                  <button
                    key={vibe}
                    onClick={() => setEditedEvent({ ...editedEvent, vibe })}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 text-center hover:scale-105 focus-ring ${
                      editedEvent.vibe === vibe
                        ? "border-primary bg-primary/20 text-white"
                        : "border-white/20 bg-white/5 text-white/80 hover:border-white/40"
                    }`}
                  >
                    <div className="text-xl mb-1">{getVibeEmoji(vibe)}</div>
                    <div className="text-sm capitalize">{vibe}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-3">
                Time Slot
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {timeSlotOptions.map((timeSlot) => (
                  <button
                    key={timeSlot}
                    onClick={() => setEditedEvent({ ...editedEvent, timeSlot })}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 text-center hover:scale-105 focus-ring ${
                      editedEvent.timeSlot === timeSlot
                        ? "border-primary bg-primary/20 text-white"
                        : "border-white/20 bg-white/5 text-white/80 hover:border-white/40"
                    }`}
                  >
                    <div className="text-sm capitalize">
                      {timeSlot?.replace("-", " ") || ""}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-3">
                  Difficulty
                </label>
                <div className="space-y-2">
                  {difficultyOptions.map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() =>
                        setEditedEvent({ ...editedEvent, difficulty })
                      }
                      className={`w-full p-2 rounded-lg border transition-all duration-200 text-left hover:scale-105 focus-ring ${
                        editedEvent.difficulty === difficulty
                          ? "border-primary bg-primary/20 text-white"
                          : "border-white/20 bg-white/5 text-white/80 hover:border-white/40"
                      }`}
                    >
                      <span className="capitalize">{difficulty}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-3">
                  Cost
                </label>
                <div className="space-y-2">
                  {costOptions.map((cost) => (
                    <button
                      key={cost}
                      onClick={() => setEditedEvent({ ...editedEvent, cost })}
                      className={`w-full p-2 rounded-lg border transition-all duration-200 text-left hover:scale-105 focus-ring ${
                        editedEvent.cost === cost
                          ? "border-primary bg-primary/20 text-white"
                          : "border-white/20 bg-white/5 text-white/80 hover:border-white/40"
                      }`}
                    >
                      <span className="capitalize">{cost}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-3 flex items-center space-x-2">
                <Star size={16} />
                <span>Rating</span>
              </label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={editedEvent.rating}
                onChange={(e) =>
                  setEditedEvent({
                    ...editedEvent,
                    rating: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-6 py-3 text-white/70 hover:text-white transition-colors duration-200 focus-ring rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 focus-ring"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventEditModal;
