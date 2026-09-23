import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  className = '',
  ariaLabel = 'Go back to previous page',
  label
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      title="Go back"
      className={`h-9 px-2.5 rounded-lg border border-white/10 bg-[#141724] text-slate-300 hover:text-white hover:bg-[#1E2336] hover:border-white/20 flex items-center gap-2 transition-all text-xs font-medium cursor-pointer shrink-0 ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      {label && <span>{label}</span>}
    </button>
  );
};
