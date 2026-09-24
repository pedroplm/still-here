export async function getRandomDogImage(): Promise<string> {
  const response = await fetch('https://dog.ceo/api/breeds/image/random')
  if (!response.ok) {
    throw new Error('Falha ao buscar imagem aleatória.')
  }
  const data: unknown = await response.json()
  if (typeof data !== 'object' || data === null) {
    throw new Error('Resposta inválida da API.')
  }
  const { message, status } = data as { message?: unknown; status?: unknown }
  if (status !== 'success' || typeof message !== 'string') {
    throw new Error('Resposta inválida da API.')
  }
  return message
}