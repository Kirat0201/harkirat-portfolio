import { useEffect, useState } from 'react'
import { ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Github, Linkedin, Moon, Sun } from 'lucide-react'
import OceanCanvas from '../ocean/OceanCanvas'
import { contributions, projects, type Project } from '../data/projects'

type Theme = 'light' | 'dark'
const profileLinks = { github: 'https://github.com/Kirat0201', linkedin: 'https://linkedin.com/in/harkiratsingh01/' }
const readRoute = () => window.location.hash.replace(/^#/, '') || '/'

function useRoute() {
  const [route, setRoute] = useState(readRoute)
  useEffect(() => {
    const sync = () => setRoute(readRoute())
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])
  useEffect(() => window.scrollTo({ top: 0, behavior: 'auto' }), [route])
  return route
}

function ProjectArt({ project }: { project: Project }) {
  return (
    <div className={`project-art art-${project.visual}`} aria-hidden="true">
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
      <span className="art-index">{project.slug === 'recruitsage' ? '01' : project.slug === 'induss' ? '02' : project.slug === 'mathdotconnect' ? '03' : '04'}</span>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <a className="project-card-link" href={`#/projects/${project.slug}`} aria-label={`Read the ${project.name} case study`}>
        <ProjectArt project={project} />
        <div className="project-card-copy">
          <div className="project-card-meta"><span>{project.type}</span><span>{project.year}</span></div>
          <h3>{project.name}<ArrowUpRight size={17} /></h3>
          <p>{project.description}</p>
          <div className="tags">{project.stack.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
      </a>
    </article>
  )
}

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{copy && <p className="section-heading-copy">{copy}</p>}</div>
}

function HomePage({ theme, toggleTheme }: { theme: Theme; toggleTheme: () => void }) {
  return <>
    <section className="hero" aria-labelledby="hero-title">
      <OceanCanvas theme={theme} />
      <div className="hero-wash" />
      <div className="hero-copy wrap">
        <p className="hero-kicker"><span className="status-dot" /> building at the intersection of systems and stories</p>
        <h1 id="hero-title">Curiosity,<br /><em>made useful.</em></h1>
        <p className="hero-intro">I’m Kirat Singh. I build thoughtful software across AI, research systems, and developer tools.</p>
        <div className="hero-actions"><a className="button button-dark" href="#/projects">Explore projects <ArrowDownRight size={16} /></a><a className="text-link" href={profileLinks.linkedin} target="_blank" rel="noreferrer">Let’s connect <ArrowUpRight size={15} /></a></div>
      </div>
      <div className="hero-note"><span>01 / 04</span><span>an interactive koi pond</span><ArrowDown size={14} /></div>
      <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button>
    </section>
    <section className="section wrap" id="selected-work">
      <SectionHeading eyebrow="Selected work · 2025—26" title="Things I’ve been building" copy="A few projects where research, careful systems, and useful interfaces meet." />
      <div className="project-grid">{projects.map((project) => <ProjectCard project={project} key={project.slug} />)}</div>
      <div className="section-end"><span>More context, decisions, and implementation notes inside each project.</span><a href="#/projects">All projects <ArrowRight size={15} /></a></div>
    </section>
    <section className="interlude"><div className="wrap interlude-inner"><p className="eyebrow">A small note on how I work</p><p className="interlude-copy">I like early product stages, close feedback loops, and work that moves between <em>the user problem</em> and <em>the underlying system.</em></p><a href="#/about">A little more about me <ArrowUpRight size={15} /></a></div></section>
    <section className="section wrap contribution-teaser"><SectionHeading eyebrow="Open source · Claude-Mem" title="Work that travels upstream" copy="I contribute reliability, security, and performance fixes to an open-source memory system for coding agents." /><a href="#/contributions" className="outline-link">See contributions <ArrowUpRight size={15} /></a></section>
  </>
}

function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <div className="page-intro wrap"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{copy}</p></div>
}

function ProjectsPage() {
  return <><PageIntro eyebrow="Selected work · 2025—26" title="Projects" copy="A closer look at the questions, decisions, and systems behind the work." /><section className="wrap page-section"><div className="project-grid">{projects.map((project) => <ProjectCard project={project} key={project.slug} />)}</div></section></>
}

function ProjectPage({ project }: { project: Project }) {
  return <>
    <section className="case-hero wrap"><a className="back-link" href="#/projects"><ArrowLeft size={15} /> All projects</a><p className="eyebrow">{project.type} <span className="eyebrow-divider">/</span> {project.year}</p><h1>{project.name}</h1><p className="case-lede">{project.description}</p><ProjectArt project={project} /><div className="case-links">{project.repository ? <a className="outline-link" href={project.repository} target="_blank" rel="noreferrer">View source <ArrowUpRight size={15} /></a> : <span className="private-note">Private project · source not public</span>}<span>{project.stack.join(' · ')}</span></div></section>
    <section className="wrap case-body"><div className="case-block"><p className="eyebrow">The problem</p><p className="case-paragraph">{project.problem}</p></div><div className="case-block"><p className="eyebrow">The approach</p><div className="approach-list">{project.approach.map((item, index) => <div className="approach-item" key={item}><span>0{index + 1}</span><p>{item}</p></div>)}</div></div><div className="case-block case-stack"><p className="eyebrow">Tools and technologies</p><div className="tags">{project.stack.map((item) => <span key={item}>{item}</span>)}</div></div></section>
    <section className="case-next wrap"><span className="eyebrow">Keep exploring</span><a href={`#/projects/${projects[(projects.findIndex((item) => item.slug === project.slug) + 1) % projects.length].slug}`}>Next project <ArrowRight size={16} /></a></section>
  </>
}

function ContributionsPage() {
  return <><PageIntro eyebrow="Open source · upstream contributions" title="Build in the open." copy="I contribute to Claude-Mem, an open-source memory system for coding agents. My recent work focuses on observer reliability, safer worker communication, and keeping the interface responsive." /><section className="wrap page-section"><div className="contribution-header"><div><p className="eyebrow">Claude-Mem</p><h2>Small fixes, real systems.</h2></div><a className="outline-link" href="https://github.com/thedotmack/claude-mem" target="_blank" rel="noreferrer">Project source <ArrowUpRight size={15} /></a></div><div className="contribution-list">{contributions.map((item, index) => <article className="contribution-row" key={item.url}><span className="contribution-index">0{index + 1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div><a href={item.url} target="_blank" rel="noreferrer" aria-label={`View merged pull request: ${item.title}`}>{item.status} <ArrowUpRight size={14} /></a></article>)}</div></section></>
}

function AboutPage() {
  return <><PageIntro eyebrow="A bit about me" title="Good work starts with a useful question." copy="I’m Kirat Singh, a computer science student at Thapar Institute of Engineering and Technology. I enjoy building software that makes complex work easier to inspect and act on." /><section className="wrap about-layout"><div className="about-main"><p className="eyebrow">What I’m drawn to</p><p className="about-statement">Early product stages. Clear ownership. Fast feedback. The satisfying middle ground where a real user problem meets a well-designed system.</p><p>I’ve worked across AI integrations, financial research tools, security utilities, and learning interfaces. Along the way, I’ve contributed improvements to open-source projects including Claude-Mem.</p></div><aside className="about-aside"><p className="eyebrow">Elsewhere</p><a href={profileLinks.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={14} /></a><a href={profileLinks.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn <ArrowUpRight size={14} /></a><a href="#/projects">Browse selected work <ArrowUpRight size={14} /></a></aside></section></>
}

function NotFound() {
  return <div className="not-found wrap"><p className="eyebrow">A little off course</p><h1>That page isn’t here.</h1><a className="outline-link" href="#/projects">Back to projects <ArrowLeft size={15} /></a></div>
}

export default function App() {
  const route = useRoute()
  const [theme, setTheme] = useState<Theme>(() => {
    try { return window.localStorage.getItem('theme') === 'light' ? 'light' : 'dark' } catch { return 'dark' }
  })
  useEffect(() => { try { window.localStorage.setItem('theme', theme) } catch { /* Storage may be unavailable. */ } }, [theme])
  const toggleTheme = () => setTheme((current) => current === 'light' ? 'dark' : 'light')
  const project = route.startsWith('/projects/') ? projects.find((item) => item.slug === route.split('/')[2]) : undefined
  const page = route === '/' ? 'home' : route.split('/')[1]

  return <main className={`site theme-${theme}`}>
    <header className="topbar wrap"><a className="wordmark" href="#/" aria-label="Kirat Singh home">KS<span>.</span></a><nav className="navigation" aria-label="Main navigation"><a className={page === 'projects' ? 'active' : ''} href="#/projects">Projects</a><a className={page === 'contributions' ? 'active' : ''} href="#/contributions">Open source</a><a className={page === 'about' ? 'active' : ''} href="#/about">About</a><a className="nav-contact" href={profileLinks.linkedin} target="_blank" rel="noreferrer">Contact <ArrowUpRight size={13} /></a></nav></header>
    {route === '/' ? <HomePage theme={theme} toggleTheme={toggleTheme} /> : route === '/projects' ? <ProjectsPage /> : route === '/contributions' ? <ContributionsPage /> : route === '/about' ? <AboutPage /> : project ? <ProjectPage project={project} /> : <NotFound />}
    <footer className="footer"><div className="wrap footer-inner"><a className="wordmark" href="#/">KS<span>.</span></a><span>Made slowly, with curiosity.</span><div><a href={profileLinks.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a><a href={profileLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={13} /></a></div><span className="footer-year">© 2026</span></div></footer>
  </main>
}
