/**
 * SM-2 Spaced Repetition Algorithm
 *
 * Based on the SuperMemo SM-2 algorithm.
 * - quality 0-2: "Hard" (forgot / struggled)
 * - quality 3-5: "Easy" (remembered)
 *
 * For simplicity in the UI, we map:
 * - "Hard" button → quality = 1
 * - "Easy" button → quality = 4
 */

export interface SRSCard {
  ease_factor: number;   // Default 2.5
  interval: number;      // Days until next review
  repetitions: number;   // Consecutive correct answers
}

export interface SRSResult {
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review: Date;
}

export function calculateSRS(card: SRSCard, quality: number): SRSResult {
  let { ease_factor, interval, repetitions } = card;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease_factor);
    }
    repetitions += 1;
  } else {
    // Incorrect / hard response — reset
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor (minimum 1.3)
  ease_factor = Math.max(
    1.3,
    ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // Calculate next review date
  const next_review = new Date();
  next_review.setDate(next_review.getDate() + interval);

  return {
    ease_factor: Math.round(ease_factor * 100) / 100,
    interval,
    repetitions,
    next_review,
  };
}

/** Quality value for "Easy" button */
export const QUALITY_EASY = 4;

/** Quality value for "Hard" button */
export const QUALITY_HARD = 1;
