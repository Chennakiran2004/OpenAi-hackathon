import React from "react";

export default function DocuChatDonutIcon({
  className = "",
}: {
  className?: string;
}) {
  // Simple "donut" glyph to visually match DocuChat-style launcher.
  // Kept generic (no external assets) and works well at small sizes.
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2.75c5.109 0 9.25 4.141 9.25 9.25s-4.141 9.25-9.25 9.25-9.25-4.141-9.25-9.25S6.891 2.75 12 2.75Z"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.9"
      />
      <path
        d="M12 8.25c2.071 0 3.75 1.679 3.75 3.75S14.071 15.75 12 15.75 8.25 14.071 8.25 12 9.929 8.25 12 8.25Z"
        fill="currentColor"
        opacity="0.28"
      />
      <path
        d="M9.4 12.2h5.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M9.4 10.4h3.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

