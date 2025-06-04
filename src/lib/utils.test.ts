import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('concatenates classes', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('ignores falsy values', () => {
    expect(cn('foo', undefined, false && 'bar', '', 'baz')).toBe('foo baz')
  })

  it('merges tailwind classes', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })
})
