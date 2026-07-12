import type { SVGProps } from "react";

const TEETH = [29.5, 38.5, 47.5, 56.5, 65.5];
const STAR =
  "M0 -5 Q0.9 -0.9 5 0 Q0.9 0.9 0 5 Q-0.9 0.9 -5 0 Q-0.9 -0.9 0 -5 Z";

/**
 * The Danumai brand mark: a gradient "roof" tile — the house that holds every
 * venture — carrying a solid white "D" and a ringed Signal Coral dot. The dot
 * is the brand's signal (cf. the coral nav bubble and .pulse-dot): it reads as
 * the full stop in "Danumai." and the venture spark the house holds. A soft
 * drop shadow floats the glyph off the glass and a slow specular sweep keeps
 * the tile alive at rest.
 *
 * With `interactive` on (used in the Nav), hovering the wrapping `.group` zooms
 * the mark and swaps the D for a celebrating cinema clapperboard — a nod to
 * Danumai's streaming / Studios roots: the board pops in, the clapstick snaps
 * shut ("action!"), a flash blooms and sparkles twinkle. All hover motion lives
 * in globals.css (.danu-* rules) and honours prefers-reduced-motion.
 *
 * The static twin — gradient tile + white D + dot — lives at app/icon.svg (the
 * favicon), since browser tabs don't animate.
 */
export default function Logo({
  size = 32,
  title = "Danumai",
  interactive = false,
  ...props
}: {
  size?: number;
  title?: string;
  interactive?: boolean;
} & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient
          id="danu-g"
          x1="16"
          y1="6"
          x2="88"
          y2="96"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#4f5cf0" />
          <stop offset="0.52" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#d12f97" />
        </linearGradient>
        <linearGradient
          id="danu-sheen"
          x1="50"
          y1="3"
          x2="50"
          y2="66"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.24" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="danu-shine-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="danu-flash-grad">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id="danu-depth" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow
            dx="0"
            dy="1.2"
            stdDeviation="1.1"
            floodColor="#2a0d40"
            floodOpacity="0.28"
          />
        </filter>
        <clipPath id="danu-tile-clip">
          <rect x="4" y="4" width="92" height="92" rx="27" />
        </clipPath>
        <clipPath id="danu-clap-clip">
          <rect x="28" y="39.5" width="44" height="10" rx="2.2" />
        </clipPath>
      </defs>

      {/* one roof: the gradient squircle that houses every venture */}
      <rect x="4" y="4" width="92" height="92" rx="27" fill="url(#danu-g)" />
      <rect x="4" y="4" width="92" height="92" rx="27" fill="url(#danu-sheen)" />

      {/* resting specular sweep, clipped to the tile */}
      {interactive && (
        <g clipPath="url(#danu-tile-clip)">
          <g transform="rotate(16 50 50)">
            <rect
              className="danu-shine"
              x="40"
              y="-16"
              width="20"
              height="132"
              fill="url(#danu-shine-grad)"
            />
          </g>
        </g>
      )}

      {/* the D + its signal dot, floated off the glass */}
      <g className={interactive ? "danu-d" : undefined} filter="url(#danu-depth)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#ffffff"
          d="M31 27 H48.5 C62.6 27 74 37.3 74 50 C74 62.7 62.6 73 48.5 73 H31 Z
             M44 40 V60 H48.5 C55.4 60 61 55.5 61 50 C61 44.5 55.4 40 48.5 40 Z"
        />
        <circle cx="80.5" cy="70" r="7.4" fill="#ffffff" opacity="0.92" />
        <circle cx="80.5" cy="70" r="6" fill="#e0402f" />
      </g>

      {/* celebrating cinema clapperboard — revealed on hover */}
      {interactive && (
        <g className="danu-cine">
          {/* flash bloom at the moment of the clap */}
          <circle
            className="danu-flash"
            cx="50"
            cy="53"
            r="30"
            fill="url(#danu-flash-grad)"
          />

          <g filter="url(#danu-depth)">
            {/* slate body */}
            <rect x="30" y="51" width="40" height="21" rx="3.4" fill="#ffffff" />
            <rect x="35" y="57.4" width="23" height="2.3" rx="1.1" fill="url(#danu-g)" opacity="0.6" />
            <rect x="35" y="63.4" width="16" height="2.3" rx="1.1" fill="url(#danu-g)" opacity="0.42" />

            {/* hinged clapstick; teeth are cut from the same tile gradient so
                the gaps read as see-through to the roof behind */}
            <g className="danu-clap">
              <g clipPath="url(#danu-clap-clip)">
                <rect x="28" y="39.5" width="44" height="10" fill="#ffffff" />
                {TEETH.map((x) => (
                  <rect
                    key={x}
                    x={x}
                    y="37"
                    width="5"
                    height="16"
                    fill="url(#danu-g)"
                    transform={`rotate(20 ${x} 45)`}
                  />
                ))}
              </g>
            </g>
          </g>

          {/* celebration sparkles */}
          <path className="danu-spark s1" transform="translate(73 32)" fill="#ffffff" d={STAR} />
          <path className="danu-spark s2" transform="translate(82 50) scale(0.72)" fill="#ffffff" d={STAR} />
          <path className="danu-spark s3" transform="translate(26 42) scale(0.64)" fill="#ffffff" d={STAR} />
          <path className="danu-spark s4" transform="translate(70 67) scale(0.6)" fill="#ffffff" d={STAR} />
        </g>
      )}

      {/* lit-glass rim */}
      <rect
        x="4.7"
        y="4.7"
        width="90.6"
        height="90.6"
        rx="26.3"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.24"
        strokeWidth="1.2"
      />
    </svg>
  );
}
