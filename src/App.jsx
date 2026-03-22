import './App.css'

import { ArrowRight, Menu, X } from 'lucide-react'
import { animate, stagger } from 'motion'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom'

import EditorPanel, { EditorLoginModal } from './components/EditorPanel'
import {
  defaultSiteSettings,
  footerNav,
  heroFallbackImage,
  navLinks,
} from './content/defaultContent'
import { useCmsContent } from './hooks/useCmsContent'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const useScrollThreshold = (threshold = 40) => {
  const [past, setPast] = useState(false)
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return past
}

const useHeroEnterAnimation = () => {
  const ref = useRef(null)
  useEffect(() => {
    if (prefersReducedMotion()) return
    const root = ref.current
    if (!root) return
    const items = root.querySelectorAll('[data-hero]')
    if (!items.length) return
    animate(
      items,
      { opacity: [0, 1], transform: ['translateY(24px)', 'translateY(0px)'] },
      { duration: 0.9, delay: stagger(0.15), easing: 'ease-out' }
    )
  }, [])
  return ref
}

const useReveal = (options) => {
  const ref = useRef(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return

    const hash = window.location.hash?.slice(1)
    const hashTarget = hash ? node.querySelector(`[id="${hash}"]`) : null
    if (prefersReducedMotion() || hashTarget) {
      node.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible')
          observer.unobserve(node)
        }
      },
      options ?? { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [options])
  return ref
}

const useMobileMenu = () => {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen((state) => !state)
  const close = () => setOpen(false)
  return { open, toggle, close }
}

const Reveal = memo(function Reveal({ as = 'section', className = '', children, options }) {
  const ref = useReveal(options)
  const Component = as
  return (
    <Component ref={ref} className={`reveal ${className}`.trim()}>
      {children}
    </Component>
  )
})

const Header = ({ menu, compact, links, isHome }) => (
  <header
    className={`site-header${compact ? ' is-compact' : ''}`}
    style={{ zIndex: menu.open ? 40 : 10 }}
  >
    <button
      className="menu-toggle"
      onClick={menu.toggle}
      aria-label={menu.open ? 'Close menu' : 'Open menu'}
    >
      {menu.open ? <X size={22} /> : <Menu size={22} />}
    </button>

    <div className="brand">
      {isHome ? (
        <img
          src="/Torekull_logo_new2.png"
          alt="Torekull"
          className="brand-logo"
        />
      ) : (
        <Link to="/" className="brand-link">
          <img
            src="/Torekull_logo_new2.png"
            alt="Torekull"
            className="brand-logo"
          />
        </Link>
      )}
    </div>

    <nav className="nav-links" aria-label="Main navigation">
      {links.map((link) => (
        <Link key={link.href} to={isHome ? link.href : `/${link.href}`}>
          {link.label}
        </Link>
      ))}
    </nav>
  </header>
)

const MobileMenu = ({ open, onClose, links, isHome, siteSettings, onLogin, onLogout, canEdit, isSupabaseConfigured }) => (
  <div className={`mobile-menu-overlay${open ? ' show' : ''}`}>
    <nav className="mobile-nav-links" aria-label="Mobile navigation">
      <span className="mobile-nav-label">Menu</span>
      {links.map((link) => (
        <Link
          key={link.href}
          to={isHome ? link.href : `/${link.href}`}
          onClick={onClose}
        >
          {link.label}
        </Link>
      ))}
      {isSupabaseConfigured && (
        canEdit ? (
          <button type="button" className="mobile-nav-auth-btn" onClick={() => { onLogout(); onClose() }}>
            Log out
          </button>
        ) : (
          <button type="button" className="mobile-nav-auth-btn" onClick={() => { onLogin(); onClose() }}>
            Login
          </button>
        )
      )}
    </nav>
    <div className="mobile-menu-footer">
      <div>
        {siteSettings.contactAddress.split('\n').map((line) => (
          <p key={`address-${line}`}>{line}</p>
        ))}
      </div>
      <div>
        <p>{siteSettings.contactEmail}</p>
        <p>{siteSettings.contactPhone}</p>
      </div>
    </div>
  </div>
)

const Hero = ({ settings }) => {
  const heroRef = useHeroEnterAnimation()

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-image-wrap" data-hero>
        <img src={heroFallbackImage} alt="3Sixty Skybar interior" className="hero-image" />
      </div>

      <h1 className="hero-statement" data-hero>
        <span className="hero-line">{settings.heroLine1}</span>
        <span className="hero-line">{settings.heroLine2}</span>
      </h1>

      <a className="hero-cta" href="#projects" data-hero>
        {settings.heroCtaLabel} <ArrowRight size={14} />
      </a>
    </section>
  )
}

const AwardsSection = ({ items, settings }) => (
  <Reveal className="awards-strip" as="section">
    <p className="awards-tagline">{settings.awardsTagline}</p>
    <div className="awards-badges">
      {items.map((award) => (
        <figure className="award-badge" key={`${award.year}-${award.src}`}>
          <img src={award.src} alt={award.label} loading="lazy" />
          <figcaption>{award.year}</figcaption>
        </figure>
      ))}
    </div>
  </Reveal>
)

const ProjectsSection = ({ items }) => (
  <Reveal className="projects" as="section">
    <div className="project-grid" id="projects">
      {items.map((project) => (
        <article className="project-card" key={project.slug}>
          <Link className="project-card-link" to={`/projects/${project.slug}`}>
            <div
              className="project-thumb"
              style={{ backgroundImage: `url(${project.cover})` }}
            >
              <span className="thumb-title">{project.title}</span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  </Reveal>
)

const PhilosophySection = ({ settings }) => (
  <Reveal className="philosophy" as="section">
    <div className="philosophy-inner">
      <div className="philosophy-text">
        <h2 id="studio">{settings.studioTitle}</h2>
        <blockquote className="philosophy-quote">{settings.studioQuote}</blockquote>
        <p className="philosophy-sub">{settings.studioSub}</p>
      </div>
      <div className="philosophy-snapshot">
        <div className="snapshot-item">
          <h4>Disciplines</h4>
          <p>{settings.disciplines}</p>
        </div>
        <div className="snapshot-item">
          <h4>Sectors</h4>
          <p>{settings.sectors}</p>
        </div>
        <div className="snapshot-item">
          <h4>Locations</h4>
          <p>{settings.locations}</p>
        </div>
      </div>
    </div>
  </Reveal>
)

const PressSection = ({ items, settings }) => {
  const [activePress, setActivePress] = useState(null)

  useEffect(() => {
    if (!activePress) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setActivePress(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activePress])

  return (
    <>
      <Reveal className="press" as="section">
        <div className="section-head">
          <h2 id="press">{settings.pressTitle}</h2>
          <p>{settings.pressSubtitle}</p>
        </div>
        <div className="press-grid">
          {items.map((press) => (
            <button
              className="press-card"
              key={`${press.title}-${press.image}`}
              type="button"
              aria-label={`Open ${press.title}`}
              title={press.title}
              onClick={() => setActivePress(press)}
            >
              <img src={press.image} alt={press.title} loading="lazy" />
            </button>
          ))}
        </div>
      </Reveal>

      {activePress &&
        createPortal(
          <div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={activePress.title}
            onClick={() => setActivePress(null)}
          >
            <figure className="lightbox-content" onClick={(event) => event.stopPropagation()}>
              <button
                className="lightbox-close"
                type="button"
                aria-label="Close image preview"
                onClick={() => setActivePress(null)}
              >
                x
              </button>
              <img src={activePress.image} alt={activePress.title} />
              <figcaption>{activePress.title}</figcaption>
            </figure>
          </div>,
          document.body
        )}
    </>
  )
}

const ContactSection = ({ settings }) => {
  const handleSubmit = (event) => {
    event.preventDefault()
  }

  const emailHref = settings.contactEmail ? `mailto:${settings.contactEmail}` : '#'
  const phoneHref = settings.contactPhone
    ? `tel:${settings.contactPhone.replace(/[^\d+]/g, '')}`
    : '#'

  return (
    <Reveal className="contact" as="section">
      <div className="section-head">
        <h2 id="contact">{settings.contactTitle}</h2>
        <p>{settings.contactSubtitle}</p>
        <p className="contact-note">{settings.contactNote}</p>
      </div>

      <div className="contact-grid">
        <div className="contact-left">
          <address className="contact-info">
            <div className="contact-detail">
              <h4>{settings.visitLabel}</h4>
              <p>
                {settings.contactAddress.split('\n').map((line) => (
                  <span key={`line-${line}`}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>
            <div className="contact-detail">
              <h4>{settings.emailLabel}</h4>
              <a href={emailHref}>{settings.contactEmail}</a>
            </div>
            <div className="contact-detail">
              <h4>{settings.phoneLabel}</h4>
              <a href={phoneHref}>{settings.contactPhone}</a>
            </div>
          </address>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="c-name">Name</label>
            <input id="c-name" type="text" name="name" placeholder="Your full name" required />
          </div>
          <div className="form-group">
            <label htmlFor="c-email">Email</label>
            <input
              id="c-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group form-full">
            <label htmlFor="c-message">Message</label>
            <textarea
              id="c-message"
              name="message"
              rows="5"
              placeholder="Tell us about your project - timeline, location and scope."
              required
            />
          </div>
          <button className="form-submit" type="submit">
            Send Message <ArrowRight size={14} />
          </button>
        </form>

        <div className="contact-map">
          <iframe
            title="Torekull Office Location"
            src={settings.mapEmbedUrl || defaultSiteSettings.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </Reveal>
  )
}

const Footer = ({ isHome, settings }) => (
  <footer className="site-footer">
    <p className="footer-copy">&copy; {settings.footerCopy}</p>
    <nav className="footer-links" aria-label="Footer navigation">
      {footerNav.map((link) =>
        link.external ? (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
          </a>
        ) : (
          <Link key={link.href} to={isHome ? link.href : `/${link.href}`}>
            {link.label}
          </Link>
        )
      )}
    </nav>
  </footer>
)

const ProjectPage = ({ items }) => {
  const { slug } = useParams()
  const project = useMemo(() => items.find((entry) => entry.slug === slug), [items, slug])
  const galleryImages = project?.gallery?.length ? project.gallery : []
  const heroImage = project?.cover || galleryImages[0]
  const detailImages = galleryImages.filter(
    (image, index) => !(index === 0 && image === heroImage)
  )

  if (!project) {
    return (
      <section className="project-page">
        <div className="project-page-inner">
          <div className="project-page-topbar">
            <Link className="project-back" to="/#projects">
              Back to projects
            </Link>
            <Link className="project-close" to="/#projects" aria-label="Close">
              <X size={18} />
            </Link>
          </div>
          <p>Project not found.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="project-page">
      <div className="project-page-inner">
        <div className="project-page-topbar">
          <Link className="project-back" to="/#projects">
            Back to projects
          </Link>
          <Link className="project-close" to="/#projects" aria-label="Close">
            <X size={18} />
          </Link>
        </div>

        {heroImage ? (
          <figure className={`project-page-hero ${project.tone}`}>
            <img src={heroImage} alt={`${project.title} hero`} />
          </figure>
        ) : null}

        <section className="project-page-intro">
          <div className="project-page-facts">
            <h1>{project.title}</h1>

            <div className="project-page-meta-lines">
              <p>
                <span>Location:</span> {project.location}
              </p>
              <p>
                <span>Project completion:</span> {project.completion}
              </p>
              {project.website ? (
                <p>
                  <span>Website:</span>{' '}
                  <a href={project.website} target="_blank" rel="noreferrer">
                    {project.website}
                  </a>
                </p>
              ) : null}
              {project.photo ? (
                <p>
                  <span>Photographer:</span> {project.photo}
                </p>
              ) : null}
              {project.via ? (
                <p>
                  <span>Partner:</span> {project.via}
                </p>
              ) : null}
            </div>

            {project.credits.length > 0 ? (
              <details className="project-credits-toggle">
                <summary className="project-credits-summary">Credits</summary>
                <div className="project-credits-panel">
                  {project.credits.map((credit) => (
                    <p key={`${project.slug}-${credit.label}`}>
                      <span>{credit.label}:</span> {credit.value}
                    </p>
                  ))}
                </div>
              </details>
            ) : null}
          </div>

          <div className="project-page-description-wrap">
            <p className="project-page-description">{project.description}</p>
          </div>
        </section>

        {detailImages.length > 0 ? (
          <div className="project-gallery">
            {detailImages.map((image, index) => (
              <figure key={`${project.slug}-gallery-${index}`}>
                <img src={image} alt={`${project.title} gallery ${index + 1}`} loading="lazy" />
              </figure>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

const ScrollToHash = () => {
  const location = useLocation()
  useEffect(() => {
    const scrollToTarget = () => {
      if (location.hash) {
        const target = document.querySelector(location.hash)
        if (target) {
          const headerOffset = window.innerWidth <= 839 ? 70 : 96
          const targetTop =
            target.getBoundingClientRect().top + window.pageYOffset - headerOffset
          window.scrollTo({
            top: Math.max(0, targetTop),
            left: 0,
            behavior: 'smooth',
          })
          return
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }

    const raf = requestAnimationFrame(scrollToTarget)
    return () => cancelAnimationFrame(raf)
  }, [location.pathname, location.hash])
  return null
}

const HomePage = ({ content, onOpenLogin, onSignOut, isSupabaseConfigured, canEdit }) => {
  const menu = useMobileMenu()
  const isCompact = useScrollThreshold(40)
  return (
    <div className={`page${menu.open ? ' menu-open' : ''}`}>
      <Header menu={menu} compact={isCompact} links={navLinks} isHome />
      <MobileMenu
        open={menu.open}
        onClose={menu.close}
        links={navLinks}
        isHome
        siteSettings={content.siteSettings}
        onLogin={onOpenLogin}
        onLogout={onSignOut}
        canEdit={canEdit}
        isSupabaseConfigured={isSupabaseConfigured}
      />

      <main>
        <Hero settings={content.siteSettings} />
        <AwardsSection items={content.awards} settings={content.siteSettings} />
        <ProjectsSection items={content.projects} />
        <PhilosophySection settings={content.siteSettings} />
        <PressSection items={content.pressItems} settings={content.siteSettings} />
        <ContactSection settings={content.siteSettings} />
      </main>

      <Footer
        isHome
        settings={content.siteSettings}
      />
    </div>
  )
}

const ProjectLayout = ({ content, onOpenLogin, onSignOut, isSupabaseConfigured, canEdit }) => {
  const menu = useMobileMenu()
  const isCompact = useScrollThreshold(40)

  return (
    <div className={`page${menu.open ? ' menu-open' : ''}`}>
      <Header menu={menu} compact={isCompact} links={navLinks} isHome={false} />
      <MobileMenu
        open={menu.open}
        onClose={menu.close}
        links={navLinks}
        isHome={false}
        siteSettings={content.siteSettings}
        onLogin={onOpenLogin}
        onLogout={onSignOut}
        canEdit={canEdit}
        isSupabaseConfigured={isSupabaseConfigured}
      />
      <main>
        <ProjectPage items={content.projects} />
      </main>
      <Footer
        isHome={false}
        settings={content.siteSettings}
      />
    </div>
  )
}

const EditorFab = ({
  userEmail,
  canEdit,
  onToggleEditor,
  editorOpen,
  onSignOut,
  syncError,
}) => {
  if (!canEdit) return null

  return (
    <div className="editor-fab">
      <button type="button" onClick={onToggleEditor}>
        {editorOpen ? 'Close Editor' : 'Edit Content'}
      </button>
      <button type="button" className="editor-secondary" onClick={onSignOut}>
        Log out
      </button>
      {userEmail ? <p>{userEmail}</p> : null}
      {syncError ? <p className="editor-fab-error">{syncError}</p> : null}
    </div>
  )
}

function App() {
  const [editorOpen, setEditorOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const cms = useCmsContent()

  const handleLogin = useCallback(
    async (email, password) => {
      setLoginLoading(true)
      setLoginError('')
      const result = await cms.signInWithPassword(email, password)
      setLoginLoading(false)
      if (!result.ok) {
        setLoginError(result.error || 'Login failed.')
        return
      }
      setLoginOpen(false)
    },
    [cms]
  )

  return (
    <>
      <BrowserRouter>
        <ScrollToHash />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                content={cms.content}
                onOpenLogin={() => setLoginOpen(true)}
                onSignOut={cms.signOut}
                isSupabaseConfigured={cms.isSupabaseConfigured}
                canEdit={cms.canEdit}
              />
            }
          />
          <Route
            path="/projects/:slug"
            element={
              <ProjectLayout
                content={cms.content}
                onOpenLogin={() => setLoginOpen(true)}
                onSignOut={cms.signOut}
                isSupabaseConfigured={cms.isSupabaseConfigured}
                canEdit={cms.canEdit}
              />
            }
          />
        </Routes>

        <EditorFab
          userEmail={cms.userEmail}
          canEdit={cms.canEdit}
          onToggleEditor={() => setEditorOpen((value) => !value)}
          editorOpen={editorOpen}
          onSignOut={cms.signOut}
          syncError={cms.syncError}
        />

        <EditorLoginModal
          open={loginOpen && !cms.canEdit}
          onClose={() => {
            setLoginOpen(false)
            setLoginError('')
          }}
          onSubmit={handleLogin}
          loading={loginLoading}
          error={loginError}
        />

        {cms.canEdit ? (
          <EditorPanel
            open={editorOpen}
            onClose={() => setEditorOpen(false)}
            siteSettings={cms.content.siteSettings}
            projects={cms.content.projects}
            pressItems={cms.content.pressItems}
            onSaveSiteSettings={cms.saveSiteSettings}
            onSaveProject={cms.saveProject}
            onDeleteProject={cms.deleteProject}
            onSavePressItem={cms.savePressItem}
            onDeletePressItem={cms.deletePressItem}
            onReorderProjects={cms.reorderProjects}
            onReorderPressItems={cms.reorderPressItems}
            onUploadImage={cms.uploadImage}
            onReload={cms.reloadContent}
            saving={cms.saving}
          />
        ) : null}
      </BrowserRouter>
    </>
  )
}

export default App
