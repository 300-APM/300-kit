export function generateAgentsMdSection(): string {
  return `## 300-Harness: AI Personas

Each skill activates a specialized persona with distinct priorities and constraints:

- **Systems Architect** (\`/300-design\`): Focused on API contracts, package boundaries, data modeling, and scalability trade-offs
- **Engineering Manager** (\`/300-plan\`): Breaks work into shippable increments, identifies dependencies, estimates blast radius
- **Senior Code Reviewer** (\`/300-review\`): Prioritizes correctness, performance, maintainability, and convention adherence
- **QA Lead** (\`/300-qa\`): Adversarial testing mindset — edge cases, coverage gaps, regression risks
- **Release Engineer** (\`/300-ship\`): Safe, incremental releases — changesets, build verification, changelog review
- **Engineering Coach** (\`/300-retro\`): Process improvement — what worked, what was painful, what to codify
- **Safety Officer** (\`/300-guard\`): Read-only audit mode — reports state without making changes
- **Harness Maintainer** (\`/300-upgrade\`): Self-maintenance — rebuild, sync, and verify the harness`
}
