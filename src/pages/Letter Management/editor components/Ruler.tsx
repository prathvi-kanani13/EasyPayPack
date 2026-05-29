import React from "react";

interface RulerProps {
  orientation: "horizontal" | "vertical";
  size: number; // Size in pixels
  unitSize?: number; // Distance between major ticks, default 100
  segments?: number; // Number of sub-segments, default 10
  zoom?: number; // Zoom level (1 = 100%)
}

/**
 * Ruler component to display pixel measurements along the canvas edges
 * Used for both horizontal and vertical orientations
 */
export const Ruler: React.FC<RulerProps> = ({
  orientation,
  size,
  unitSize = 100,
  segments = 10,
  zoom = 1,
}) => {
  const isHorizontal = orientation === "horizontal";
  const subStep = (unitSize * zoom) / segments;

  return (
    <div
      className={`relative select-none text-[10px] text-muted-foreground border-muted ${isHorizontal ? "h-6 w-full border-b" : "w-6 h-full border-r"
        }`}
      style={{
        [isHorizontal ? "width" : "height"]: `${size}px`,
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        style={{
          display: "block",
        }}
      >
        {Array.from({ length: Math.ceil(size / subStep) + 1 }).map((_, i) => {
          const pos = i * subStep;
          const isMajor = i % segments === 0; // Every unitSize (e.g. 100px)
          const isMid = segments >= 2 && i % (segments / 2) === 0 && !isMajor; // Midpoint (e.g. 50px)

          const actualPos = i * (unitSize / segments);

          if (isHorizontal) {
            return (
              <React.Fragment key={i}>
                <line
                  x1={pos}
                  y1={isMajor ? 0 : isMid ? 8 : 12}
                  x2={pos}
                  y2={24}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="opacity-40"
                />
                {isMajor && (
                  <text
                    x={pos + 4}
                    y={12}
                    fill="currentColor"
                    className="font-medium text-[9px] opacity-70"
                  >
                    {actualPos}
                  </text>
                )}
              </React.Fragment>
            );
          } else {
            return (
              <React.Fragment key={i}>
                <line
                  x1={isMajor ? 0 : isMid ? 8 : 12}
                  y1={pos}
                  x2={24}
                  y2={pos}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="opacity-40"
                />
                {isMajor && (
                  <text
                    x={6}
                    y={pos + 12}
                    fill="currentColor"
                    className="font-medium text-[9px] opacity-70"
                    style={{ transform: "rotate(-90deg)", transformOrigin: `${10}px ${pos + 12}px` }}
                  >
                    {actualPos}
                  </text>
                )}
              </React.Fragment>
            );
          }
        })}
      </svg>
    </div>
  );
};
