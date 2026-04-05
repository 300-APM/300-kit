const START_TAG = (tag: string) => `<!-- ${tag}:start -->`
const END_TAG = (tag: string) => `<!-- ${tag}:end -->`

export function replaceSentinelSection(
  content: string,
  tag: string,
  newSection: string,
): string {
  const startMarker = START_TAG(tag)
  const endMarker = END_TAG(tag)
  const startIdx = content.indexOf(startMarker)
  const endIdx = content.indexOf(endMarker)

  const block = `${startMarker}\n${newSection}\n${endMarker}`

  if (startIdx !== -1 && endIdx !== -1) {
    return (
      content.slice(0, startIdx) +
      block +
      content.slice(endIdx + endMarker.length)
    )
  }

  const trimmed = content.trimEnd()
  return `${trimmed}\n\n${block}\n`
}

export function hasSentinelSection(content: string, tag: string): boolean {
  return content.includes(START_TAG(tag)) && content.includes(END_TAG(tag))
}
