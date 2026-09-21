export type AnimalSpecies = 'cachorro' | 'gato' | 'ave' | 'roedor' | 'outro'
export type AnimalSize = 'pequeno' | 'medio' | 'grande'
export type AnimalSex = 'macho' | 'femea' | 'indefinido'
export type AnimalStatus = 'available' | 'adoption_pending' | 'adopted'

export interface SpeciesCategory {
  value: AnimalSpecies
  label: string
  icon: string
}

export interface SizeCategory {
  value: AnimalSize
  label: string
  description: string
}

export interface SexCategory {
  value: AnimalSex
  label: string
}

export interface StatusCategory {
  value: AnimalStatus
  label: string
  color: string
}

export const speciesCategories: SpeciesCategory[] = [
  { value: 'cachorro', label: 'Cachorro', icon: '🐕' },
  { value: 'gato', label: 'Gato', icon: '🐈' },
  { value: 'ave', label: 'Ave', icon: '🦜' },
  { value: 'roedor', label: 'Roedor', icon: '🐹' },
  { value: 'outro', label: 'Outro', icon: '🐾' },
]

export const sizeCategories: SizeCategory[] = [
  { value: 'pequeno', label: 'Pequeno', description: 'Até 10 kg' },
  { value: 'medio', label: 'Médio', description: '10 a 25 kg' },
  { value: 'grande', label: 'Grande', description: 'Acima de 25 kg' },
]

export const sexCategories: SexCategory[] = [
  { value: 'macho', label: 'Macho' },
  { value: 'femea', label: 'Fêmea' },
  { value: 'indefinido', label: 'Indefinido' },
]

export const statusCategories: StatusCategory[] = [
  { value: 'available', label: 'Disponível', color: 'emerald' },
  { value: 'adoption_pending', label: 'Adoção em andamento', color: 'amber' },
  { value: 'adopted', label: 'Adotado', color: 'gray' },
]

export const ageOptions = [
  'Filhote',
  'Jovem',
  'Adulto',
  'Idoso',
]

export const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]
