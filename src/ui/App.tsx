import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Github, Linkedin, Moon, Sun } from 'lucide-react'
import OceanCanvas from '../ocean/OceanCanvas'
import { contributions, projects, type Project } from '../data/projects'

type Theme = 'light' | 'dark'
type Route = '/' | '/projects' | '/contributions' | '/about' | string

const profileLinks = {
  github: 'https://github.com/Kirat0201',
  linkedin: 'https://linkedin.com/in/harkiratsingh01/',
}
const navItems = [
  { label: 'pond', href: '/' },
  { label: 'projects', href: '/projects' },
  { label: 'open source', href: '/contributions' },
  { label: 'about', href: '/about' },
]

const readRoute = (): Route => window.location.hash.replace(/^#/, '') || '/'

function useRoute() {
  const [route, setRoute] = useState<Route>(readRoute)
  useEffect(() => {
    const sync = () => setRoute(readRoute())
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])
  useEffect(() => window.scrollTo({ top: 0, behavior: 'auto' }), [route])
  return route
}

function ProjectArt({ project, className = '' }: { project: Project; className?: string }) {
  return (
    <div className={'project-art art-' + project.visual + ' ' + className} aria-hidden="true">
      {project.visual === 'recruitsage' && <>
        <div className="art-window"><div className="art-window-bar"><i /><i /><i /><span>career / briefing</span></div><div className="art-window-content"><small>ROLE MATCH · EVIDENCE</small><strong>Product engineer</strong><div className="art-line wide" /><div className="art-line" /><div className="art-pills"><i /><i /><i /></div><div className="art-evidence"><b>01</b><span>source linked</span><ArrowUpRight size={13} /></div></div></div>
        <span className="art-orbit orbit-a" /><span className="art-orbit orbit-b" />
      </>}
      {project.visual === 'induss' && <>
        <div className="art-grid" /><div className="art-node node-a">SOURCE</div><div className="art-node node-b">VALIDATE</div><div className="art-node node-c">REPORT</div><svg viewBox="0 0 500 260" preserveAspectRatio="none"><path d="M125 130 C190 130 185 75 250 75 S310 130 375 130" /><path d="M125 130 C190 130 185 185 250 185 S310 130 375 130" /></svg><span className="art-spark">36</span>
      </>}
      {project.visual === 'math' && <>
        <div className="unit-orbit orbit-one" /><div className="unit-orbit orbit-two" /><div className="unit-axis axis-x" /><div className="unit-axis axis-y" /><span className="unit-point" /><strong className="formula">e<sup>iπ</sup> + 1 = 0</strong><small>one circle · many connections</small>
      </>}
      {project.visual === 'security' && <>
        <div className="terminal-card"><div className="terminal-title"><span>auth.log</span><b>● ● ●</b></div><p><i>18:42:01</i> failed password · 185.220.101.45</p><p><i>18:42:04</i> failed password · 185.220.101.45</p><p><i>18:42:08</i> failed password · 45.155.205.33</p><div className="terminal-result"><b>2</b><span>sources flagged</span><span className="severity">REVIEW</span></div></div>
      </>}
    </div>
  )
}

function ThemeButton({ theme, toggleTheme }: { theme: Theme; toggleTheme: () => void }) {
  return (
    <button className="theme-button" type="button" onClick={toggleTheme} aria-label={'Switch to ' + (theme === 'light' ? 'dark' : 'light') + ' theme'}>
      {theme === 'light' ? <Moon size={15} strokeWidth={1.6} /> : <Sun size={15} strokeWidth={1.6} />}
    </button>
  )
}

function TopNav({ route, theme, toggleTheme, overCover = false }: { route: Route; theme: Theme; toggleTheme: () => void; overCover?: boolean }) {
  const page = route === '/' ? '/' : '/' + route.split('/')[1]
  return (
    <nav className={'top-nav' + (overCover ? ' top-nav-cover' : '')} aria-label="Main">
      {navItems.map((item) => (
        <a key={item.href} href={'#' + item.href} aria-current={page === item.href ? 'page' : undefined} className={page === item.href ? 'active' : ''}>
          {item.label}
        </a>
      ))}
      <ThemeButton theme={theme} toggleTheme={toggleTheme} />
    </nav>
  )
}

function MobileNav({ theme, toggleTheme, route }: { theme: Theme; toggleTheme: () => void; route: Route }) {
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [route])

  return (
    <>
      <button className="mobile-nav-pill" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Close navigation' : 'Open navigation'}>
        <span>Harkirat Singh</span>
        <span className={'menu-mark' + (open ? ' menu-mark-open' : '')}><i /><i /><i /><i /></span>
      </button>
      <div className={'mobile-menu' + (open ? ' mobile-menu-open' : '')} aria-hidden={!open}>
        <nav aria-label="Mobile main">
          {navItems.map((item, index) => (
            <a key={item.href} href={'#' + item.href} tabIndex={open ? 0 : -1} style={{ transitionDelay: open ? (index * 65) + 'ms' : '0ms' }}>
              {item.label === 'pond' ? 'Home' : item.label === 'open source' ? 'Open source' : item.label[0].toUpperCase() + item.label.slice(1)}
            </a>
          ))}
        </nav>
        <div className="mobile-menu-bottom">
          <a href={profileLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={13} /></a>
          <a href={profileLinks.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a>
          <ThemeButton theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </>
  )
}

function SocialLinks() {
  return (
    <p className="social-links">
      <a href={profileLinks.github} target="_blank" rel="noreferrer">github</a>
      <span>/</span>
      <a href={profileLinks.linkedin} target="_blank" rel="noreferrer">linkedin</a>
    </p>
  )
}

function HomePage({ theme, toggleTheme, route }: { theme: Theme; toggleTheme: () => void; route: Route }) {
  return (
    <div className="pond-home">
      <OceanCanvas theme={theme} />
      <MobileNav theme={theme} toggleTheme={toggleTheme} route={route} />
      <TopNav route={route} theme={theme} toggleTheme={toggleTheme} />
      <main className="pond-copy" data-koi-avoid>
        <p className="pond-quote">curiosity, made useful.<span aria-hidden="true" /></p>
        <div className="pond-profile">
          <h1>Hi, I’m Harkirat.</h1>
          <p>I study computer science at Thapar Institute of Engineering and Technology, and build software across AI, research systems, and developer tools.</p>
          <p>Currently building independent projects and contributing to <a href="https://github.com/thedotmack/claude-mem" target="_blank" rel="noreferrer">Claude-Mem</a>.</p>
          <SocialLinks />
        </div>
      </main>
    </div>
  )
}

function ProjectTile({ project }: { project: Project }) {
  return (
    <a className="project-tile" href={'#/projects/' + project.slug} aria-label={'View ' + project.name}>
      <div className="project-tile-image">
        <ProjectArt project={project} />
        <span className="tile-action">view project</span>
      </div>
      <div className="project-tile-title">
        <span>{project.name}</span>
        <span className="project-year">{project.year}</span>
      </div>
      <p className="project-tagline">{project.description}</p>
    </a>
  )
}

function MobileProject({ project }: { project: Project }) {
  return (
    <article className="mobile-project">
      <a className="mobile-project-image" href={'#/projects/' + project.slug} aria-label={'View ' + project.name}>
        <ProjectArt project={project} />
      </a>
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <div className="mobile-project-year"><span>Year</span><span>{project.year}</span></div>
      <a className="view-project" href={'#/projects/' + project.slug}>View project</a>
    </article>
  )
}

function ProjectsPage({ route, theme, toggleTheme }: { route: Route; theme: Theme; toggleTheme: () => void }) {
  const stripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return
    const desktop = window.matchMedia('(min-width: 1024px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let target = strip.scrollLeft
    let raf = 0
    const stop = () => {
      window.cancelAnimationFrame(raf)
      raf = 0
    }
    const glide = () => {
      const before = strip.scrollLeft
      strip.scrollLeft += (target - before) * 0.18
      if (strip.scrollLeft === before || Math.abs(target - strip.scrollLeft) < 1) {
        strip.scrollLeft = target
        raf = 0
        return
      }
      raf = window.requestAnimationFrame(glide)
    }
    const move = (delta: number) => {
      const max = strip.scrollWidth - strip.clientWidth
      target = Math.max(0, Math.min(max, (raf ? target : strip.scrollLeft) + delta))
      if (reduced.matches) strip.scrollLeft = target
      else if (!raf) raf = window.requestAnimationFrame(glide)
    }
    const onWheel = (event: WheelEvent) => {
      if (!desktop.matches) return
      const sideways = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      if (sideways && strip.contains(event.target as Node)) {
        stop()
        return
      }
      event.preventDefault()
      const delta = sideways ? event.deltaX : event.deltaY
      move(event.deltaMode === 1 ? delta * 16 : delta)
    }
    const onKey = (event: KeyboardEvent) => {
      if (!desktop.matches || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
      const step = strip.clientWidth * 0.1
      const amount = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? step
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -step
          : event.key === 'PageDown' || event.key === ' ' ? strip.clientWidth * 0.8
            : event.key === 'PageUp' ? -strip.clientWidth * 0.8 : 0
      if (!amount) return
      if (event.key === ' ' && event.target instanceof HTMLButtonElement) return
      event.preventDefault()
      move(amount)
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    return () => {
      stop()
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div className="projects-view">
      <MobileNav theme={theme} toggleTheme={toggleTheme} route={route} />
      <TopNav route={route} theme={theme} toggleTheme={toggleTheme} />
      <main className="projects-main">
        <div className="projects-strip" ref={stripRef}>
          {projects.map((project) => <ProjectTile key={project.slug} project={project} />)}
        </div>
        <div className="mobile-project-list">
          {projects.map((project) => <MobileProject key={project.slug} project={project} />)}
        </div>
      </main>
    </div>
  )
}

function ProjectPage({ project, route, theme, toggleTheme }: { project: Project; route: Route; theme: Theme; toggleTheme: () => void }) {
  const index = projects.findIndex((item) => item.slug === project.slug)
  const nextProject = projects[(index + 1) % projects.length]
  return (
    <div className="project-detail-page">
      <MobileNav theme={theme} toggleTheme={toggleTheme} route={route} />
      <TopNav route={route} theme={theme} toggleTheme={toggleTheme} overCover />
      <div className="project-cover">
        <ProjectArt project={project} />
        <div className="cover-shade" />
      </div>
      <main className="case-frame">
        <header className="case-header">
          <a className="back-to-projects" href="#/projects"><ArrowLeft size={15} /> Projects</a>
          <h1>{project.name}</h1>
          <p className="case-tagline">{project.description}</p>
          <p className="case-about">{project.detail}</p>
          <a className="case-source" href={project.repository || '#/projects'} target={project.repository ? '_blank' : undefined} rel={project.repository ? 'noreferrer' : undefined}>
            {project.repository ? new URL(project.repository).hostname.replace(/^www\./, '') : 'Private project · source not public'} <ArrowUpRight size={13} />
          </a>
        </header>
        <div className="case-details">
          <section className="case-section">
            <p className="case-label">The problem</p>
            <p className="case-problem">{project.problem}</p>
          </section>
          <section className="case-section">
            <p className="case-label">The approach</p>
            <div className="approach-list">
              {project.approach.map((item, itemIndex) => (
                <div className="approach-row" key={item}><span>0{itemIndex + 1}</span><p>{item}</p></div>
              ))}
            </div>
          </section>
          <section className="case-section case-tools">
            <p className="case-label">Tools and technologies</p>
            <p>{project.stack.join(' · ')}</p>
          </section>
        </div>
        <nav className="project-pager" aria-label="More projects">
          <span className="case-label">Keep exploring</span>
          <a href={'#/projects/' + nextProject.slug}>Next · {nextProject.name} <ArrowRight size={15} /></a>
        </nav>
      </main>
    </div>
  )
}

function ContributionsPage({ route, theme, toggleTheme }: { route: Route; theme: Theme; toggleTheme: () => void }) {
  return (
    <PageLayout route={route} theme={theme} toggleTheme={toggleTheme}>
      <header className="plain-header">
        <p className="page-quote">useful work, shared upstream.<span aria-hidden="true" /></p>
        <h1>Open-source contributions</h1>
        <p>Recent changes to Claude-Mem, an open-source memory system for coding agents.</p>
      </header>
      <section className="contribution-list" aria-label="Merged Claude-Mem pull requests">
        {contributions.map((item, index) => (
          <article className="contribution-row" key={item.url}>
            <span className="contribution-number">0{index + 1}</span>
            <div><h2>{item.title}</h2><p>{item.description}</p></div>
            <a href={item.url} target="_blank" rel="noreferrer">{item.status} <ArrowUpRight size={13} /></a>
          </article>
        ))}
      </section>
    </PageLayout>
  )
}

function AboutPage({ route, theme, toggleTheme }: { route: Route; theme: Theme; toggleTheme: () => void }) {
  return (
    <PageLayout route={route} theme={theme} toggleTheme={toggleTheme}>
      <header className="plain-header">
        <p className="page-quote">curiosity, made useful.<span aria-hidden="true" /></p>
        <h1>About</h1>
        <p>I’m Harkirat Singh, a computer science student at Thapar Institute of Engineering and Technology.</p>
      </header>
      <section className="about-content">
        <div>
          <p className="case-label">What I work on</p>
          <p>I build software across AI, research systems, and developer tools. I’m drawn to early product work, clear evidence, and interfaces that help people understand what a system is doing.</p>
          <p>My recent projects include RecruitSage, INDUSS, MathDotConnect, and SSHSentry. I also contribute reliability and interface improvements to Claude-Mem.</p>
        </div>
        <aside>
          <p className="case-label">Elsewhere</p>
          <a href={profileLinks.github} target="_blank" rel="noreferrer"><Github size={15} /> GitHub <ArrowUpRight size={13} /></a>
          <a href={profileLinks.linkedin} target="_blank" rel="noreferrer"><Linkedin size={15} /> LinkedIn <ArrowUpRight size={13} /></a>
        </aside>
      </section>
    </PageLayout>
  )
}

function PageLayout({ route, theme, toggleTheme, children }: { route: Route; theme: Theme; toggleTheme: () => void; children: ReactNode }) {
  return (
    <div className="plain-page">
      <MobileNav theme={theme} toggleTheme={toggleTheme} route={route} />
      <TopNav route={route} theme={theme} toggleTheme={toggleTheme} />
      <main className="plain-frame">{children}</main>
    </div>
  )
}

function NotFound({ route, theme, toggleTheme }: { route: Route; theme: Theme; toggleTheme: () => void }) {
  return (
    <PageLayout route={route} theme={theme} toggleTheme={toggleTheme}>
      <header className="plain-header">
        <p className="page-quote">a little off course.<span aria-hidden="true" /></p>
        <h1>Page not found</h1>
        <a className="back-to-projects" href="#/projects"><ArrowLeft size={15} /> Projects</a>
      </header>
    </PageLayout>
  )
}

export default function App() {
  const route = useRoute()
  const [theme, setTheme] = useState<Theme>(() => {
    try { return window.localStorage.getItem('theme') === 'light' ? 'light' : 'dark' } catch { return 'dark' }
  })
  useEffect(() => {
    try { window.localStorage.setItem('theme', theme) } catch { /* Storage may be unavailable. */ }
  }, [theme])
  const toggleTheme = () => setTheme((current) => current === 'light' ? 'dark' : 'light')
  const project = route.startsWith('/projects/') ? projects.find((item) => item.slug === route.split('/')[2]) : undefined

  if (route === '/') return <div className={'site theme-' + theme}><HomePage route={route} theme={theme} toggleTheme={toggleTheme} /></div>
  if (route === '/projects') return <div className={'site theme-' + theme}><ProjectsPage route={route} theme={theme} toggleTheme={toggleTheme} /></div>
  if (route === '/contributions') return <div className={'site theme-' + theme}><ContributionsPage route={route} theme={theme} toggleTheme={toggleTheme} /></div>
  if (route === '/about') return <div className={'site theme-' + theme}><AboutPage route={route} theme={theme} toggleTheme={toggleTheme} /></div>
  if (project) return <div className={'site theme-' + theme}><ProjectPage project={project} route={route} theme={theme} toggleTheme={toggleTheme} /></div>
  return <div className={'site theme-' + theme}><NotFound route={route} theme={theme} toggleTheme={toggleTheme} /></div>
}
