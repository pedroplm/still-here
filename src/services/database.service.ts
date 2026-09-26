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
  deleteField,
  writeBatch,
} from 'firebase/firestore'
import { db } from './firebase.config'
import type { Organization, Animal, OrgStatus } from '@/types'
import { demoOrganizations, DEMO_CAMPINAS_ORG_ID } from '@/data'
import { onlyDigits } from './cnpj'

const ACCESS_STATS_DOC = doc(db, 'stats', 'accesses')

function compact<T extends Record<string, unknown>>(data: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  ) as Partial<T>
}

function isPermissionDenied(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code?: unknown }).code === 'permission-denied'
  )
}

// Documento que a regra esconde (ONG em análise, animal já adotado) precisa ler
// como "não existe" — senão a página pública estoura erro em vez de 404.
async function getPublicDoc<T>(ref: ReturnType<typeof doc>): Promise<T | null> {
  try {
    const snap = await getDoc(ref)
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null
  } catch (err: unknown) {
    if (isPermissionDenied(err)) return null
    throw err
  }
}

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
  const q = query(collection(db, 'organizations'), where('status', '==', 'approved'))
  const snap = await getDocs(q)
  const firestoreOrgs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Organization)
  const hasCampinas = firestoreOrgs.some((o) => o.organizationId === DEMO_CAMPINAS_ORG_ID)
  return hasCampinas ? firestoreOrgs : [...firestoreOrgs, ...demoOrganizations]
}

export async function getOrganization(id: string) {
  const demo = demoOrganizations.find((o) => o.organizationId === id || o.id === id)
  if (demo) return demo
  return getPublicDoc<Organization>(doc(db, 'organizations', id))
}

export async function getOrganizationByUserId(userId: string) {
  const q = query(collection(db, 'organizations'), where('userId', '==', userId))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as Organization
}

export async function getOrganizationsByStatus(status: OrgStatus) {
  const q = query(collection(db, 'organizations'), where('status', '==', status))
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as Organization)
    .sort((a, b) => (a.createdAt?.toMillis() ?? 0) - (b.createdAt?.toMillis() ?? 0))
}

export async function createOrganization(data: Omit<Organization, 'id' | 'organizationId'>) {
  const cnpj = onlyDigits(data.cnpj)
  if (cnpj.length !== 14) {
    throw Object.assign(new Error('invalid_cnpj_digits'), { code: 'invalid-cnpj-digits' })
  }

  const orgRef = doc(collection(db, 'organizations'))
  const now = Timestamp.now()
  const batch = writeBatch(db)
  batch.set(orgRef, {
    ...data,
    cnpj,
    organizationId: orgRef.id,
    status: 'pending' as OrgStatus,
    createdAt: now,
    updatedAt: now,
  })
  batch.set(doc(db, 'cnpj', cnpj), { organizationId: orgRef.id, createdAt: now })
  await batch.commit()
  return orgRef.id
}

export async function updateOrganization(id: string, data: Partial<Organization>) {
  return updateDoc(doc(db, 'organizations', id), {
    ...compact(data as Record<string, unknown>),
    updatedAt: Timestamp.now(),
  })
}

export async function setOrganizationStatus(
  id: string,
  status: OrgStatus,
  rejectionReason?: string,
) {
  const payload: Record<string, unknown> = {
    status,
    reviewedAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }
  payload.rejectionReason = status === 'rejected' ? (rejectionReason ?? '') : deleteField()
  return updateDoc(doc(db, 'organizations', id), payload)
}

// --- Animals ---
export async function getAnimals() {
  const q = query(collection(db, 'animals'), where('available', '==', true), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Animal[]
}

export async function getOrgAnimals(organizationId: string, ownerUid: string) {
  const q = query(
    collection(db, 'animals'),
    where('organizationId', '==', organizationId),
    where('ownerUid', '==', ownerUid),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Animal[]
}

export async function getAvailableAnimals(organizationId?: string) {
  const conditions = [where('available', '==', true)]
  if (organizationId) {
    conditions.push(where('organizationId', '==', organizationId))
  }
  const snap = await getDocs(query(collection(db, 'animals'), ...conditions))
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Animal[]
  list.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0))
  return list
}

export async function getAnimal(id: string) {
  return getPublicDoc<Animal>(doc(db, 'animals', id))
}

export async function createAnimal(data: Omit<Animal, 'id' | 'ownerUid'>, ownerUid: string) {
  return addDoc(collection(db, 'animals'), {
    ...compact(data as unknown as Record<string, unknown>),
    ownerUid,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
}

export async function updateAnimal(id: string, data: Partial<Animal>) {
  return updateDoc(doc(db, 'animals', id), {
    ...compact(data as Record<string, unknown>),
    updatedAt: Timestamp.now(),
  })
}

export async function deleteAnimal(id: string) {
  return deleteDoc(doc(db, 'animals', id))
}

/** Todos os animais da ONG, independente de dono. Só o admin chega aqui. */
export async function getOrganizationAnimals(organizationId: string) {
  const q = query(collection(db, 'animals'), where('organizationId', '==', organizationId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, animal: d.data() as Omit<Animal, 'id'> }))
}

/**
 * Rejeitar uma ONG precisa tirar os animais dela do ar: a regra só impede o
 * dono de republicar, mas os que já publicadas continuariam visíveis na home.
 * Chamado pelo painel admin junto do `setOrganizationStatus`.
 */
export async function hideOrganizationAnimals(organizationId: string) {
  const animals = await getOrganizationAnimals(organizationId)
  const now = Timestamp.now()
  for (let i = 0; i < animals.length; i += 400) {
    const batch = writeBatch(db)
    for (const { id } of animals.slice(i, i + 400)) {
      batch.update(doc(db, 'animals', id), { available: false, updatedAt: now })
    }
    await batch.commit()
  }
  return animals.length
}
