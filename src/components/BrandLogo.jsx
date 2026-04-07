export default function BrandLogo({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="FitTrack logo"
      role="img"
    >
      <rect x="4" y="4" width="40" height="40" rx="14" fill="#0F172A" />
      <path
        d="M17 32V16H31"
        stroke="#F8FAFC"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 24H26L31 16"
        stroke="#CBD5E1"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="31" cy="16" r="3" fill="#94A3B8" />
    </svg>
  );
}
