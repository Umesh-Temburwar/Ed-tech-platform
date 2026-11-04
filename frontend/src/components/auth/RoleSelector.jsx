import React from "react";
import { FaGraduationCap, FaChalkboardTeacher, FaCheck } from "react-icons/fa";

const ROLES = [
  {
    id: "Student",
    label: "Student",
    subtitle: "Access courses & learning paths",
    icon: FaGraduationCap,
    badge: "Learner",
    features: ["Access all courses", "Track progress", "Earn certificates"],
  },
  {
    id: "Instructor",
    label: "Instructor",
    subtitle: "Teach students & manage courses",
    icon: FaChalkboardTeacher,
    badge: "Educator",
    features: ["Create courses", "Manage students", "View analytics"],
  },
];

const RoleSelector = ({ selectedRole, onSelect, disabled }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {ROLES.map((role) => {
        const isSelected = selectedRole === role.id;
        const IconComponent = role.icon;

        return (
          <button
            key={role.id}
            type="button"
            onClick={() => !disabled && onSelect(role.id)}
            disabled={disabled}
            className={`
              relative text-left p-4 rounded-lg border transition-all
              ${isSelected
                ? "bg-surface border-accent ring-2 ring-accent/20 shadow-sm"
                : "bg-surface-2 border-border hover:border-muted"
              }
              ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              focus:outline-none
            `}
            aria-pressed={isSelected}
            aria-label={`Select ${role.label} role`}
          >
            {/* Top row: badge & check */}
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                isSelected
                  ? "bg-accent/10 text-accent border-accent/20"
                  : "bg-surface text-muted border-border"
              }`}>
                {role.badge}
              </span>
              {isSelected && (
                <div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center text-white text-[9px]">
                  <FaCheck />
                </div>
              )}
            </div>

            {/* Icon + title */}
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className={`w-8 h-8 rounded-md flex items-center justify-center border ${
                isSelected
                  ? "bg-accent/10 border-accent/30 text-accent"
                  : "bg-surface border-border text-muted"
              }`}>
                <IconComponent className="text-sm" />
              </div>
              <div>
                <h3 className="font-semibold text-text text-sm leading-tight">{role.label}</h3>
                <p className="text-muted text-[11px] leading-tight">{role.subtitle}</p>
              </div>
            </div>

            {/* Feature list */}
            <ul className="space-y-1 pt-1 border-t border-border/50">
              {role.features.map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-[11px] text-muted">
                  <span className={`w-1 h-1 rounded-full ${isSelected ? "bg-accent" : "bg-muted"}`} />
                  {f}
                </li>
              ))}
            </ul>
          </button>
        );
      })}
    </div>
  );
};

export default RoleSelector;
