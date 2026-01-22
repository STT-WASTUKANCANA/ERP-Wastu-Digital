import React, { useState } from 'react';

interface TooltipProps {
    children: React.ReactNode;
    content: React.ReactNode;
    className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content, className = '' }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className={`relative inline-block ${className}`}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-white text-foreground text-xs rounded-md shadow-lg border border-secondary/20 p-2">
                    {content}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white drop-shadow-sm"></div>
                </div>
            )}
        </div>
    );
};
