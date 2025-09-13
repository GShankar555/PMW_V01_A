import React from "react";
import { MapPin, Clock, Star, Heart, Bookmark, Edit3 } from "lucide-react";
import { Event } from "../types/Event";
import { useAppContext } from "../context/AppContext";

interface EventCardProps {
  event: Event;
  isDraggable: boolean;
  setIsDragging: (dragging: boolean) => void;
  onEdit?: (event: Event) => void;
  showEditButton?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  isDraggable = false,
  setIsDragging,
  onEdit,
  showEditButton = false,
}) => {
  const {
    toggleSaveEvent,
    toggleFavoriteEvent,
    isEventSaved,
    isEventFavorited,
  } = useAppContext();
  const isSaved = isEventSaved(event.id);
  const isFavorited = isEventFavorited(event.id);

  const handleSaveClick = (e: React.MouseEvent) => {
    setIsDragging(false);
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    toggleSaveEvent(event);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    setIsDragging(false);
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    toggleFavoriteEvent(event);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    setIsDragging(false);
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    onEdit?.(event);
  };

  const getVibeColor = (vibe: Event["vibe"]) => {
    const colors: Record<string, string> = {
      happy: "bg-yellow-400/20 text-yellow-300",
      relaxed: "bg-blue-400/20 text-blue-300",
      energetic: "bg-red-400/20 text-red-300",
      adventurous: "bg-orange-400/20 text-orange-300",
      social: "bg-purple-400/20 text-purple-300",
      peaceful: "bg-green-400/20 text-green-300",
      chill: "bg-cyan-400/20 text-cyan-300",
      inspiring: "bg-pink-400/20 text-pink-300",
      fun: "bg-rose-400/20 text-rose-300",
    };
    return colors[vibe || "happy"] || "bg-yellow-400/20 text-yellow-300";
  };

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
    };
    return emojis[vibe || "happy"] || "😊";
  };

  return (
    <article
      className={`group bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-220 border border-white/10 hover:border-primary/50 ${
        isDraggable ? "cursor-grab active:cursor-grabbing" : ""
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
            {event.category}
          </span>
        </div>

        <div className="absolute top-4 right-4 flex space-x-2">
          {showEditButton && onEdit && (
            <button
              onClick={handleEditClick}
              className="p-2 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm transition-all duration-150 focus-ring hover:scale-110"
              aria-label="Edit event"
            >
              <Edit3 size={16} />
            </button>
          )}

          <button
            onClick={handleFavoriteClick}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-150 focus-ring ${
              isFavorited
                ? "bg-red-500/90 text-white hover:bg-red-500"
                : "bg-black/20 text-white hover:bg-black/40"
            } hover:scale-110`}
            aria-label={
              isFavorited ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart size={16} className={isFavorited ? "fill-current" : ""} />
          </button>

          <button
            onClick={handleSaveClick}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-150 focus-ring ${
              isSaved
                ? "bg-highlight/90 text-background hover:bg-highlight"
                : "bg-black/20 text-white hover:bg-black/40"
            } hover:scale-110`}
            aria-label={isSaved ? "Remove from saved" : "Save event"}
          >
            <Bookmark size={16} className={isSaved ? "fill-current" : ""} />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-highlight transition-colors duration-220">
            {event.title}
          </h3>
          <div className="flex items-center space-x-2">
            {event.vibe && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getVibeColor(
                  event.vibe
                )}`}
              >
                <span>{getVibeEmoji(event.vibe)}</span>
                <span className="capitalize">{event.vibe}</span>
              </span>
            )}
            {event.timeSlot && (
              <span className="bg-white/10 text-white/70 px-2 py-1 rounded-full text-xs">
                {event.timeSlot.replace("-", " ")}
              </span>
            )}
          </div>
        </div>

        <p className="text-white/70 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-white/70 text-sm">
            <MapPin size={14} className="mr-2 flex-shrink-0" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center text-white/70 text-sm">
            <Clock size={14} className="mr-2 flex-shrink-0" />
            <span>{event.duration}</span>
            {event.difficulty && (
              <>
                <span className="mx-2">•</span>
                <span className="capitalize">{event.difficulty}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Star size={16} className="text-highlight fill-current" />
              <span className="text-white font-medium">{event.rating}</span>
            </div>
            {event.cost && (
              <span className="bg-white/10 text-white/70 px-2 py-1 rounded-lg text-xs capitalize">
                {event.cost}
              </span>
            )}
          </div>

          <button
            onClick={handleSaveClick}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className={`px-2 py-2 rounded-xl font-medium transition-all duration-150 focus-ring text-sm hover:shadow-lg hover:scale-105 ${
              isSaved
                ? "bg-highlight text-background hover:bg-highlight/90"
                : "bg-gradient-to-r from-primary to-secondary text-white"
            }`}
          >
            {isSaved ? "Saved" : "Save Event"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default EventCard;
