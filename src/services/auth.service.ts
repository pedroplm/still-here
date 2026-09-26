import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { auth } from './firebase.config'

export async function register(email: string, password: string, displayName: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName })
  await sendEmailVerification(credential.user)
  return credential.user
}

export async function login(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export async function logout() {
  await signOut(auth)
}

export function getCurrentUser() {
  return auth.currentUser
}

export async function resendVerification(user: User) {
  await sendEmailVerification(user)
}

export async function requestPasswordReset(email: string) {
  await sendPasswordResetEmail(auth, email)
}
