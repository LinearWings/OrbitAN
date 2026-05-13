export const CLOCK_FACE_COLOR = "#0A0A0A";
export const CLOCK_HAND_COLOR = "#E5E5E5";

export const NEBULA_PARTICLE_COUNT = 80;
export const NEBULA_COLOR_AMBER = "#EAB308";
export const NEBULA_COLOR_BLUE = "#2563EB";
export const NEBULA_COLOR_VIOLET = "#7C3AED";
export const NEBULA_OPACITY_MIN = 0.15;
export const NEBULA_OPACITY_MAX = 0.35;

export const FILM_GRAIN_OPACITY = 0.04;
export const FILM_GRAIN_SIZE = 256;

export const ORBIT_RING_COUNT = 6;
export const ORBIT_RING_COLOR_A = "#EAB308";
export const ORBIT_RING_COLOR_B = "#2563EB";

/** Unified planet/comet radius by duration bucket (minutes). */
export const UNIFIED_RADIUS = {
  "<30": 4,
  "30-60": 5,
  "60-120": 7,
  ">120": 9,
} as const;

export const TASK_TYPE_LIST: string[] = ["work", "study", "meeting", "personal"];

export const POMODORO_DEFAULTS = {
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  cyclesBeforeLongBreak: 4,
};

export const MOFFATT_DEFAULTS = {
  sessionCount: 8,
  defaultSessionDuration: 25 * 60,
};

export const PARETO_DEFAULTS = {
  impactThreshold: 80,
  maxScore: 100,
};

export const CONSTRUCTIVIST_ENABLED = true;
export const CONSTRUCTIVIST_YELLOW = "#EAB308";
export const CONSTRUCTIVIST_BLUE = "#2563EB";
export const CONSTRUCTIVIST_CIRCLE_OPACITY = 0.10;
export const CONSTRUCTIVIST_LINE_OPACITY = 0.07;
export const CONSTRUCTIVIST_RECT_OPACITY = 0.06;
export const CONSTRUCTIVIST_DIAG_COUNT = 3;
