import React from "react";

interface FormCardProps {
    children: React.ReactNode;
    className?: string;
}

export const FormCard: React.FC<FormCardProps> = ({ children, className = "" }) => {
    return (
        <div className={`bg-white p-8 rounded-lg shadow space-y-8 ${className}`}>
            {children}
        </div>
    );
};
