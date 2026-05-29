export default function PhoneMockup() {
  return (
    <div className="relative w-[260px] sm:w-[300px] mx-auto">
      <svg
        viewBox="0 0 300 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full drop-shadow-2xl"
      >
        <rect x="2" y="2" width="296" height="596" rx="44" fill="#1A1A2E" />
        <rect x="10" y="10" width="280" height="580" rx="38" fill="#0F4C81" />
        <rect x="14" y="14" width="272" height="572" rx="34" fill="#FAFAF5" />
        <rect x="110" y="22" width="80" height="22" rx="11" fill="#1A1A2E" />
        <rect x="14" y="60" width="272" height="52" fill="#0F4C81" />
        <text x="30" y="92" fontFamily="sans-serif" fontSize="14" fontWeight="700" fill="white">Moul7anout</text>
        <circle cx="260" cy="86" r="14" fill="#FF6B35" />
        <rect x="24" y="124" width="252" height="36" rx="18" fill="#F0F4F8" />
        <text x="44" y="147" fontFamily="sans-serif" fontSize="11" fill="#6B7280">Search stores near you...</text>
        <rect x="24" y="174" width="116" height="100" rx="12" fill="#F0F4F8" />
        <rect x="24" y="174" width="116" height="44" rx="12" fill="#0F4C81" />
        <text x="36" y="200" fontFamily="sans-serif" fontSize="10" fontWeight="600" fill="white">Épicerie Maarif</text>
        <text x="36" y="214" fontFamily="sans-serif" fontSize="9" fill="rgba(255,255,255,0.7)">0.3 km away</text>
        <text x="36" y="252" fontFamily="sans-serif" fontSize="9" fill="#6B7280">Groceries · Open</text>
        <rect x="24" y="282" width="116" height="8" rx="4" fill="#F0F4F8" />
        <rect x="152" y="174" width="116" height="100" rx="12" fill="#F0F4F8" />
        <rect x="152" y="174" width="116" height="44" rx="12" fill="#FF6B35" />
        <text x="164" y="200" fontFamily="sans-serif" fontSize="10" fontWeight="600" fill="white">Kiosque Mobile</text>
        <text x="164" y="214" fontFamily="sans-serif" fontSize="9" fill="rgba(255,255,255,0.7)">Moving · 1.1 km</text>
        <text x="164" y="252" fontFamily="sans-serif" fontSize="9" fill="#6B7280">Snacks · Drinks</text>
        <rect x="152" y="282" width="116" height="8" rx="4" fill="#F0F4F8" />
        <rect x="24" y="298" width="244" height="52" rx="12" fill="#0F4C81" />
        <text x="40" y="320" fontFamily="sans-serif" fontSize="11" fontWeight="700" fill="white">LKRIDI</text>
        <text x="40" y="336" fontFamily="sans-serif" fontSize="9" fill="rgba(255,255,255,0.7)">Pay in 3× · No bank required</text>
        <rect x="190" y="308" width="64" height="28" rx="14" fill="#FF6B35" />
        <text x="222" y="326" fontFamily="sans-serif" fontSize="9" fontWeight="700" fill="white" textAnchor="middle">3× 500</text>
        <rect x="14" y="542" width="272" height="44" fill="#F0F4F8" />
        <rect x="14" y="542" width="272" height="2" fill="#E5E7EB" />
        <circle cx="80" cy="564" r="8" fill="#0F4C81" />
        <circle cx="150" cy="564" r="8" fill="#E5E7EB" />
        <circle cx="220" cy="564" r="8" fill="#E5E7EB" />
      </svg>
      <div className="absolute inset-0 -z-10 blur-3xl opacity-20 bg-navy rounded-full scale-75" />
    </div>
  );
}
