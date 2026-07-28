import { useState } from "react";

interface StarRatingProps {
  value: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
}

const StarRating = ({
  value,
  interactive = false, // true when I'm still rating the session, false when there is already a rating
  onChange,
}: StarRatingProps) => {
  const [rate, setRate] = useState<number>(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => {
        const isActive = i <= value;

        const handleHover = (idx: number) => {
          onChange?.(idx);
        };

        const handleMouseLeave = () => {
          onChange?.(rate);
        };

        const handleSetRate = (idx: number) => {
          onChange?.(idx);
          setRate(i);
        };

        return (
          <button
            key={i}
            type="button"
            onClick={() => interactive && handleSetRate(i)}
            onMouseEnter={() => handleHover(i)}
            onMouseLeave={handleMouseLeave}
            disabled={!interactive}
            className={`text-xl transition-colors ${
              isActive ? "text-teal-500" : "text-neutral-200"
            } ${interactive ? "cursor-pointer hover:text-teal-400" : "cursor-default"}`}
            aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
