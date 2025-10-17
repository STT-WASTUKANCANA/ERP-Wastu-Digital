import { CSSProperties, MouseEventHandler, ReactNode } from "react";
import { IncomingMail } from "./mail-props";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  width?: string;
  className?: string;
  border?: string;
}
export interface ButtonProps {
  route?: string;
  children: ReactNode;
  size?: string;
  color?: string;
  className?: string;
  rounded?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
}
export interface PatternLogoProps {
  className?: string;
  style?: CSSProperties;
}
export type DropdownProps = {
  position: string;
  padding?: string;
  shadow?: string;
  backgroundColor?: string;
  textColor?: string;
  size?: string;
  border?: string;
  children?: React.ReactNode;
};
export type NotificationDropdownProps = {
  notificationDropdownShow: boolean;
  setNotificationDropdownShow: React.Dispatch<React.SetStateAction<boolean>>;
}
export type TopbarProps = {
  scroll: number;
  sidebarShow: boolean;
  setSidebarShow: React.Dispatch<React.SetStateAction<boolean>>;
  profileDropdownShow: boolean;
  setProfileDropdownShow: React.Dispatch<React.SetStateAction<boolean>>;
  notificationDropdownShow: boolean;
  setNotificationDropdownShow: React.Dispatch<React.SetStateAction<boolean>>;
};
export interface SidebarProps {
  sidebarShow: boolean;
  setSidebarShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export type CardProps = {
  title: string
  value: string | number
  percent?: number
  icon: React.ElementType
}

export interface ColumnDef<T> {
  id?: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  emptyStateMessage?: string;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
}
