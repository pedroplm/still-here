export type AnimalSpecies = 'cachorro' | 'gato' | 'ave' | 'roedor' | 'outro'
export type AnimalSize = 'pequeno' | 'medio' | 'grande'
export type AnimalSex = 'macho' | 'femea' | 'indefinido'
export type AnimalStatus = 'available' | 'adoption_pending' | 'adopted'

export interface SpeciesCategory {
  value: AnimalSpecies
  labelKey: string
  icon: string
}

export interface SizeCategory {
  value: AnimalSize
  labelKey: string
  descriptionKey: string
}

export interface SexCategory {
  value: AnimalSex
  labelKey: string
}

export interface StatusCategory {
  value: AnimalStatus
  labelKey: string
  color: string
}

export const speciesCategories = [
  { value: 'cachorro', labelKey: 'species.cachorro', icon: '🐕' },
  { value: 'gato', labelKey: 'species.gato', icon: '🐈' },
  { value: 'ave', labelKey: 'species.ave', icon: '🦜' },
  { value: 'roedor', labelKey: 'species.roedor', icon: '🐹' },
  { value: 'outro', labelKey: 'species.outro', icon: '🐾' },
] as const satisfies readonly SpeciesCategory[]

export const sizeCategories = [
  { value: 'pequeno', labelKey: 'size.pequeno', descriptionKey: 'size.pequenoDesc' },
  { value: 'medio', labelKey: 'size.medio', descriptionKey: 'size.medioDesc' },
  { value: 'grande', labelKey: 'size.grande', descriptionKey: 'size.grandeDesc' },
] as const satisfies readonly SizeCategory[]

export const sexCategories = [
  { value: 'macho', labelKey: 'sex.macho' },
  { value: 'femea', labelKey: 'sex.femea' },
  { value: 'indefinido', labelKey: 'sex.indefinido' },
] as const satisfies readonly SexCategory[]

export const statusCategories = [
  { value: 'available', labelKey: 'status.available', color: 'emerald' },
  { value: 'adoption_pending', labelKey: 'status.adoptionPending', color: 'amber' },
  { value: 'adopted', labelKey: 'status.adopted', color: 'gray' },
] as const satisfies readonly StatusCategory[]

export const ageOptions = [
  { value: 'Filhote', labelKey: 'age.puppy' },
  { value: 'Jovem', labelKey: 'age.young' },
  { value: 'Adulto', labelKey: 'age.adult' },
  { value: 'Idoso', labelKey: 'age.senior' },
] as const

export const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]
