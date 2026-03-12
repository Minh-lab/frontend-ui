const STORAGE_KEY = "student-access";

const defaultAccess = {
  projectEnabled: false,
  internEnabled: false,
};

export function getStudentAccess() {
  if (typeof window === "undefined") return defaultAccess;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAccess;
    const parsed = JSON.parse(raw);
    return { ...defaultAccess, ...parsed };
  } catch {
    return defaultAccess;
  }
}

export function setStudentAccess(next) {
  if (typeof window === "undefined") return defaultAccess;
  const current = getStudentAccess();
  const merged = { ...current, ...next };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  return merged;
}
