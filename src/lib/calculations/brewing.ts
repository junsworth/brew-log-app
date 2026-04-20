const GRAVITY_REGEX = /^1\.\d{3}$/;

export function toNumber(value: string): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return parsed;
}

export function parseGravity(value: string): number | null {
  if (!GRAVITY_REGEX.test(value.trim())) {
    return null;
  }
  return Number(value);
}

export function calculateAbv(og: string, fg: string): number | null {
  const ogNum = parseGravity(og);
  const fgNum = parseGravity(fg);
  if (ogNum === null || fgNum === null || ogNum <= fgNum) {
    return null;
  }

  return (ogNum - fgNum) * 131.25;
}

export function calculateApparentAttenuation(og: string, fg: string): number | null {
  const ogNum = parseGravity(og);
  const fgNum = parseGravity(fg);
  if (ogNum === null || fgNum === null || ogNum <= 1 || fgNum < 1) {
    return null;
  }

  return ((ogNum - fgNum) / (ogNum - 1)) * 100;
}
