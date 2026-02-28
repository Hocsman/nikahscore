import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn', () => {
  it('merge des classes simples', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('gère les valeurs falsy', () => {
    expect(cn('base', false && 'hidden')).toBe('base')
  })

  it('merge des classes Tailwind conflictuelles (la dernière gagne)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('retourne une string vide sans arguments', () => {
    expect(cn()).toBe('')
  })
})
