export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  duration: string;
  rating: number;
  image: string;
  category: string;
  isFavorited?: boolean;
  vibe?:
    | "happy"
    | "relaxed"
    | "energetic"
    | "adventurous"
    | "social"
    | "peaceful"
    | "chill"
    | "inspiring"
    | "fun"
    | "educational";
  timeSlot?: "morning" | "afternoon" | "evening" | "all-day";
  difficulty?: "easy" | "moderate" | "challenging";
  cost?: "free" | "low" | "medium" | "high";
}

export interface WeekendPlan {
  saturday: Event[] | Event | null;
  sunday: Event[] | Event | null;
  friday?: Event[] | Event | null;
  monday?: Event[] | Event | null;
}

export interface ExtendedWeekendPlan extends WeekendPlan {
  theme?:
    | "lazy"
    | "adventurous"
    | "family"
    | "romantic"
    | "cultural"
    | "active"
    | "social";
  isLongWeekend: boolean;
  startDate?: Date;
  endDate?: Date;
  id?: string;
  name?: string;
  savedAt?: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: Date;
  isLongWeekend: boolean;
  daysOff: number;
  description: string;
}

export interface PlanTemplate {
  id: string;
  name: string;
  theme: ExtendedWeekendPlan["theme"];
  description: string;
  suggestedActivities: string[];
  icon: string;
}
