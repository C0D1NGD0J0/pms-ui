import React from "react";

interface DotPulseProps {
  className?: string;
}

export const DotPulse: React.FC<DotPulseProps> = ({ className = "" }) => {
  return <span className={`dot_pulse ${className}`.trim()} />;
};
