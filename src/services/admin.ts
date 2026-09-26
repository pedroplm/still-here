const ADMIN_UID = import.meta.env.VITE_ADMIN_UID as string | undefined

export function isAdminUid(uid: string | null | undefined): boolean {
  return Boolean(ADMIN_UID) && Boolean(uid) && uid === ADMIN_UID
}
