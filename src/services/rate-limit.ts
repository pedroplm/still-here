const STORAGE_KEY = 'stillhere:register-attempts'

export const REGISTER_MAX_ATTEMPTS = 3
export const REGISTER_WINDOW_MS = 5 * 60 * 1000

function readAttempts(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((n): n is number => typeof n === 'number')
  } catch {
    return []
  }
}

function writeAttempts(times: number[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(times))
  } catch {
    return
  }
}

function prune(now: number) {
  return readAttempts().filter((t) => now - t < REGISTER_WINDOW_MS)
}

export function registerAttemptsLeft(now = Date.now()): number {
  return Math.max(0, REGISTER_MAX_ATTEMPTS - prune(now).length)
}

export function registerLockRemaining(now = Date.now()): number {
  const attempts = prune(now)
  if (attempts.length < REGISTER_MAX_ATTEMPTS) return 0
  return Math.max(0, REGISTER_WINDOW_MS - (now - attempts[0]))
}

export function recordRegisterAttempt(now = Date.now()): number {
  writeAttempts([...prune(now), now])
  return registerLockRemaining(now)
}

export function clearRegisterAttempts() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    return
  }
}
