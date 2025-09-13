import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AppProvider, useAppContext } from "../context/AppContext";
import { Event } from "../types/Event";

const mockEvent: Event = {
  id: "test-1",
  title: "Test Event",
  description: "Test Description",
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

// Test component to interact with context
const TestComponent = () => {
  const {
    savedEvents,
    weekendPlan,
    toggleSaveEvent,
    addToWeekendPlan,
    removeFromWeekendPlan,
    setWeekendTheme,
    toggleLongWeekend,
    isEventSaved,
  } = useAppContext();

  return (
    <div>
      <div data-testid="saved-count">{savedEvents.length}</div>
      <div data-testid="is-long-weekend">
        {weekendPlan.isLongWeekend.toString()}
      </div>
      <div data-testid="theme">{weekendPlan.theme || "none"}</div>
      <div data-testid="is-saved">{isEventSaved(mockEvent.id).toString()}</div>

      <button onClick={() => toggleSaveEvent(mockEvent)}>Toggle Save</button>
      <button onClick={() => addToWeekendPlan(mockEvent, "saturday")}>
        Add to Saturday
      </button>
      <button onClick={() => removeFromWeekendPlan("saturday")}>
        Remove Saturday
      </button>
      <button onClick={() => setWeekendTheme("adventurous")}>
        Set Adventurous Theme
      </button>
      <button onClick={() => toggleLongWeekend()}>Toggle Long Weekend</button>
    </div>
  );
};

describe("AppContext", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it("initializes with default values", () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId("saved-count")).toHaveTextContent("0");
    expect(screen.getByTestId("is-long-weekend")).toHaveTextContent("false");
    expect(screen.getByTestId("theme")).toHaveTextContent("none");
    expect(screen.getByTestId("is-saved")).toHaveTextContent("false");
  });

  it("handles saving and unsaving events", () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const toggleButton = screen.getByText("Toggle Save");

    // Save event
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("saved-count")).toHaveTextContent("1");
    expect(screen.getByTestId("is-saved")).toHaveTextContent("true");

    // Unsave event
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("saved-count")).toHaveTextContent("0");
    expect(screen.getByTestId("is-saved")).toHaveTextContent("false");
  });

  it("handles weekend plan operations", () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const addButton = screen.getByText("Add to Saturday");
    const removeButton = screen.getByText("Remove Saturday");
    fireEvent.click(addButton);
    fireEvent.click(removeButton);
  });

  it("handles theme changes", () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const themeButton = screen.getByText("Set Adventurous Theme");
    fireEvent.click(themeButton);

    expect(screen.getByTestId("theme")).toHaveTextContent("adventurous");
  });

  it("handles long weekend toggle", () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const toggleButton = screen.getByText("Toggle Long Weekend");
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("is-long-weekend")).toHaveTextContent("true");
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("is-long-weekend")).toHaveTextContent("false");
  });

  it("persists data to localStorage", () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const toggleButton = screen.getByText("Toggle Save");
    fireEvent.click(toggleButton);
    const savedData = localStorage.getItem("PlanMyWeekend-saved");
    expect(savedData).toBeTruthy();

    const parsedData = JSON.parse(savedData!);
    expect(parsedData).toHaveLength(1);
    expect(parsedData[0].id).toBe(mockEvent.id);
  });

  it("handles performance with large datasets", () => {
    const startTime = performance.now();

    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );
    const toggleButton = screen.getByText("Toggle Save");
    for (let i = 0; i < 50; i++) {
      fireEvent.click(toggleButton);
      fireEvent.click(toggleButton);
    }

    const endTime = performance.now();
    const operationTime = endTime - startTime;
    expect(operationTime).toBeLessThan(1000);
  });
});
