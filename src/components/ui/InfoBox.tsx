import type { ReactNode } from 'react';

interface InfoBoxProps {
  title: string;
  children: ReactNode;
  icon?: string;
}

export function InfoBox({ title, children, icon = 'ℹ️' }: InfoBoxProps) {
  return (
    <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h3 className="mt-0 mb-2 font-semibold">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}
