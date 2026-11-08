export type Project = {
  slug: string
  name: string
  type: string
  year: string
  description: string
  detail: string
  problem: string
  approach: string[]
  stack: string[]
  repository?: string
  visibility: 'public' | 'private'
  visual: 'recruitsage' | 'induss' | 'math' | 'security'
  featured: boolean
}

export const projects: Project[] = [
  {
    slug: 'recruitsage',
    name: 'RecruitSage Sensei',
    type: 'Placement intelligence',
    year: '2026',
    description: 'A local-first assistant for making placement research and application work easier to manage.',
    detail: 'Connects job listings, placement email evidence, career notes, and application preparation through a read-only CLI and MCP server, with explicit owner approval for submission.',
    problem: 'Placement work is scattered across job posts, messages, resumes, deadlines, and personal notes. It is easy to lose the evidence behind a decision or prepare from stale information.',
    approach: [
      'Built a Node.js and SQLite bridge with shared CLI and MCP entry points for job research and preparation.',
      'Added bounded job packets that bring role details, eligibility, application state, and document excerpts together with source references.',
      'Kept Gmail access read-only and made application submission a separate, explicit approval step.',
    ],
    stack: ['Node.js', 'SQLite', 'MCP', 'Gmail API'],
    visibility: 'private',
    visual: 'recruitsage',
    featured: true,
  },
  {
    slug: 'induss',
    name: 'INDUSS Research Intelligence',
    type: 'AI research systems',
    year: '2026',
    description: 'A research backend that turns company evidence into cited analysis and valuation reports.',
    detail: 'An MCP server that routes research to appropriate sources, extracts and validates company data, and composes citations and deterministic financial calculations into reports.',
    problem: 'Company research pulls information from many sources, each with different authority, formats, and levels of freshness. Analysts need a visible path from source material to conclusions.',
    approach: [
      'Designed reusable source, extraction, normalization, validation, citation, and calculation engines behind thin MCP tools.',
      'Added deterministic valuation workflows and Markdown and HTML report rendering.',
      'Contributed merged reliability and OAuth deployment documentation improvements through upstream pull requests.',
    ],
    stack: ['TypeScript', 'Node.js', 'MCP', 'SEC XBRL', 'Exa'],
    repository: 'https://github.com/Kirat0201/induss-research-mcp',
    visibility: 'public',
    visual: 'induss',
    featured: true,
  },
  {
    slug: 'mathdotconnect',
    name: 'MathDotConnect',
    type: 'Learning tools',
    year: '2025–26',
    description: 'An equation explorer with interactive explanations and a personal learning notebook.',
    detail: 'Search and filter curated equations, explore the unit circle, save favorites, add personal entries, and export or restore a notebook locally.',
    problem: 'Formula lists show what an equation looks like, but often leave out the intuition, assumptions, and connections that make it useful.',
    approach: [
      'Built a searchable catalog with topic filters, equation details, notation, assumptions, and linked learning resources.',
      'Made Euler’s identity explorable through an interactive unit-circle view.',
      'Added local favorites and validated notebook export and merge-aware restoration.',
    ],
    stack: ['JavaScript', 'HTML canvas', 'Node.js'],
    repository: 'https://github.com/Kirat0201/MathDotConnect',
    visibility: 'public',
    visual: 'math',
    featured: true,
  },
  {
    slug: 'sshsentry',
    name: 'SSHSentry',
    type: 'Security tooling',
    year: '2025',
    description: 'A small Python CLI for spotting suspicious SSH authentication patterns in Linux logs.',
    detail: 'Filters common authentication events, groups matches by source IP, applies configurable thresholds, and exports reports as CSV or JSON.',
    problem: 'Authentication logs are noisy and repetitive. A quick, portable summary can help an operator decide which events deserve a closer look.',
    approach: [
      'Implemented log matching and grouping with Python standard library modules.',
      'Added configurable thresholds and count-based severity labels.',
      'Included a synthetic log generator for repeatable walkthroughs and sample analysis.',
    ],
    stack: ['Python', 'Argparse', 'Dataclasses'],
    repository: 'https://github.com/Kirat0201/SSHSentry',
    visibility: 'public',
    visual: 'security',
    featured: true,
  },
]

export const contributions = [
  {
    title: 'Observer usage visibility',
    description: 'Added per-turn token usage logging from finalized SDK result frames, while keeping prompt content out of logs.',
    repository: 'Claude-Mem',
    url: 'https://github.com/thedotmack/claude-mem/pull/5293',
    status: 'Merged',
  },
  {
    title: 'Safer remote hook spool URLs',
    description: 'Validated configured worker URLs, required HTTPS for remote workers, and covered transport selection with focused tests.',
    repository: 'Claude-Mem',
    url: 'https://github.com/thedotmack/claude-mem/pull/5285',
    status: 'Merged',
  },
  {
    title: 'Responsive work-view recovery',
    description: 'Moved SQLite-backed work-view projection off the HTTP event loop and added a bounded retry for oversized generated reviews.',
    repository: 'Claude-Mem',
    url: 'https://github.com/thedotmack/claude-mem/pull/5284',
    status: 'Merged',
  },
  {
    title: 'Verification-hold recovery',
    description: 'Preserved pending observer batches during verification holds and recorded recovery guidance in observer health.',
    repository: 'Claude-Mem',
    url: 'https://github.com/thedotmack/claude-mem/pull/5252',
    status: 'Merged',
  },
  {
    title: 'On-demand work-view refresh',
    description: 'Added a guarded refresh endpoint and UI states for manual refresh, including visible startup failures.',
    repository: 'Claude-Mem',
    url: 'https://github.com/thedotmack/claude-mem/pull/5249',
    status: 'Merged',
  },
]
