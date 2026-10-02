import { describe, expect, it } from 'vitest'
import { treatments } from '../content/treatments'

describe('treatments content', () => {
  it('does not repeat slugs', () => {
    const slugs = treatments.map((t) => t.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})
