import { describe, expect, it } from 'vitest'
import {
  hasSentinelSection,
  replaceSentinelSection,
} from '../utils/markdown.js'

describe('replaceSentinelSection', () => {
  it('appends section when markers do not exist', () => {
    const content = '# Hello\n\nSome content.'
    const result = replaceSentinelSection(content, 'test', 'New stuff')
    expect(result).toBe(
      '# Hello\n\nSome content.\n\n<!-- test:start -->\nNew stuff\n<!-- test:end -->\n',
    )
  })

  it('replaces content between existing markers', () => {
    const content = [
      '# Hello',
      '',
      '<!-- test:start -->',
      'Old stuff',
      '<!-- test:end -->',
      '',
      'After.',
    ].join('\n')
    const result = replaceSentinelSection(content, 'test', 'New stuff')
    expect(result).toBe(
      '# Hello\n\n<!-- test:start -->\nNew stuff\n<!-- test:end -->\n\nAfter.',
    )
  })

  it('preserves content outside markers', () => {
    const content =
      'Before.\n\n<!-- tag:start -->\nOld\n<!-- tag:end -->\n\nAfter.'
    const result = replaceSentinelSection(content, 'tag', 'Updated')
    expect(result).toContain('Before.')
    expect(result).toContain('After.')
    expect(result).toContain('Updated')
    expect(result).not.toContain('Old')
  })

  it('handles empty content', () => {
    const result = replaceSentinelSection('', 'tag', 'Content')
    expect(result).toBe('\n\n<!-- tag:start -->\nContent\n<!-- tag:end -->\n')
  })
})

describe('hasSentinelSection', () => {
  it('returns true when both markers exist', () => {
    const content = '<!-- test:start -->\nContent\n<!-- test:end -->'
    expect(hasSentinelSection(content, 'test')).toBe(true)
  })

  it('returns false when markers are missing', () => {
    expect(hasSentinelSection('No markers here', 'test')).toBe(false)
  })

  it('returns false when only start marker exists', () => {
    expect(hasSentinelSection('<!-- test:start -->', 'test')).toBe(false)
  })
})
