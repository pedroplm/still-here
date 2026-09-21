export function buildAnimalSlug(species: string, name: string, id: string): string {
  const slug = `${species} ${name}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
  return `${slug}-${id}`
}

export function extractIdFromSlug(slug: string): string {
  const lastDash = slug.lastIndexOf('-')
  return lastDash === -1 ? slug : slug.slice(lastDash + 1)
}
