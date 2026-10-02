export type Treatment = {
  slug: string
  title: string
  eyebrow: string
  shortDescription: string
  description: string
  benefits: string[]
  indications: string[]
  featured?: boolean
}

export type Professional = {
  slug: string
  name: string
  cro: string
  specialty: string
  formation: string
  bio: string
}
