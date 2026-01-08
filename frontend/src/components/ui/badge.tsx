"use client";

import React from "react";

type BadgeProps = {
  value: number | string;
  map: Record<number | string, { label: string; color: string }>;
  className?: string;
};

export const Badge: React.FC<BadgeProps> = ({ value, map, className = "" }) => {
  const info = map[value] || { label: "Unknown", color: "bg-gray-100 text-gray-800" };
  return (
    <span className={`px-2 py-1 rounded-sm text-xs font-semibold ${info.color} ${className}`}>
      {info.label === "Unknown" ? `Unknown (${value})` : info.label}
    </span>
  );
};
