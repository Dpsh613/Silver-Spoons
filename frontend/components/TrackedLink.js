"use client";
import { trackEvent } from "@/lib/axios";

export default function TrackedLink({ type, href, children, className }) {
  const handleClick = () => {
    trackEvent(type); // 'callClicks' or 'mapClicks'
  };

  return (
    <a href={href} onClick={handleClick} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}