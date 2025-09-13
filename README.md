# PlanMyWeekend

PlanMyWeekend is a modern React-based web application that transforms how users plan, organize, and share their weekends. It reimagines weekend planning with an engaging interface, drag-and-drop scheduling, theme personalization, and creative social sharing options.

---

## 🚀 Project Overview

PlanMyWeekend provides a fun and interactive way to design personalized weekends. Users can browse activities, schedule them into Saturday–Sunday (or long weekends), and view plans in multiple layouts — including cards, timeline, and calendar views. The app emphasizes accessibility, responsiveness, and performance while ensuring the planning experience feels intuitive and enjoyable.

---

## 🎨 Features

### Core Functionality

* Browse and select activities from a curated set.
* Add/remove activities to a weekend schedule.
* View weekend plans in card, timeline, or calendar format.
* Edit plans with intuitive UI controls.

* **Drag-and-Drop Planning** – rearrange activities visually.
* **Themes** – choose from lazy, adventurous, family, romantic, cultural, active, or social.
* **Dynamic Poster Generation** – export a styled weekend poster for sharing.
* **Search & Filters** – real-time, multi-field search across activities.
* **Long Weekend Support** – extend plans beyond 2 days.
* **Persistence** – weekend plans auto-save in localStorage.
* **Performance** – optimized rendering and search (50+ activities handled smoothly).
* **Offline-Friendly** – core functionality remains available offline.
* **Reusable Component Architecture** – modular structure with clear TypeScript interfaces.

---

## ⚙️ Tech Stack

* **Frontend**: React + TypeScript + Vite
* **Styling**: Tailwind CSS (responsive, mobile-first)
* **State Management**: React Context API with localStorage persistence
* **Poster Generation**: HTML5 Canvas API

---

## 🛠️ Key Engineering Decisions

* **React Context API** for lightweight but centralized state management.
* **LocalStorage Persistence** for offline-friendly plans without backend overhead.
* **Custom Drag-and-Drop** for fine-grained control and touch support.
* **Accessibility First**: ARIA labels, keyboard navigation, semantic HTML.
* **Performance**: memoization, lazy loading, and virtualized rendering patterns.

---

## 🧩 Component Design

* **Reusable UI Components**: event cards, modals, drag handles, and planner views.
* **PlannerModal**: configurable for different interaction modes.
* **Typed Props**: strict TypeScript interfaces ensure robustness and developer experience.

---
