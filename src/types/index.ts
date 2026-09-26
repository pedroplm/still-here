import { Timestamp } from 'firebase/firestore'

export type OrgStatus = 'pending' | 'approved' | 'rejected'

export interface Organization {
  id?: string
  userId: string
  organizationId: string
  name: string
  description: string
  city: string
  state: string
  cnpj: string
  phone: string
  email: string
  website?: string
  instagram?: string
  logoUrl?: string
  pixKey?: string
  pixQrCodeUrl?: string
  status?: OrgStatus
  rejectionReason?: string
  reviewedAt?: Timestamp
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export type AnimalStatus = 'available' | 'adoption_pending' | 'adopted'
export type AnimalSex = 'macho' | 'femea' | 'indefinido'

export interface Animal {
  id?: string
  organizationId: string
  ownerUid: string
  name: string
  species: 'cachorro' | 'gato' | 'ave' | 'roedor' | 'outro'
  breed?: string
  sex: AnimalSex
  age: string
  size: 'pequeno' | 'medio' | 'grande'
  status: AnimalStatus
  description: string
  imageUrl: string
  available: boolean
  createdAt?: Timestamp
  updatedAt?: Timestamp
}
