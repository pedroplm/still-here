import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  increment,
} from 'firebase/firestore'
import { db } from './firebase.config'
import type { Organization, Animal } from '@/types'

const ACCESS_STATS_DOC = doc(db, 'stats', 'accesses')

// --- Acessos da home ---
export async function incrementAccessCount() {
  await setDoc(ACCESS_STATS_DOC, { count: increment(1) }, { merge: true })
}

export async function getAccessCount(): Promise<number> {
  const snap = await getDoc(ACCESS_STATS_DOC)
  return snap.exists() ? (snap.data().count ?? 0) : 0
}

// --- Organizations ---
export async function getOrganizations() {
  const snap = await getDocs(collection(db, 'organizations'))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Organization[]
}

export async function getOrganization(id: string) {
  const snap = await getDoc(doc(db, 'organizations', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Organization
}

export async function getOrganizationByUserId(userId: string) {
  const q = query(collection(db, 'organizations'), where('userId', '==', userId))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as Organization
}

export async function createOrganization(data: Omit<Organization, 'id' | 'organizationId'>) {
  const ref = doc(collection(db, 'organizations'))
  await setDoc(ref, {
    ...data,
    organizationId: ref.id,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return ref.id
}

export async function updateOrganization(id: string, data: Partial<Organization>) {
  return updateDoc(doc(db, 'organizations', id), { ...data, updatedAt: Timestamp.now() })
}

// --- Animals ---
export async function getAnimals(organizationId?: string) {
  let q
  if (organizationId) {
    q = query(collection(db, 'animals'), where('organizationId', '==', organizationId), orderBy('createdAt', 'desc'))
  } else {
    q = query(collection(db, 'animals'), where('available', '==', true), orderBy('createdAt', 'desc'))
  }
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Animal[]
}

export async function getAnimal(id: string) {
  const snap = await getDoc(doc(db, 'animals', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Animal
}

export async function createAnimal(data: Omit<Animal, 'id'>) {
  return addDoc(collection(db, 'animals'), { ...data, createdAt: Timestamp.now(), updatedAt: Timestamp.now() })
}

export async function updateAnimal(id: string, data: Partial<Animal>) {
  return updateDoc(doc(db, 'animals', id), { ...data, updatedAt: Timestamp.now() })
}

export async function deleteAnimal(id: string) {
  return deleteDoc(doc(db, 'animals', id))
}
