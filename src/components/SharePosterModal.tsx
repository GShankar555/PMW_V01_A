import React from "react";
import { X, Download, Copy, Calendar } from "lucide-react";
import { ExtendedWeekendPlan, Event } from "../types/Event";

interface SharePosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekendPlan: ExtendedWeekendPlan;
}

const SharePosterModal: React.FC<SharePosterModalProps> = ({
  isOpen,
  onClose,
  weekendPlan,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [isRendering, setIsRendering] = React.useState(false);
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

  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

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

  const getVibeColor = (vibe: Event["vibe"]) => {
    const colors: Record<string, string> = {
      happy: "#fbbf24",
      relaxed: "#60a5fa",
      energetic: "#f87171",
      adventurous: "#fb923c",
      social: "#a78bfa",
      peaceful: "#34d399",
      chill: "#22d3ee",
      inspiring: "#f472b6",
      fun: "#fb7185",
    };
    return colors[vibe || "happy"] || "#fbbf24";
  };

  const getCostColor = (cost: Event["cost"]) => {
    const colors: Record<string, string> = {
      free: "#22c55e",
      low: "#84cc16",
      medium: "#eab308",
      high: "#f97316",
    };
    return colors[cost || "medium"] || "#eab308";
  };

  const drawEventCard = async (
    ctx: CanvasRenderingContext2D,
    events: Event[] | Event | null,
    x: number,
    y: number,
    width: number,
    title: string,
    accentColor: string
  ) => {
    const eventList = events ? (Array.isArray(events) ? events : [events]) : [];
    const cardHeight =
      eventList.length > 0 ? 100 + eventList.length * 140 : 240;
    drawRoundedRect(ctx, x, y, width, cardHeight, 20);
    const cardGradient = ctx.createLinearGradient(
      x,
      y,
      x + width,
      y + cardHeight
    );
    cardGradient.addColorStop(0, "rgba(255,255,255,0.08)");
    cardGradient.addColorStop(1, "rgba(255,255,255,0.04)");
    ctx.fillStyle = cardGradient;
    ctx.fill();

    ctx.strokeStyle = accentColor + "40";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = accentColor;
    ctx.font =
      "700 24px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
    ctx.fillText(title, x + 24, y + 40);
    ctx.fillStyle = accentColor;
    ctx.fillRect(x + 24, y + 48, 60, 3);

    if (eventList.length > 0) {
      for (let i = 0; i < eventList.length; i++) {
        const event = eventList[i];
        const imgSize = 100;
        const imgX = x + 24;
        const imgY = y + 70 + i * 140;
        try {
          const img = await loadImage(event.image);
          drawRoundedRect(ctx, imgX, imgY, imgSize, imgSize, 16);
          ctx.save();
          ctx.clip();
          ctx.drawImage(img, imgX, imgY, imgSize, imgSize);
          ctx.restore();
          ctx.strokeStyle = "rgba(255,255,255,0.2)";
          ctx.lineWidth = 2;
          ctx.stroke();
        } catch {}

        const textX = x + 140;
        let lineY = imgY + 28;
        ctx.fillStyle = "#ffffff";
        ctx.font =
          "700 20px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
        const titleWidth = ctx.measureText(event.title).width;
        if (titleWidth > width - 160) {
          const truncatedTitle =
            event.title.substring(0, Math.floor((width - 160) / 12)) + "...";
          ctx.fillText(truncatedTitle, textX, lineY);
        } else {
          ctx.fillText(event.title, textX, lineY);
        }

        lineY += 32;
        ctx.fillStyle = accentColor + "20";
        drawRoundedRect(ctx, textX, lineY - 20, 70, 24, 12);
        ctx.fill();
        ctx.fillStyle = accentColor;
        ctx.font =
          "600 12px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
        ctx.fillText(event.category, textX + 8, lineY - 6);
        if (event.vibe) {
          const vibeX = textX + 80;
          ctx.fillStyle = getVibeColor(event.vibe) + "20";
          drawRoundedRect(ctx, vibeX, lineY - 20, 80, 24, 12);
          ctx.fill();
          ctx.fillStyle = getVibeColor(event.vibe);
          ctx.font =
            "600 12px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
          ctx.fillText(
            getVibeEmoji(event.vibe) + " " + event.vibe,
            vibeX + 6,
            lineY - 6
          );
        }

        lineY += 20;
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.font =
          "500 14px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
        const locationText = `📍 ${event.location}`;
        ctx.fillText(locationText, textX, lineY);

        lineY += 20;
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.font =
          "500 14px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
        const durationText = `⏱️ ${event.duration}`;
        ctx.fillText(durationText, textX, lineY);

        lineY += 20;
        ctx.fillStyle = "#fbbf24";
        ctx.font =
          "600 14px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
        const ratingText = `⭐ ${event.rating}`;
        ctx.fillText(ratingText, textX, lineY);

        if (event.cost) {
          const costX = textX + 80;
          ctx.fillStyle = getCostColor(event.cost);
          ctx.font =
            "600 12px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
          const costText = `💰 ${event.cost.toUpperCase()}`;
          ctx.fillText(costText, costX, lineY);
        }

        lineY += 20;
        if (event.timeSlot) {
          ctx.fillStyle = "rgba(255,255,255,0.6)";
          ctx.font =
            "500 12px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
          const timeText = `🕐 ${event.timeSlot.replace("-", " ")}`;
          ctx.fillText(timeText, textX, lineY);
        }

        if (event.difficulty) {
          const difficultyX = textX + 100;
          ctx.fillStyle = "rgba(255,255,255,0.6)";
          ctx.font =
            "500 12px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
          const difficultyText = `🎯 ${event.difficulty}`;
          ctx.fillText(difficultyText, difficultyX, lineY);
        }
      }
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font =
        "600 20px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
      ctx.fillText("No event planned", x + 24, y + 120);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font =
        "500 16px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
      ctx.fillText("Use PlanMyWeekend to plan something fun!", x + 24, y + 150);
    }
  };

  const renderPoster = React.useCallback(async () => {
    if (!canvasRef.current) return;
    setIsRendering(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const theme = weekendPlan.theme;
    const themeAccent = (() => {
      switch (theme) {
        case "lazy":
          return "#a78bfa";
        case "adventurous":
          return "#f97316";
        case "family":
          return "#22c55e";
        case "romantic":
          return "#ec4899";
        case "cultural":
          return "#06b6d4";
        case "active":
          return "#eab308";
        case "social":
          return "#8b5cf6";
        default:
          return "#22d3ee";
      }
    })();

    const days = weekendPlan.isLongWeekend
      ? [
          { key: "friday" as const, label: "Friday" },
          { key: "saturday" as const, label: "Saturday" },
          { key: "sunday" as const, label: "Sunday" },
          { key: "monday" as const, label: "Monday" },
        ]
      : [
          { key: "saturday" as const, label: "Saturday" },
          { key: "sunday" as const, label: "Sunday" },
        ];

    const cardHeights = days.map((d) => {
      const ev = weekendPlan[d.key];
      const count = ev ? (Array.isArray(ev) ? ev.length : 1) : 0;
      return count > 0 ? 100 + count * 140 : 240;
    });

    const paddingBetweenCards = 50;
    const topPadding = 320;
    const bottomPadding = 180;

    const width = 1080;
    const height =
      topPadding +
      cardHeights.reduce((a, b) => a + b, 0) +
      paddingBetweenCards * (cardHeights.length - 1) +
      bottomPadding;

    canvas.width = width;
    canvas.height = height;
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#0a0f1c");
    gradient.addColorStop(0.3, "#0f172a");
    gradient.addColorStop(1, "#1e293b");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    const radial1 = ctx.createRadialGradient(
      width * 0.8,
      height * 0.2,
      50,
      width * 0.8,
      height * 0.2,
      520
    );
    radial1.addColorStop(0, themeAccent + "40");
    radial1.addColorStop(1, "transparent");
    ctx.fillStyle = radial1;
    ctx.fillRect(0, 0, width, height);

    const radial2 = ctx.createRadialGradient(
      width * 0.2,
      height * 0.8,
      100,
      width * 0.2,
      height * 0.8,
      400
    );
    radial2.addColorStop(0, themeAccent + "20");
    radial2.addColorStop(1, "transparent");
    ctx.fillStyle = radial2;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = themeAccent + "10";
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height * 0.3;
      const size = Math.random() * 4 + 2;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    const headerGradient = ctx.createLinearGradient(0, 0, 0, 200);
    headerGradient.addColorStop(0, "rgba(255,255,255,0.05)");
    headerGradient.addColorStop(1, "transparent");
    ctx.fillStyle = headerGradient;
    ctx.fillRect(0, 0, width, 200);
    const titleGradient = ctx.createLinearGradient(72, 100, 72, 160);
    titleGradient.addColorStop(0, "#ffffff");
    titleGradient.addColorStop(1, themeAccent);
    ctx.fillStyle = titleGradient;
    ctx.font =
      "900 64px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
    ctx.fillText("My Weekend Plan", 72, 140);
    const subtitle = `${
      weekendPlan.isLongWeekend ? "Long Weekend • 4 days" : "Weekend • 2 days"
    }${
      theme ? " • Theme: " + theme.charAt(0).toUpperCase() + theme.slice(1) : ""
    }`;
    ctx.fillStyle = themeAccent;
    ctx.font =
      "700 24px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
    ctx.fillText(subtitle, 72, 180);
    ctx.fillStyle = themeAccent;
    ctx.fillRect(72, 190, 200, 4);
    ctx.fillStyle = themeAccent + "30";
    ctx.font = "48px Inter";
    ctx.fillText("🗓️", width - 120, 100);
    ctx.fillText("✨", width - 120, 160);

    const cardWidth = width - 72 * 2;
    const startX = 72;
    let currentY = topPadding;

    for (let i = 0; i < days.length; i++) {
      const d = days[i];
      await drawEventCard(
        ctx,
        weekendPlan[d.key] || null,
        startX,
        currentY,
        cardWidth,
        d.label,
        themeAccent
      );
      currentY += cardHeights[i] + paddingBetweenCards;
    }

    const footerGradient = ctx.createLinearGradient(0, height - 100, 0, height);
    footerGradient.addColorStop(0, "transparent");
    footerGradient.addColorStop(1, "rgba(255,255,255,0.05)");
    ctx.fillStyle = footerGradient;
    ctx.fillRect(0, height - 100, width, 100);

    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font =
      "600 20px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
    ctx.fillText("Share your plan and invite friends!", 72, height - 60);

    ctx.fillStyle = themeAccent;
    ctx.font =
      "700 16px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
    ctx.fillText("Created with PlanMyWeekend", 72, height - 30);

    ctx.fillStyle = themeAccent + "20";
    ctx.font = "24px Inter";
    ctx.fillText("🎉", width - 100, height - 50);
    ctx.fillText("🌟", width - 60, height - 30);

    setIsRendering(false);
  }, [weekendPlan]);

  React.useEffect(() => {
    if (isOpen) {
      renderPoster();
    }
  }, [isOpen, renderPoster]);

  const handleDownloadPng = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "PlanMyWeekend-plan.png";
    a.click();
  };

  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (!blob) return;
      await navigator.clipboard.write([
        new (window as any).ClipboardItem({ "image/png": blob }),
      ]);
    } catch {}
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto flex justify-center p-1"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-poster-modal-title"
    >
      <div
        className="bg-background border border-white/20 rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-hidden"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Calendar size={22} className="text-primary" />
            <h2
              id="share-poster-modal-title"
              className="text-2xl font-bold text-white"
            >
              Share Weekend Plan
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors duration-200 focus-ring rounded-full p-2"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div
          className="p-4 space-y-4 overflow-y-auto"
          style={{ maxHeight: "calc(95vh - 120px)" }}
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 overflow-auto max-h-96">
            <div className="w-full flex justify-center">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto"
                style={{ width: "min(100%, 900px)", height: "auto" }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-white/60 text-sm">
              {isRendering ? "Rendering poster…" : "Poster ready to share"}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyImage}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 focus-ring flex items-center space-x-2"
              >
                <Copy size={16} />
                <span>Copy Image</span>
              </button>
              <button
                onClick={handleDownloadPng}
                className="bg-gradient-to-r from-secondary to-primary text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 focus-ring flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Download PNG</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePosterModal;
