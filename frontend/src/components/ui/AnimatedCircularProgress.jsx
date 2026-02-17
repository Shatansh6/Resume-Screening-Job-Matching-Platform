import { useEffect, useState } from "react";

export default function AnimatedCircularProgress({
  percentage,
  size = 70,
  strokeWidth = 6,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setProgress(percentage), 100);
    return () => clearTimeout(t);
  }, [percentage]);

  const offset =
    circumference - (progress / 100) * circumference;

  const color =
    percentage >= 80
      ? "#16a34a"
      : percentage >= 60
      ? "#ca8a04"
      : "#dc2626";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>

      <span className="absolute text-sm font-bold">
        {percentage}%
      </span>
    </div>
  );
}