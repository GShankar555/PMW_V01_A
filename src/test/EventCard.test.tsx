import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import EventCard from "../components/EventCard";
import { AppProvider } from "../context/AppContext";
import { Event } from "../types/Event";

const mockEvent: Event = {
  id: "1",
  title: "Test Event",
  description: "A test event for unit testing",
  location: "Test Location",
  duration: "2 hours",
  rating: 4.5,
  image: "https://example.com/image.jpg",
  category: "Test",
  vibe: "happy",
  timeSlot: "afternoon",
  difficulty: "easy",
  cost: "free",
};

const renderWithProvider = (component: React.ReactElement) => {
  return render(<AppProvider>{component}</AppProvider>);
};

describe("EventCard", () => {
  it("renders event information correctly", () => {
    renderWithProvider(
      <EventCard
        event={mockEvent}
        isDraggable={false}
        setIsDragging={() => {}}
      />
    );

    expect(screen.getByText("Test Event")).toBeInTheDocument();
    expect(
      screen.getByText("A test event for unit testing")
    ).toBeInTheDocument();
    expect(screen.getByText("Test Location")).toBeInTheDocument();
    expect(screen.getByText("2 hours")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  it("displays vibe and time slot information", () => {
    renderWithProvider(
      <EventCard
        event={mockEvent}
        isDraggable={false}
        setIsDragging={() => {}}
      />
    );

    expect(screen.getByText("happy")).toBeInTheDocument();
    expect(screen.getByText("afternoon")).toBeInTheDocument();
    expect(screen.getByText("easy")).toBeInTheDocument();
    expect(screen.getByText("free")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    const mockOnEdit = vi.fn();

    renderWithProvider(
      <EventCard
        event={mockEvent}
        isDraggable={false}
        setIsDragging={() => {}}
        onEdit={mockOnEdit}
        showEditButton={true}
      />
    );

    const editButton = screen.getByLabelText("Edit event");
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockEvent);
  });

  it("handles save/unsave functionality", () => {
    renderWithProvider(
      <EventCard
        event={mockEvent}
        isDraggable={false}
        setIsDragging={() => {}}
      />
    );

    const saveButton = screen.getByText("Save Event");
    fireEvent.click(saveButton);
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });

  it("handles favorite/unfavorite functionality", () => {
    renderWithProvider(
      <EventCard
        event={mockEvent}
        isDraggable={false}
        setIsDragging={() => {}}
      />
    );

    const favoriteButton = screen.getByLabelText("Add to favorites");
    fireEvent.click(favoriteButton);
    expect(screen.getByLabelText("Remove from favorites")).toBeInTheDocument();
  });

  it("renders with performance optimization for large datasets", () => {
    const events = Array.from({ length: 50 }, (_, i) => ({
      ...mockEvent,
      id: `event-${i}`,
      title: `Event ${i}`,
    }));

    const startTime = performance.now();

    events.forEach((event) => {
      const { unmount } = renderWithProvider(
        <EventCard event={event} isDraggable={false} setIsDragging={() => {}} />
      );
      unmount();
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;
    expect(renderTime).toBeLessThan(1000);
  });
});
