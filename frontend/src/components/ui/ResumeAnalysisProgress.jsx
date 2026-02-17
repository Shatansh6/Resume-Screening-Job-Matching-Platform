import { useEffect, useState } from "react";

export default function ResumeAnalysisProgress({ onComplete }) {
  const steps = [
    "Reading resume",
    "Extracting skills",
    "Analyzing experience",
    "Matching jobs",
    "Finalizing results",
  ];

  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 600);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    const stepTimer = setInterval(() => {
      setStepIndex((i) => (i < steps.length - 1 ? i + 1 : i));
    }, 900);

    return () => {
      clearInterval(interval);
      clearInterval(stepTimer);
    };
  }, [onComplete]);

  return (
    <div className="w-full text-center">
      <p className="text-sm font-medium mb-3">
        {steps[stepIndex]}…
      </p>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-black transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-gray-500 mt-2">
        {progress}%
      </p>
    </div>
  );
}