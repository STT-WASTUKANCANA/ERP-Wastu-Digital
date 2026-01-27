interface DropdownProps {
  children: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  size?: string;
  position?: string;
  shadow?: string;
  zIndex?: string;
}

import React from "react";

export const Dropdown: React.FC<DropdownProps> = ({
  children,
  backgroundColor = "bg-white",
  textColor = "text-secondary",
  padding = "p-4",
  size = "min-w-max",
  position = "top-14 right-0",
  shadow = "shadow-lg",
  zIndex = "z-50"
}) => {
  return (
    <div
      className={`absolute ${position} ${size} ${backgroundColor} ${textColor} ${padding} rounded-md ${shadow} border border-secondary/20 ${zIndex} transition-all duration-200`}
    >
      {children}
    </div>
  );
};
