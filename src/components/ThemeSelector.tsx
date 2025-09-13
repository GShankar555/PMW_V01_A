import React from "react";
import { Sparkles } from "lucide-react";
import { ExtendedWeekendPlan } from "../types/Event";
import { planTemplates } from "../data/holidays";

interface ThemeSelectorProps {
  selectedTheme: ExtendedWeekendPlan["theme"];
  onThemeChange: (theme: ExtendedWeekendPlan["theme"]) => void;
  className?: string;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onThemeChange,
  className = "",
}) => {
  return (
    <div
      className={`bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 ${className}`}
    >
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-white">Weekend Theme</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {planTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onThemeChange(template.theme)}
            className={`p-3 rounded-xl border-2 transition-all duration-200 text-left hover:scale-105 focus-ring ${
              selectedTheme === template.theme
                ? "border-primary bg-primary/20 text-white"
                : "border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:bg-white/10"
            }`}
          >
            <div className="text-2xl mb-2">{template.icon}</div>
            <div className="font-medium text-sm mb-1">{template.name}</div>
            <div className="text-xs opacity-70 line-clamp-2">
              {template.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
