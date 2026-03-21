import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  LIMITS,
  creditsToText,
  galleryToText,
  parseCreditsFromText,
  parseGalleryFromText,
} from '../lib/contentGuards'

const useAutosave = (items, onSave, delay = 1200, transform) => {
  const timerRef = useRef(null)
  const prevMapRef = useRef(new Map())

  useEffect(() => {
    const changed = []
    const newMap = new Map()
    items.forEach((item) => {
      if (!item.id) return
      const serialized = JSON.stringify(item)
      newMap.set(item.id, serialized)
      if (prevMapRef.current.get(item.id) !== serialized) {
        changed.push(item)
      }
    })

    if (changed.length === 0) {
      prevMapRef.current = newMap
      return
    }

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      prevMapRef.current = newMap
      changed.forEach((item) => {
        onSave(transform ? transform(item) : item)
      })
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [items, onSave, delay, transform])
}

const makeDraftProject = (project) => ({
  id: project.id,
  title: project.title || '',
  slug: project.slug || '',
  location: project.location || '',
  completion: project.completion || '',
  website: project.website || '',
  photo: project.photo || '',
  via: project.via || '',
  description: project.description || '',
  cover: project.cover || '',
  galleryText: galleryToText(project.gallery),
  creditsText: creditsToText(project.credits),
  tone: project.tone || 'tone-warm',
  sortOrder: project.sortOrder ?? 0,
  isPublished: project.isPublished ?? true,
})

const makeDraftPress = (item) => ({
  id: item.id,
  title: item.title || '',
  image: item.image || '',
  sortOrder: item.sortOrder ?? 0,
  isPublished: item.isPublished ?? true,
})

const EmptyProject = (sortOrder = 0) => ({
  id: undefined,
  title: '',
  slug: '',
  location: '',
  completion: '',
  website: '',
  photo: '',
  via: '',
  description: '',
  cover: '',
  galleryText: '',
  creditsText: '',
  tone: 'tone-warm',
  sortOrder,
  isPublished: true,
})

const EmptyPress = (sortOrder = 0) => ({
  id: undefined,
  title: '',
  image: '',
  sortOrder,
  isPublished: true,
})

const UploadButton = ({ onUpload, folder, disabled, label = 'Upload image' }) => {
  const [uploading, setUploading] = useState(false)

  const handleChange = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setUploading(true)
    await onUpload(file, folder)
    setUploading(false)
  }

  return (
    <label className="editor-upload-btn">
      {uploading ? 'Uploading...' : label}
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={disabled || uploading}
      />
    </label>
  )
}

const Chevron = ({ open }) => (
  <svg
    className={`editor-chevron${open ? ' open' : ''}`}
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const GripIcon = () => (
  <svg
    className="editor-grip"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="5" r="1" /><circle cx="15" cy="5" r="1" />
    <circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" />
    <circle cx="9" cy="19" r="1" /><circle cx="15" cy="19" r="1" />
  </svg>
)

const useDragReorder = (setDrafts, onReorder) => {
  const dragIndex = { current: null }

  const onDragStart = (index) => (event) => {
    dragIndex.current = index
    event.dataTransfer.effectAllowed = 'move'
    event.currentTarget.closest('.editor-card').classList.add('dragging')
  }

  const onDragOver = (index) => (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    const cards = event.currentTarget.closest('.editor-list')?.querySelectorAll('.editor-card')
    cards?.forEach((card, i) => {
      card.classList.toggle('drag-over', i === index && i !== dragIndex.current)
    })
  }

  const onDragEnd = (event) => {
    event.currentTarget.closest('.editor-card')?.classList.remove('dragging')
    const cards = event.currentTarget.closest('.editor-list')?.querySelectorAll('.editor-card')
    cards?.forEach((card) => card.classList.remove('drag-over'))
  }

  const onDrop = (toIndex) => (event) => {
    event.preventDefault()
    const fromIndex = dragIndex.current
    if (fromIndex === null || fromIndex === toIndex) return
    setDrafts((prev) => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      const reordered = next.map((item, i) => ({ ...item, sortOrder: (i + 1) * 10 }))
      if (onReorder) onReorder(reordered)
      return reordered
    })
    dragIndex.current = null
  }

  return { onDragStart, onDragOver, onDragEnd, onDrop }
}

const EditorSection = ({ title, description, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="editor-section">
      <button
        type="button"
        className="editor-section-toggle"
        onClick={() => setOpen((prev) => !prev)}
      >
        <h3>{title}</h3>
        <Chevron open={open} />
      </button>
      {open && (
        <>
          {description ? <p className="editor-section-desc">{description}</p> : null}
          <div className="editor-section-body">{children}</div>
        </>
      )}
    </section>
  )
}

const CollapsibleCard = ({ label, defaultOpen = false, dragHandleProps, children }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <>
      <div className="editor-card-toggle-row">
        {dragHandleProps && (
          <span
            className="editor-drag-handle"
            draggable
            onDragStart={dragHandleProps.onDragStart}
            onDragEnd={dragHandleProps.onDragEnd}
          >
            <GripIcon />
          </span>
        )}
        <button
          type="button"
          className="editor-card-toggle"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="editor-card-toggle-label">{label}</span>
          <Chevron open={open} />
        </button>
      </div>
      {open && children}
    </>
  )
}

const Field = ({ label, children }) => (
  <label className="editor-field">
    <span>{label}</span>
    {children}
  </label>
)

export const EditorLoginModal = ({
  open,
  onClose,
  onSubmit,
  loading,
  error,
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  if (!open) return null

  return (
    <div className="editor-auth-overlay" onClick={onClose}>
      <form
        className="editor-auth-modal"
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit(email, password)
        }}
      >
        <h3>Editor Login</h3>
        <p>Sign in with email and password.</p>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@studio.com"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          required
        />
        {error ? <p className="editor-status is-error">{error}</p> : null}
        <div className="editor-auth-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </form>
    </div>
  )
}

const SiteSettingsForm = ({ draft, setDraft, onSave, saving }) => (
  <EditorSection
    title="Section Text"
    description="All section titles and key text content. Limits are enforced to protect layout."
  >
    <div className="editor-grid two">
      <Field label="Hero line 1">
        <input
          maxLength={LIMITS.heroLine}
          value={draft.heroLine1}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, heroLine1: event.target.value }))
          }
        />
      </Field>
      <Field label="Hero line 2">
        <input
          maxLength={LIMITS.heroLine}
          value={draft.heroLine2}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, heroLine2: event.target.value }))
          }
        />
      </Field>
      <Field label="Hero CTA">
        <input
          maxLength={LIMITS.heroCta}
          value={draft.heroCtaLabel}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, heroCtaLabel: event.target.value }))
          }
        />
      </Field>
      <Field label="Awards tagline">
        <input
          maxLength={LIMITS.shortBody}
          value={draft.awardsTagline}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, awardsTagline: event.target.value }))
          }
        />
      </Field>
      <Field label="Studio title">
        <input
          maxLength={LIMITS.sectionTitle}
          value={draft.studioTitle}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, studioTitle: event.target.value }))
          }
        />
      </Field>
      <Field label="Studio quote">
        <textarea
          maxLength={LIMITS.body}
          rows={3}
          value={draft.studioQuote}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, studioQuote: event.target.value }))
          }
        />
      </Field>
      <Field label="Studio sub text">
        <input
          maxLength={LIMITS.shortBody}
          value={draft.studioSub}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, studioSub: event.target.value }))
          }
        />
      </Field>
      <Field label="Disciplines">
        <input
          maxLength={LIMITS.shortBody}
          value={draft.disciplines}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, disciplines: event.target.value }))
          }
        />
      </Field>
      <Field label="Sectors">
        <input
          maxLength={LIMITS.shortBody}
          value={draft.sectors}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, sectors: event.target.value }))
          }
        />
      </Field>
      <Field label="Locations">
        <input
          maxLength={LIMITS.metaValue}
          value={draft.locations}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, locations: event.target.value }))
          }
        />
      </Field>
      <Field label="Press title">
        <input
          maxLength={LIMITS.sectionTitle}
          value={draft.pressTitle}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, pressTitle: event.target.value }))
          }
        />
      </Field>
      <Field label="Press subtitle">
        <input
          maxLength={LIMITS.shortBody}
          value={draft.pressSubtitle}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, pressSubtitle: event.target.value }))
          }
        />
      </Field>
      <Field label="Contact title">
        <input
          maxLength={LIMITS.sectionTitle}
          value={draft.contactTitle}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, contactTitle: event.target.value }))
          }
        />
      </Field>
      <Field label="Contact subtitle">
        <input
          maxLength={LIMITS.shortBody}
          value={draft.contactSubtitle}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, contactSubtitle: event.target.value }))
          }
        />
      </Field>
      <Field label="Contact note">
        <textarea
          maxLength={LIMITS.shortBody}
          rows={2}
          value={draft.contactNote}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, contactNote: event.target.value }))
          }
        />
      </Field>
      <Field label="Visit label">
        <input
          maxLength={LIMITS.metaValue}
          value={draft.visitLabel}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, visitLabel: event.target.value }))
          }
        />
      </Field>
      <Field label="Address (line breaks supported)">
        <textarea
          maxLength={LIMITS.address}
          rows={3}
          value={draft.contactAddress}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, contactAddress: event.target.value }))
          }
        />
      </Field>
      <Field label="Email label">
        <input
          maxLength={LIMITS.metaValue}
          value={draft.emailLabel}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, emailLabel: event.target.value }))
          }
        />
      </Field>
      <Field label="Contact email">
        <input
          maxLength={LIMITS.metaValue}
          value={draft.contactEmail}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, contactEmail: event.target.value }))
          }
        />
      </Field>
      <Field label="Phone label">
        <input
          maxLength={LIMITS.metaValue}
          value={draft.phoneLabel}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, phoneLabel: event.target.value }))
          }
        />
      </Field>
      <Field label="Contact phone">
        <input
          maxLength={LIMITS.metaValue}
          value={draft.contactPhone}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, contactPhone: event.target.value }))
          }
        />
      </Field>
      <Field label="Map embed URL">
        <textarea
          maxLength={LIMITS.mapUrl}
          rows={2}
          value={draft.mapEmbedUrl}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, mapEmbedUrl: event.target.value }))
          }
        />
      </Field>
      <Field label="Footer copy">
        <textarea
          maxLength={LIMITS.footer}
          rows={2}
          value={draft.footerCopy}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, footerCopy: event.target.value }))
          }
        />
      </Field>
    </div>
    <button className="editor-save" type="button" onClick={onSave} disabled={saving}>
      {saving ? 'Saving...' : 'Save Section Text'}
    </button>
  </EditorSection>
)

const ProjectsForm = ({
  drafts,
  setDrafts,
  onSave,
  onDelete,
  onUploadImage,
  onReorder,
  saving,
}) => {
  const { onDragStart, onDragOver, onDragEnd, onDrop } = useDragReorder(setDrafts, onReorder)

  const transformProject = useCallback(
    (project) => ({
      ...project,
      gallery: parseGalleryFromText(project.galleryText),
      credits: parseCreditsFromText(project.creditsText),
    }),
    []
  )

  useAutosave(drafts, onSave, 1200, transformProject)

  const appendProject = () => {
    const currentMax = drafts.reduce(
      (max, item) => Math.max(max, Number(item.sortOrder) || 0),
      0
    )
    setDrafts((prev) => [...prev, EmptyProject(currentMax + 10)])
  }

  return (
    <EditorSection
      title="Projects"
      description="Add, edit, publish and reorder projects. Drag the grip handle to reorder."
    >
      <button className="editor-add" type="button" onClick={appendProject}>
        Add Project
      </button>
      <div className="editor-list">
        {drafts.map((project, index) => (
          <article
            className="editor-card"
            key={project.id ?? `new-project-${index}`}
            onDragOver={onDragOver(index)}
            onDrop={onDrop(index)}
          >
            <CollapsibleCard
              label={project.title || 'Untitled project'}
              defaultOpen={!project.id}
              dragHandleProps={{
                onDragStart: onDragStart(index),
                onDragEnd,
              }}
            >
            <div className="editor-grid two">
              <Field label="Title">
                <input
                  maxLength={LIMITS.projectTitle}
                  value={project.title}
                  onChange={(event) =>
                    setDrafts((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, title: event.target.value } : item
                      )
                    )
                  }
                />
              </Field>
              <Field label="Slug">
                <input
                  maxLength={LIMITS.slug}
                  value={project.slug}
                  onChange={(event) =>
                    setDrafts((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, slug: event.target.value } : item
                      )
                    )
                  }
                />
              </Field>
              <Field label="Location">
                <input
                  maxLength={LIMITS.location}
                  value={project.location}
                  onChange={(event) =>
                    setDrafts((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, location: event.target.value } : item
                      )
                    )
                  }
                />
              </Field>
              <Field label="Completion">
                <input
                  maxLength={LIMITS.completion}
                  value={project.completion}
                  onChange={(event) =>
                    setDrafts((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, completion: event.target.value } : item
                      )
                    )
                  }
                />
              </Field>
              <Field label="Website">
                <input
                  maxLength={LIMITS.website}
                  value={project.website}
                  onChange={(event) =>
                    setDrafts((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, website: event.target.value } : item
                      )
                    )
                  }
                />
              </Field>
              <Field label="Photographer">
                <input
                  maxLength={LIMITS.metaValue}
                  value={project.photo}
                  onChange={(event) =>
                    setDrafts((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, photo: event.target.value } : item
                      )
                    )
                  }
                />
              </Field>
              <Field label="Partner / via">
                <input
                  maxLength={LIMITS.metaValue}
                  value={project.via}
                  onChange={(event) =>
                    setDrafts((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, via: event.target.value } : item
                      )
                    )
                  }
                />
              </Field>
              <Field label="Sort order">
                <input
                  type="number"
                  value={project.sortOrder}
                  onChange={(event) =>
                    setDrafts((prev) =>
                      prev.map((item, i) =>
                        i === index
                          ? { ...item, sortOrder: Number(event.target.value || 0) }
                          : item
                      )
                    )
                  }
                />
              </Field>
              <div className="editor-cover-field">
                <span className="editor-field-label">Cover image</span>
                {project.cover && (
                  <div className="editor-cover-preview">
                    <img src={project.cover} alt="Cover" />
                  </div>
                )}
                <UploadButton
                  disabled={saving}
                  folder="projects/covers"
                  label={project.cover ? 'Replace image' : 'Upload image'}
                  onUpload={async (file, folder) => {
                    const result = await onUploadImage(file, folder)
                    if (!result.ok) return
                    setDrafts((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, cover: result.url } : item
                      )
                    )
                  }}
                />
              </div>
              <Field label="Description">
                <textarea
                  maxLength={LIMITS.projectDescription}
                  rows={4}
                  value={project.description}
                  onChange={(event) =>
                    setDrafts((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, description: event.target.value } : item
                      )
                    )
                  }
                />
              </Field>
              <Field label="Gallery images">
                {(() => {
                  const urls = project.galleryText
                    .split('\n')
                    .map((u) => u.trim())
                    .filter(Boolean)
                  return urls.length > 0 ? (
                    <div className="editor-gallery-thumbs">
                      {urls.map((url, urlIdx) => (
                        <div className="editor-gallery-thumb" key={`${url}-${urlIdx}`}>
                          <img src={url} alt={`Gallery ${urlIdx + 1}`} />
                          <button
                            type="button"
                            className="editor-gallery-remove"
                            title="Remove image"
                            onClick={() => {
                              const newUrls = urls.filter((_, i) => i !== urlIdx)
                              setDrafts((prev) =>
                                prev.map((item, i) =>
                                  i === index
                                    ? { ...item, galleryText: newUrls.join('\n') }
                                    : item
                                )
                              )
                            }}
                          >
                            &times;
                          </button>
                          <span className="editor-gallery-idx">{urlIdx + 1}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--muted)' }}>
                      No gallery images yet.
                    </p>
                  )
                })()}
                <details className="editor-gallery-urls">
                  <summary>Edit URLs</summary>
                  <textarea
                    rows={4}
                    value={project.galleryText}
                    onChange={(event) =>
                      setDrafts((prev) =>
                        prev.map((item, i) =>
                          i === index ? { ...item, galleryText: event.target.value } : item
                        )
                      )
                    }
                  />
                </details>
              </Field>
              <Field label="Credits (Label: Value per line)">
                <textarea
                  rows={4}
                  value={project.creditsText}
                  onChange={(event) =>
                    setDrafts((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, creditsText: event.target.value } : item
                      )
                    )
                  }
                />
              </Field>
              <Field label="Tone">
                <select
                  value={project.tone}
                  onChange={(event) =>
                    setDrafts((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, tone: event.target.value } : item
                      )
                    )
                  }
                >
                  <option value="tone-warm">Warm</option>
                  <option value="tone-ash">Ash</option>
                  <option value="tone-sand">Sand</option>
                  <option value="tone-ink">Ink</option>
                  <option value="tone-stone">Stone</option>
                </select>
              </Field>
              <Field label="Published">
                <select
                  value={project.isPublished ? 'yes' : 'no'}
                  onChange={(event) =>
                    setDrafts((prev) =>
                      prev.map((item, i) =>
                        i === index
                          ? { ...item, isPublished: event.target.value === 'yes' }
                          : item
                      )
                    )
                  }
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </Field>
            </div>
            <div className="editor-card-actions">
              {!project.id ? (
                <>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      onSave({
                        ...project,
                        gallery: parseGalleryFromText(project.galleryText),
                        credits: parseCreditsFromText(project.creditsText),
                      })
                    }
                  >
                    Create Project
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() =>
                      setDrafts((prev) => prev.filter((_, i) => i !== index))
                    }
                  >
                    Discard
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="danger"
                  disabled={saving}
                  onClick={() => onDelete(project.id)}
                >
                  Delete
                </button>
              )}
            </div>
            </CollapsibleCard>
          </article>
        ))}
      </div>
    </EditorSection>
  )
}

const PressForm = ({ drafts, setDrafts, onSave, onDelete, onUploadImage, onReorder, saving }) => {
  const { onDragStart, onDragOver, onDragEnd, onDrop } = useDragReorder(setDrafts, onReorder)

  useAutosave(drafts, onSave, 1200)

  const addPress = () => {
    const currentMax = drafts.reduce(
      (max, item) => Math.max(max, Number(item.sortOrder) || 0),
      0
    )
    setDrafts((prev) => [...prev, EmptyPress(currentMax + 10)])
  }

  return (
    <EditorSection
      title="Press"
      description="Manage press cards. Drag the grip handle to reorder."
    >
      <button className="editor-add" type="button" onClick={addPress}>
        Add Press Item
      </button>
      <div className="editor-list">
        {drafts.map((item, index) => (
          <article
            className="editor-card"
            key={item.id ?? `new-press-${index}`}
            onDragOver={onDragOver(index)}
            onDrop={onDrop(index)}
          >
            <CollapsibleCard
              label={item.title || 'Untitled press item'}
              defaultOpen={!item.id}
              dragHandleProps={{
                onDragStart: onDragStart(index),
                onDragEnd,
              }}
            >
            <div className="editor-grid two">
              <Field label="Title">
                <input
                  maxLength={LIMITS.pressTitle}
                  value={item.title}
                  onChange={(event) =>
                    setDrafts((prev) =>
                      prev.map((entry, i) =>
                        i === index ? { ...entry, title: event.target.value } : entry
                      )
                    )
                  }
                />
              </Field>
              <Field label="Sort order">
                <input
                  type="number"
                  value={item.sortOrder}
                  onChange={(event) =>
                    setDrafts((prev) =>
                      prev.map((entry, i) =>
                        i === index
                          ? { ...entry, sortOrder: Number(event.target.value || 0) }
                          : entry
                      )
                    )
                  }
                />
              </Field>
              <div className="editor-cover-field">
                <span className="editor-field-label">Image</span>
                {item.image && (
                  <div className="editor-cover-preview">
                    <img src={item.image} alt={item.title || 'Press image'} />
                  </div>
                )}
                <UploadButton
                  disabled={saving}
                  folder="press"
                  label={item.image ? 'Replace image' : 'Upload image'}
                  onUpload={async (file, folder) => {
                    const result = await onUploadImage(file, folder)
                    if (!result.ok) return
                    setDrafts((prev) =>
                      prev.map((entry, i) =>
                        i === index ? { ...entry, image: result.url } : entry
                      )
                    )
                  }}
                />
              </div>
              <Field label="Published">
                <select
                  value={item.isPublished ? 'yes' : 'no'}
                  onChange={(event) =>
                    setDrafts((prev) =>
                      prev.map((entry, i) =>
                        i === index
                          ? { ...entry, isPublished: event.target.value === 'yes' }
                          : entry
                      )
                    )
                  }
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </Field>
            </div>
            <div className="editor-card-actions">
              {!item.id ? (
                <>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => onSave(item)}
                  >
                    Create Press Item
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() =>
                      setDrafts((prev) => prev.filter((_, i) => i !== index))
                    }
                  >
                    Discard
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="danger"
                  disabled={saving}
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </button>
              )}
            </div>
            </CollapsibleCard>
          </article>
        ))}
      </div>
    </EditorSection>
  )
}

const normalizeBySortOrder = (items) =>
  [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))

const EditorPanel = ({
  open,
  onClose,
  siteSettings,
  projects,
  pressItems,
  onSaveSiteSettings,
  onSaveProject,
  onDeleteProject,
  onSavePressItem,
  onDeletePressItem,
  onReorderProjects,
  onReorderPressItems,
  onUploadImage,
  onReload,
  saving,
}) => {
  const [settingsDraft, setSettingsDraft] = useState(siteSettings)
  const [projectDrafts, setProjectDrafts] = useState(
    normalizeBySortOrder(projects).map(makeDraftProject)
  )
  const [pressDrafts, setPressDrafts] = useState(
    normalizeBySortOrder(pressItems).map(makeDraftPress)
  )
  const [status, setStatus] = useState('')
  const [statusError, setStatusError] = useState(false)

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => {
      setSettingsDraft(siteSettings)
      setProjectDrafts(normalizeBySortOrder(projects).map(makeDraftProject))
      setPressDrafts(normalizeBySortOrder(pressItems).map(makeDraftPress))
    }, 0)
    return () => clearTimeout(timer)
  }, [open, siteSettings, projects, pressItems])

  const runAction = async (action, successText) => {
    setStatus('')
    setStatusError(false)
    const result = await action()
    if (!result?.ok) {
      setStatus(result?.error || 'Operation failed.')
      setStatusError(true)
      return
    }
    setStatus(successText)
    setStatusError(false)
    await onReload()
  }

  const panelClassName = useMemo(
    () => `editor-panel${open ? ' is-open' : ''}`,
    [open]
  )

  return (
    <aside className={panelClassName}>
      <div className="editor-panel-head">
        <h2>Content Editor</h2>
        <button type="button" onClick={onClose} aria-label="Close editor">
          Close
        </button>
      </div>

      <div className="editor-panel-body">
        <SiteSettingsForm
          draft={settingsDraft}
          setDraft={setSettingsDraft}
          onSave={() =>
            runAction(
              () => onSaveSiteSettings(settingsDraft),
              'Section text saved successfully.'
            )
          }
          saving={saving}
        />

        <ProjectsForm
          drafts={projectDrafts}
          setDrafts={setProjectDrafts}
          saving={saving}
          onUploadImage={onUploadImage}
          onReorder={(items) =>
            runAction(() => onReorderProjects(items), 'Order saved.')
          }
          onSave={(project) =>
            runAction(() => onSaveProject(project), 'Project saved successfully.')
          }
          onDelete={(projectId) =>
            runAction(
              () => onDeleteProject(projectId),
              'Project deleted successfully.'
            )
          }
        />

        <PressForm
          drafts={pressDrafts}
          setDrafts={setPressDrafts}
          saving={saving}
          onUploadImage={onUploadImage}
          onReorder={(items) =>
            runAction(() => onReorderPressItems(items), 'Order saved.')
          }
          onSave={(item) =>
            runAction(() => onSavePressItem(item), 'Press item saved successfully.')
          }
          onDelete={(pressId) =>
            runAction(
              () => onDeletePressItem(pressId),
              'Press item deleted successfully.'
            )
          }
        />
      </div>

      {status ? (
        <p className={`editor-status ${statusError ? 'is-error' : 'is-ok'}`}>{status}</p>
      ) : null}
    </aside>
  )
}

export default EditorPanel
