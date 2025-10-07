import { DropdownProps } from "@/types/ui-props";
import React from "react";

export const Dropdown: React.FC<DropdownProps> = ({
  position,
  padding = "p-4",
  shadow,
  backgroundColor,
  textColor,
  size = "min-w-[225px]",
  children,
}) => {
  return (
    <div
      className={`fixed ${position} ${backgroundColor} ${textColor} ${padding} ${shadow} ${size} rounded-lg`}
    >
      {children ?? "Dropdown Content Tidak Tersedia"}
    </div>
  );
};
