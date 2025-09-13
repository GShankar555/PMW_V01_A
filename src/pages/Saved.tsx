import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import EventCard from "../components/EventCard";
import EventEditModal from "../components/EventEditModal";
import { useAppContext } from "../context/AppContext";
import { Event } from "../types/Event";

const Saved: React.FC = () => {
  const { savedEvents, updateEvent, showToast } = useAppContext();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const handleEventEdit = (event: Event) => {
    setEditingEvent(event);
  };

  const handleEventSave = (updatedEvent: Event) => {
    updateEvent(updatedEvent.id, updatedEvent);
    showToast(`Updated "${updatedEvent.title}"`);
  };

  return (
    <main className="min-h-screen bg-background pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-2xl">
              <Heart size={32} className="text-white fill-current" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Saved Events
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            {savedEvents.length > 0
              ? `You have ${savedEvents.length} saved event${
                  savedEvents.length !== 1 ? "s" : ""
                } for your perfect weekend`
              : "Start building your collection of amazing weekend activities"}
          </p>
        </div>
        {savedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
            {savedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isDraggable={false}
                setIsDragging={() => {}}
                onEdit={handleEventEdit}
                showEditButton={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto">
              <div className="text-6xl mb-6">💫</div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                No events saved yet
              </h3>
              <p className="text-white/70 mb-8 leading-relaxed">
                Discover amazing weekend activities and save your favorites to
                build the perfect weekend plan.
              </p>
              <Link
                to="/explore"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-220 focus-ring"
              >
                <span>Explore Events</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        )}
      </div>
      {editingEvent && (
        <EventEditModal
          isOpen={!!editingEvent}
          onClose={() => setEditingEvent(null)}
          event={editingEvent}
          onSave={handleEventSave}
        />
      )}
    </main>
  );
};

export default Saved;
