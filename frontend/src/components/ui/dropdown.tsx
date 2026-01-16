import { DropdownProps } from "@/types/shared/ui";
import React from "react";

export const Dropdown: React.FC<DropdownProps> = ({
  position,
  padding = "p-4",
  shadow,
  backgroundColor,
  textColor,
  size = "min-w-[225px]",
  border = '',
  children,
}) => {
  return (
    <div
      className={`absolute ${position} ${backgroundColor} ${textColor} ${padding} ${shadow} ${size} ${border} rounded-lg`}
    >
      {children ?? "Dropdown Content Tidak Tersedia"}
    </div>
  );
};
