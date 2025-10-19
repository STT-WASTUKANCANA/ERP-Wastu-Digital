import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode; 
}

export const PageHeader = ({ title, description, children }: PageHeaderProps) => {
  return (
    <div className="lg:flex lg:justify-between lg:items-center lg:gap-4 mb-6">
      <div className="flex justify-center lg:justify-start w-full">
        <div className="text-center lg:text-start space-y-4 lg:space-y-2 w-full lg:max-w-[1200px]">
          <h3 className="font-semibold text-lg">{title}</h3>
          <span className="text-secondary mb-0">{description}</span>
        </div>
      </div>
      {children && (
        <div className="flex justify-center mt-4 lg:mt-0">
          <div className="flex gap-2">{children}</div>
        </div>
      )}
    </div>
  );
};