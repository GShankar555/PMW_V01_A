import React, { createContext, useContext, useState, ReactNode } from "react";
import { Event, ExtendedWeekendPlan } from "../types/Event";

interface AppContextType {
  savedEvents: Event[];
  favoritedEvents: Event[];
  weekendPlan: ExtendedWeekendPlan;
  savedWeekendPlans: ExtendedWeekendPlan[];
  toggleSaveEvent: (event: Event) => void;
  toggleFavoriteEvent: (event: Event) => void;
  addToWeekendPlan: (event: Event, day: keyof ExtendedWeekendPlan) => void;
  removeFromWeekendPlan: (day: keyof ExtendedWeekendPlan) => void;
  removeEventFromWeekendPlan: (
    day: keyof ExtendedWeekendPlan,
    eventId: string
  ) => void;
  updateEvent: (eventId: string, updatedEvent: Event) => void;
  setWeekendTheme: (theme: ExtendedWeekendPlan["theme"]) => void;
  toggleLongWeekend: () => void;
  isEventSaved: (eventId: string) => boolean;
  isEventFavorited: (eventId: string) => boolean;
  saveWeekendPlan: (planName: string) => void;
  loadWeekendPlan: (planId: string) => void;
  deleteWeekendPlan: (planId: string) => void;
  showToast: (message: string) => void;
  hideToast: () => void;
  toastMessage: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [savedEvents, setSavedEvents] = useState<Event[]>(() => {
    const savedData = localStorage.getItem("PlanMyWeekend-saved");
    return savedData ? JSON.parse(savedData) : [];
  });

  const [favoritedEvents, setFavoritedEvents] = useState<Event[]>(() => {
    const favoritedData = localStorage.getItem("PlanMyWeekend-favorited");
    return favoritedData ? JSON.parse(favoritedData) : [];
  });

  const [weekendPlan, setWeekendPlan] = useState<ExtendedWeekendPlan>(() => {
    const planData = localStorage.getItem("PlanMyWeekend-plan");
    return planData
      ? JSON.parse(planData)
      : {
          saturday: null,
          sunday: null,
          friday: null,
          monday: null,
          isLongWeekend: false,
          theme: undefined,
        };
  });

  const [savedWeekendPlans, setSavedWeekendPlans] = useState<
    ExtendedWeekendPlan[]
  >(() => {
    const plansData = localStorage.getItem("PlanMyWeekend-saved-plans");
    return plansData ? JSON.parse(plansData) : [];
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  React.useEffect(() => {
    const savedData = localStorage.getItem("PlanMyWeekend-saved");
    const favoritedData = localStorage.getItem("PlanMyWeekend-favorited");
    const planData = localStorage.getItem("PlanMyWeekend-plan");
    const plansData = localStorage.getItem("PlanMyWeekend-saved-plans");

    if (savedData) {
      setSavedEvents(JSON.parse(savedData));
    }
    if (favoritedData) {
      setFavoritedEvents(JSON.parse(favoritedData));
    }
    if (planData) {
      setWeekendPlan(JSON.parse(planData));
    }
    if (plansData) {
      setSavedWeekendPlans(JSON.parse(plansData));
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem("PlanMyWeekend-saved", JSON.stringify(savedEvents));
  }, [savedEvents]);

  React.useEffect(() => {
    localStorage.setItem(
      "PlanMyWeekend-favorited",
      JSON.stringify(favoritedEvents)
    );
  }, [favoritedEvents]);

  React.useEffect(() => {
    localStorage.setItem("PlanMyWeekend-plan", JSON.stringify(weekendPlan));
  }, [weekendPlan]);

  React.useEffect(() => {
    localStorage.setItem(
      "PlanMyWeekend-saved-plans",
      JSON.stringify(savedWeekendPlans)
    );
  }, [savedWeekendPlans]);

  const toggleSaveEvent = (event: Event) => {
    setSavedEvents((prev) => {
      const isAlreadySaved = prev.some(
        (savedEvent) => savedEvent.id === event.id
      );
      if (isAlreadySaved) {
        return prev.filter((savedEvent) => savedEvent.id !== event.id);
      } else {
        return [...prev, event];
      }
    });
  };

  const toggleFavoriteEvent = (event: Event) => {
    setFavoritedEvents((prev) => {
      const isAlreadyFavorited = prev.some(
        (favEvent) => favEvent.id === event.id
      );
      if (isAlreadyFavorited) {
        return prev.filter((favEvent) => favEvent.id !== event.id);
      } else {
        return [...prev, event];
      }
    });
  };

  const addToWeekendPlan = (event: Event, day: keyof ExtendedWeekendPlan) => {
    if (
      day === "theme" ||
      day === "isLongWeekend" ||
      day === "startDate" ||
      day === "endDate"
    )
      return;

    setWeekendPlan((prev) => ({
      ...prev,
      [day]: prev[day]
        ? [
            ...(Array.isArray(prev[day])
              ? (prev[day] as Event[])
              : [prev[day] as Event]),
            event,
          ]
        : [event],
    }));
  };

  const removeFromWeekendPlan = (day: keyof ExtendedWeekendPlan) => {
    if (
      day === "theme" ||
      day === "isLongWeekend" ||
      day === "startDate" ||
      day === "endDate"
    )
      return;

    setWeekendPlan((prev) => ({
      ...prev,
      [day]: null,
    }));
  };

  const removeEventFromWeekendPlan = (
    day: keyof ExtendedWeekendPlan,
    eventId: string
  ) => {
    if (
      day === "theme" ||
      day === "isLongWeekend" ||
      day === "startDate" ||
      day === "endDate"
    )
      return;

    setWeekendPlan((prev) => {
      const currentEvents = prev[day];
      if (!currentEvents) return prev;

      if (Array.isArray(currentEvents)) {
        const filteredEvents = currentEvents.filter((e) => e.id !== eventId);
        return {
          ...prev,
          [day]: filteredEvents.length > 0 ? filteredEvents : null,
        };
      } else if (
        typeof currentEvents === "object" &&
        currentEvents.id === eventId
      ) {
        return {
          ...prev,
          [day]: null,
        };
      }

      return prev;
    });
  };

  const updateEvent = (eventId: string, updatedEvent: Event) => {
    setSavedEvents((prev) =>
      prev.map((event) => (event.id === eventId ? updatedEvent : event))
    );

    setFavoritedEvents((prev) =>
      prev.map((event) => (event.id === eventId ? updatedEvent : event))
    );

    setWeekendPlan((prev) => {
      const updated = { ...prev };
      (["friday", "saturday", "sunday", "monday"] as const).forEach((day) => {
        const events = updated[day];
        if (events) {
          if (Array.isArray(events)) {
            updated[day] = events.map((event) =>
              event.id === eventId ? updatedEvent : event
            ) as any;
          } else if (typeof events === "object" && events.id === eventId) {
            updated[day] = updatedEvent as any;
          }
        }
      });
      return updated;
    });
  };

  const setWeekendTheme = (theme: ExtendedWeekendPlan["theme"]) => {
    setWeekendPlan((prev) => ({ ...prev, theme }));
  };

  const toggleLongWeekend = () => {
    setWeekendPlan((prev) => ({
      ...prev,
      isLongWeekend: !prev.isLongWeekend,
      ...(prev.isLongWeekend ? { friday: null, monday: null } : {}),
    }));
  };

  const isEventSaved = (eventId: string) => {
    return savedEvents.some((event) => event.id === eventId);
  };

  const isEventFavorited = (eventId: string) => {
    return favoritedEvents.some((event) => event.id === eventId);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const saveWeekendPlan = (planName: string) => {
    const planToSave = {
      ...weekendPlan,
      id: Date.now().toString(),
      name: planName,
      savedAt: new Date().toISOString(),
    };
    setSavedWeekendPlans((prev) => [...prev, planToSave]);
    showToast(`Weekend plan "${planName}" saved!`);
  };

  const loadWeekendPlan = (planId: string) => {
    const plan = savedWeekendPlans.find((p) => p.id === planId);
    if (plan) {
      setWeekendPlan(plan);
      showToast(`Loaded "${plan.name || "Weekend plan"}"`);
    }
  };

  const deleteWeekendPlan = (planId: string) => {
    setSavedWeekendPlans((prev) => prev.filter((p) => p.id !== planId));
    showToast("Weekend plan deleted");
  };

  const hideToast = () => {
    setToastMessage(null);
  };

  return (
    <AppContext.Provider
      value={{
        savedEvents,
        favoritedEvents,
        weekendPlan,
        savedWeekendPlans,
        toggleSaveEvent,
        toggleFavoriteEvent,
        addToWeekendPlan,
        removeFromWeekendPlan,
        removeEventFromWeekendPlan,
        updateEvent,
        setWeekendTheme,
        toggleLongWeekend,
        isEventSaved,
        isEventFavorited,
        saveWeekendPlan,
        loadWeekendPlan,
        deleteWeekendPlan,
        showToast,
        hideToast,
        toastMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
