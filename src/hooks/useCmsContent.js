import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  defaultAwards,
  defaultPressItems,
  defaultProjects,
  defaultSiteSettings,
} from '../content/defaultContent'
import {
  sanitizePressItem,
  sanitizeProject,
  sanitizeSiteSettings,
} from '../lib/contentGuards'
import {
  allowedEditorEmails,
  isSupabaseConfigured,
  supabase,
  supabaseBucket,
} from '../lib/supabaseClient'

const isMissingTableError = (error) => {
  if (!error) return false
  const message = String(error.message || '').toLowerCase()
  return (
    message.includes('does not exist') ||
    message.includes('could not find the table') ||
    error.code === '42P01'
  )
}

const buildFallbackContent = () => ({
  siteSettings: defaultSiteSettings,
  awards: defaultAwards,
  projects: defaultProjects,
  pressItems: defaultPressItems,
})

const normalizeCredits = (credits) =>
  Array.isArray(credits)
    ? credits
        .map((entry) => ({
          label: entry?.label ?? '',
          value: entry?.value ?? '',
        }))
        .filter((entry) => entry.label && entry.value)
    : []

const rowToProject = (row) =>
  sanitizeProject({
    id: row.id,
    slug: row.slug,
    title: row.title,
    location: row.location,
    completion: row.completion,
    description: row.description,
    website: row.website,
    photo: row.photo,
    via: row.via,
    credits: normalizeCredits(row.credits),
    cover: row.cover_image,
    gallery: Array.isArray(row.gallery_images) ? row.gallery_images : [],
    tone: row.tone,
    sortOrder: row.sort_order,
    isPublished: row.is_published ?? true,
  })

const rowToPressItem = (row) =>
  sanitizePressItem({
    id: row.id,
    title: row.title,
    image: row.image_url,
    sortOrder: row.sort_order,
    isPublished: row.is_published ?? true,
  })

const settingsRowToObject = (row) =>
  sanitizeSiteSettings({
    heroLine1: row.hero_line_1,
    heroLine2: row.hero_line_2,
    heroCtaLabel: row.hero_cta_label,
    awardsTagline: row.awards_tagline,
    studioTitle: row.studio_title,
    studioQuote: row.studio_quote,
    studioSub: row.studio_sub,
    disciplines: row.disciplines,
    sectors: row.sectors,
    locations: row.locations,
    pressTitle: row.press_title,
    pressSubtitle: row.press_subtitle,
    contactTitle: row.contact_title,
    contactSubtitle: row.contact_subtitle,
    contactNote: row.contact_note,
    visitLabel: row.visit_label,
    contactAddress: row.contact_address,
    emailLabel: row.email_label,
    contactEmail: row.contact_email,
    phoneLabel: row.phone_label,
    contactPhone: row.contact_phone,
    footerCopy: row.footer_copy,
    mapEmbedUrl: row.map_embed_url,
  })

const settingsToRow = (settings) => ({
  id: 'main',
  hero_line_1: settings.heroLine1,
  hero_line_2: settings.heroLine2,
  hero_cta_label: settings.heroCtaLabel,
  awards_tagline: settings.awardsTagline,
  studio_title: settings.studioTitle,
  studio_quote: settings.studioQuote,
  studio_sub: settings.studioSub,
  disciplines: settings.disciplines,
  sectors: settings.sectors,
  locations: settings.locations,
  press_title: settings.pressTitle,
  press_subtitle: settings.pressSubtitle,
  contact_title: settings.contactTitle,
  contact_subtitle: settings.contactSubtitle,
  contact_note: settings.contactNote,
  visit_label: settings.visitLabel,
  contact_address: settings.contactAddress,
  email_label: settings.emailLabel,
  contact_email: settings.contactEmail,
  phone_label: settings.phoneLabel,
  contact_phone: settings.contactPhone,
  footer_copy: settings.footerCopy,
  map_embed_url: settings.mapEmbedUrl,
})

const projectToRow = (project) => ({
  slug: project.slug,
  title: project.title,
  location: project.location,
  completion: project.completion,
  description: project.description,
  website: project.website,
  photo: project.photo,
  via: project.via,
  credits: project.credits,
  cover_image: project.cover,
  gallery_images: project.gallery,
  tone: project.tone,
  sort_order: project.sortOrder,
  is_published: project.isPublished,
})

const pressToRow = (item) => ({
  title: item.title,
  image_url: item.image,
  sort_order: item.sortOrder,
  is_published: item.isPublished,
})

const sortByOrder = (a, b) => {
  const aOrder = Number.isFinite(a.sortOrder) ? a.sortOrder : 0
  const bOrder = Number.isFinite(b.sortOrder) ? b.sortOrder : 0
  return aOrder - bOrder
}

const isEditorEmail = (email) => {
  if (!email) return false
  if (allowedEditorEmails.length === 0) return true
  return allowedEditorEmails.includes(email.toLowerCase())
}

export const useCmsContent = () => {
  const [content, setContent] = useState(buildFallbackContent)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [syncError, setSyncError] = useState('')
  const [session, setSession] = useState(null)
  const [saving, setSaving] = useState(false)

  const reloadContent = useCallback(async () => {
    setLoading(true)
    setSyncError('')

    if (!isSupabaseConfigured || !supabase) {
      setContent(buildFallbackContent())
      setLoading(false)
      return
    }

    const [settingsRes, projectsRes, pressRes] = await Promise.all([
      supabase.from('site_settings').select('*').eq('id', 'main').maybeSingle(),
      supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false }),
      supabase
        .from('press_items')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false }),
    ])

    const missingAnyTable =
      isMissingTableError(settingsRes.error) ||
      isMissingTableError(projectsRes.error) ||
      isMissingTableError(pressRes.error)

    if (missingAnyTable) {
      setContent(buildFallbackContent())
      setSyncError(
        'Supabase tables are not ready yet. Using local fallback content for now.'
      )
      setLoading(false)
      return
    }

    if (settingsRes.error || projectsRes.error || pressRes.error) {
      setSyncError(
        settingsRes.error?.message ||
          projectsRes.error?.message ||
          pressRes.error?.message ||
          'Failed to load content from Supabase.'
      )
      setContent(buildFallbackContent())
      setLoading(false)
      return
    }

    const settings = settingsRes.data
      ? { ...defaultSiteSettings, ...settingsRowToObject(settingsRes.data) }
      : defaultSiteSettings

    const projects =
      projectsRes.data?.length > 0
        ? projectsRes.data.map(rowToProject).sort(sortByOrder)
        : defaultProjects

    const pressItems =
      pressRes.data?.length > 0
        ? pressRes.data.map(rowToPressItem).sort(sortByOrder)
        : defaultPressItems

    setContent({
      siteSettings: settings,
      awards: defaultAwards,
      projects,
      pressItems,
    })
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return

    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    queueMicrotask(() => {
      void reloadContent()
    })
  }, [reloadContent])

  const userEmail = session?.user?.email?.toLowerCase() || ''
  const isEditor = isEditorEmail(userEmail)
  const canEdit = Boolean(session?.user && isEditor)

  const signInWithPassword = useCallback(async (email, password) => {
    if (!supabase) return { ok: false, error: 'Supabase is not configured.' }
    const normalized = String(email || '').trim().toLowerCase()
    if (!normalized) return { ok: false, error: 'Email is required.' }
    if (!password) return { ok: false, error: 'Password is required.' }

    const { error } = await supabase.auth.signInWithPassword({
      email: normalized,
      password,
    })
    if (error) {
      if (error.code === 'invalid_credentials') {
        return { ok: false, error: 'Invalid email or password.' }
      }
      return { ok: false, error: error.message }
    }
    return { ok: true }
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }, [])

  const saveSiteSettings = useCallback(
    async (nextSettings) => {
      const sanitized = sanitizeSiteSettings(nextSettings)
      setContent((prev) => ({ ...prev, siteSettings: sanitized }))

      if (!canEdit || !supabase) return { ok: false, error: 'Not authorized.' }

      setSaving(true)
      const { error } = await supabase
        .from('site_settings')
        .upsert(settingsToRow(sanitized), { onConflict: 'id' })
      setSaving(false)

      if (error) return { ok: false, error: error.message }
      return { ok: true }
    },
    [canEdit]
  )

  const saveProject = useCallback(
    async (projectInput) => {
      const project = sanitizeProject(projectInput)
      if (!project.slug || !project.title) {
        return { ok: false, error: 'Project title and slug are required.' }
      }
      if (!project.cover) {
        return { ok: false, error: 'Project cover image is required.' }
      }

      if (!canEdit || !supabase) return { ok: false, error: 'Not authorized.' }
      setSaving(true)

      let mutation
      if (project.id) {
        mutation = supabase
          .from('projects')
          .update(projectToRow(project))
          .eq('id', project.id)
          .select('*')
          .single()
      } else {
        mutation = supabase
          .from('projects')
          .insert(projectToRow(project))
          .select('*')
          .single()
      }

      const { data, error } = await mutation
      setSaving(false)
      if (error) return { ok: false, error: error.message }

      const savedProject = rowToProject(data)
      setContent((prev) => {
        const withoutCurrent = prev.projects.filter((entry) => entry.id !== savedProject.id)
        return {
          ...prev,
          projects: [...withoutCurrent, savedProject].sort(sortByOrder),
        }
      })
      return { ok: true }
    },
    [canEdit]
  )

  const deleteProject = useCallback(
    async (projectId) => {
      if (!projectId) return { ok: false, error: 'Missing project id.' }
      if (!canEdit || !supabase) return { ok: false, error: 'Not authorized.' }
      setSaving(true)
      const { error } = await supabase.from('projects').delete().eq('id', projectId)
      setSaving(false)
      if (error) return { ok: false, error: error.message }
      setContent((prev) => ({
        ...prev,
        projects: prev.projects.filter((entry) => entry.id !== projectId),
      }))
      return { ok: true }
    },
    [canEdit]
  )

  const savePressItem = useCallback(
    async (pressInput) => {
      const item = sanitizePressItem(pressInput)
      if (!item.title || !item.image) {
        return { ok: false, error: 'Press title and image are required.' }
      }
      if (!canEdit || !supabase) return { ok: false, error: 'Not authorized.' }
      setSaving(true)

      let mutation
      if (item.id) {
        mutation = supabase
          .from('press_items')
          .update(pressToRow(item))
          .eq('id', item.id)
          .select('*')
          .single()
      } else {
        mutation = supabase
          .from('press_items')
          .insert(pressToRow(item))
          .select('*')
          .single()
      }

      const { data, error } = await mutation
      setSaving(false)
      if (error) return { ok: false, error: error.message }

      const savedPress = rowToPressItem(data)
      setContent((prev) => {
        const withoutCurrent = prev.pressItems.filter((entry) => entry.id !== savedPress.id)
        return {
          ...prev,
          pressItems: [...withoutCurrent, savedPress].sort(sortByOrder),
        }
      })
      return { ok: true }
    },
    [canEdit]
  )

  const deletePressItem = useCallback(
    async (pressId) => {
      if (!pressId) return { ok: false, error: 'Missing press item id.' }
      if (!canEdit || !supabase) return { ok: false, error: 'Not authorized.' }
      setSaving(true)
      const { error } = await supabase.from('press_items').delete().eq('id', pressId)
      setSaving(false)
      if (error) return { ok: false, error: error.message }
      setContent((prev) => ({
        ...prev,
        pressItems: prev.pressItems.filter((entry) => entry.id !== pressId),
      }))
      return { ok: true }
    },
    [canEdit]
  )

  const uploadImage = useCallback(
    async (file, folder = 'general') => {
      if (!file) return { ok: false, error: 'No file selected.' }
      if (!canEdit || !supabase) return { ok: false, error: 'Not authorized.' }

      const extension = file.name.split('.').pop() || 'jpg'
      const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, '').toLowerCase()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`
      const path = `${safeFolder}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(supabaseBucket)
        .upload(path, file, { upsert: false })
      if (uploadError) return { ok: false, error: uploadError.message }

      const { data } = supabase.storage.from(supabaseBucket).getPublicUrl(path)
      if (!data?.publicUrl) {
        return { ok: false, error: 'Failed to resolve uploaded image URL.' }
      }
      return { ok: true, url: data.publicUrl }
    },
    [canEdit]
  )

  const reorderProjects = useCallback(
    async (orderedItems) => {
      if (!canEdit || !supabase) return { ok: false, error: 'Not authorized.' }
      const updates = orderedItems
        .filter((item) => item.id)
        .map((item, i) => ({ id: item.id, sort_order: (i + 1) * 10 }))
      if (updates.length === 0) return { ok: true }
      setSaving(true)
      const results = await Promise.all(
        updates.map(({ id, sort_order }) =>
          supabase.from('projects').update({ sort_order }).eq('id', id)
        )
      )
      setSaving(false)
      const failed = results.find((r) => r.error)
      if (failed) return { ok: false, error: failed.error.message }
      setContent((prev) => ({
        ...prev,
        projects: prev.projects
          .map((p) => {
            const match = updates.find((u) => u.id === p.id)
            return match ? { ...p, sortOrder: match.sort_order } : p
          })
          .sort(sortByOrder),
      }))
      return { ok: true }
    },
    [canEdit]
  )

  const reorderPressItems = useCallback(
    async (orderedItems) => {
      if (!canEdit || !supabase) return { ok: false, error: 'Not authorized.' }
      const updates = orderedItems
        .filter((item) => item.id)
        .map((item, i) => ({ id: item.id, sort_order: (i + 1) * 10 }))
      if (updates.length === 0) return { ok: true }
      setSaving(true)
      const results = await Promise.all(
        updates.map(({ id, sort_order }) =>
          supabase.from('press_items').update({ sort_order }).eq('id', id)
        )
      )
      setSaving(false)
      const failed = results.find((r) => r.error)
      if (failed) return { ok: false, error: failed.error.message }
      setContent((prev) => ({
        ...prev,
        pressItems: prev.pressItems
          .map((p) => {
            const match = updates.find((u) => u.id === p.id)
            return match ? { ...p, sortOrder: match.sort_order } : p
          })
          .sort(sortByOrder),
      }))
      return { ok: true }
    },
    [canEdit]
  )

  return useMemo(
    () => ({
      content,
      loading,
      saving,
      syncError,
      isSupabaseConfigured,
      session,
      userEmail,
      canEdit,
      signInWithPassword,
      signOut,
      reloadContent,
      saveSiteSettings,
      saveProject,
      deleteProject,
      savePressItem,
      deletePressItem,
      reorderProjects,
      reorderPressItems,
      uploadImage,
    }),
    [
      content,
      loading,
      saving,
      syncError,
      session,
      userEmail,
      canEdit,
      signInWithPassword,
      signOut,
      reloadContent,
      saveSiteSettings,
      saveProject,
      deleteProject,
      savePressItem,
      deletePressItem,
      reorderProjects,
      reorderPressItems,
      uploadImage,
    ]
  )
}
