'use client';

import { type Session } from '@supabase/supabase-js';
import {
  ChevronDown,
  ChevronUp,
  ImagePlus,
  LogIn,
  LogOut,
  Pencil,
  Save,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  getSupabaseBrowserClient,
  getSupabaseStorageBucket,
} from '@/lib/supabase-browser';
import { HOME_FEATURED_SLUGS } from '@/lib/torekull';

type LandingCopyMap = Record<string, string>;

type LandingCopyEditorContextValue = {
  copy: LandingCopyMap;
  canEdit: boolean;
  saveCopy: (key: string, value: string) => Promise<boolean>;
};

type CopyField = {
  key: string;
  label: string;
  fallback: string;
  multiline?: boolean;
};

type EditorProject = {
  id: string;
  slug: string;
  title: string | null;
  location: string | null;
  completion: string | null;
  description: string | null;
  website: string | null;
  sort_order: number | null;
  is_published: boolean | null;
  cover_image: string | null;
  gallery_images: string[] | null;
};

type CopyEntry = {
  key: string;
  value: string;
};

const FEATURED_ORDER_KEY = 'home.caseStudies.featuredSlugs';
const LOCAL_COPY_STORAGE_KEY = 'landing_copy_local_cache_v1';

const COPY_FIELDS: CopyField[] = [
  { key: 'home.hero.kicker', label: 'Hero Kicker', fallback: 'TOREKULL' },
  {
    key: 'home.hero.title',
    label: 'Hero Title',
    fallback: 'INTERIOR ARCHITECTURE & DESIGN',
  },
  {
    key: 'home.hero.cta',
    label: 'Hero CTA',
    fallback: 'Explore 3Sixty Skybar',
  },
  { key: 'home.about.heading', label: 'About Heading', fallback: 'About' },
  {
    key: 'home.about.description',
    label: 'About Description',
    fallback:
      'TOREKULL offers creative and innovative solutions within interior architecture, furniture and product design. We believe design must be functional and functionality must be translated into visual aesthetics.',
    multiline: true,
  },
  { key: 'home.caseStudies.heading', label: 'Projects Heading', fallback: 'Selected projects' },
  {
    key: 'home.caseStudies.description',
    label: 'Projects Description',
    fallback:
      'Explore recent work across restaurants, bars, and hospitality spaces. Hover each panel for quick context and open the full case.',
    multiline: true,
  },
  { key: 'home.caseStudies.cta', label: 'Projects CTA', fallback: 'View all projects' },
  { key: 'home.caseStudies.cardCta', label: 'Project Card CTA', fallback: 'View project' },
  { key: 'home.services.heading', label: 'Services Heading', fallback: 'What we do' },
  {
    key: 'home.services.description',
    label: 'Services Description',
    fallback:
      'TOREKULL works across interior architecture, furniture, and product design - shaping hotels, restaurants, bars, and workspaces from early concept through to delivery. Each card below is a core way we can support your project.',
    multiline: true,
  },
  { key: 'home.services.cardCta', label: 'Services Card CTA', fallback: 'Learn more' },
  { key: 'home.press.heading', label: 'Press Heading', fallback: 'Articles & Magazines' },
  {
    key: 'home.press.description',
    label: 'Press Description',
    fallback: 'How they write about us',
  },
  { key: 'home.press.cta', label: 'Press CTA', fallback: 'See all press' },
  {
    key: 'home.services.cards.0.title',
    label: 'Service 1 Title',
    fallback: 'Interior Architecture',
  },
  {
    key: 'home.services.cards.0.description',
    label: 'Service 1 Description',
    fallback:
      'Complete interior architecture for commercial spaces - restaurants, hotels, bars, boutiques, and offices. From concept to finished project.',
    multiline: true,
  },
  {
    key: 'home.services.cards.1.title',
    label: 'Service 2 Title',
    fallback: 'Furniture Design',
  },
  {
    key: 'home.services.cards.1.description',
    label: 'Service 2 Description',
    fallback:
      "Custom furniture design tailored to each project's unique identity and functional requirements.",
    multiline: true,
  },
  {
    key: 'home.services.cards.2.title',
    label: 'Service 3 Title',
    fallback: 'Product Design',
  },
  {
    key: 'home.services.cards.2.description',
    label: 'Service 3 Description',
    fallback:
      'Innovative product design solutions that bridge aesthetics and everyday functionality.',
    multiline: true,
  },
  {
    key: 'home.services.cards.3.title',
    label: 'Service 4 Title',
    fallback: 'Concept Development',
  },
  {
    key: 'home.services.cards.3.description',
    label: 'Service 4 Description',
    fallback:
      'Full creative concept development including material selection, lighting strategy, and spatial flow.',
    multiline: true,
  },
  { key: 'home.about.stats.0.label', label: 'Stat 1 Label', fallback: 'Projects completed' },
  { key: 'home.about.stats.0.value', label: 'Stat 1 Value', fallback: '20+' },
  { key: 'home.about.stats.1.label', label: 'Stat 2 Label', fallback: 'Countries worked in' },
  { key: 'home.about.stats.1.value', label: 'Stat 2 Value', fallback: '5' },
  { key: 'home.about.stats.2.label', label: 'Stat 3 Label', fallback: 'Award wins' },
  {
    key: 'home.about.stats.2.value',
    label: 'Stat 3 Value',
    fallback: 'International Property Awards',
  },
  { key: 'home.about.stats.3.label', label: 'Stat 4 Label', fallback: 'Languages' },
  { key: 'home.about.stats.3.value', label: 'Stat 4 Value', fallback: '5' },
  { key: 'home.logos.0', label: 'Logo Marquee 1', fallback: 'Kasai' },
  { key: 'home.logos.1', label: 'Logo Marquee 2', fallback: 'Moyagi' },
  { key: 'home.logos.2', label: 'Logo Marquee 3', fallback: 'La Botanica' },
  { key: 'home.logos.3', label: 'Logo Marquee 4', fallback: '3Sixty Skybar' },
  { key: 'home.logos.4', label: 'Logo Marquee 5', fallback: 'Biblioteket Live' },
  { key: 'home.logos.5', label: 'Logo Marquee 6', fallback: 'Deck Brasserie' },
  { key: 'home.logos.6', label: 'Logo Marquee 7', fallback: 'Chouchou' },
  { key: 'home.logos.7', label: 'Logo Marquee 8', fallback: 'Canta Lola' },
];

const LandingCopyEditorContext =
  createContext<LandingCopyEditorContextValue | null>(null);

function parseFeaturedSlugs(raw: string | undefined, availableSlugs: string[]) {
  const fallback = HOME_FEATURED_SLUGS.filter((slug) => availableSlugs.includes(slug));
  if (!raw) return fallback;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback;

    const unique = parsed.filter((entry, index) => parsed.indexOf(entry) === index);
    const valid = unique.filter(
      (entry): entry is string => typeof entry === 'string' && availableSlugs.includes(entry),
    );
    return valid;
  } catch {
    return fallback;
  }
}

export function useLandingCopyEditor() {
  const context = useContext(LandingCopyEditorContext);
  if (!context) {
    throw new Error(
      'useLandingCopyEditor must be used within LandingCopyEditorProvider.',
    );
  }
  return context;
}

export function LandingCopyEditorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [copy, setCopy] = useState<LandingCopyMap>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = window.localStorage.getItem(LOCAL_COPY_STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
      return parsed as LandingCopyMap;
    } catch {
      return {};
    }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isStatusError, setIsStatusError] = useState(false);

  const [copyDraftOverrides, setCopyDraftOverrides] = useState<Record<string, string>>({});
  const [projects, setProjects] = useState<EditorProject[]>([]);
  const [selectedSlugsDraft, setSelectedSlugsDraft] = useState<string[] | null>(null);
  const [projectToAdd, setProjectToAdd] = useState('');
  const [activeProjectSlug, setActiveProjectSlug] = useState('');
  const [isSavingCopyDraft, setIsSavingCopyDraft] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const canEdit = Boolean(session?.user);

  const setStatus = useCallback((message: string, isError = false) => {
    setStatusMessage(message);
    setIsStatusError(isError);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(LOCAL_COPY_STORAGE_KEY, JSON.stringify(copy));
    } catch {
      // Ignore localStorage failures silently.
    }
  }, [copy]);

  const saveCopyEntries = async (entries: CopyEntry[]) => {
    if (!supabase || !session?.user) return false;
    if (entries.length === 0) return true;

    const payload = entries.map((entry) => ({
      key: entry.key,
      value: entry.value,
      updated_by: session.user.id,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('landing_copy')
      .upsert(payload, { onConflict: 'key' });

    if (error) {
      if (error.message.includes('landing_copy')) {
        setStatus(
          "Saved locally only. Run the 'landing_copy' migration in Supabase to persist.",
          true,
        );
      } else {
        setStatus(error.message, true);
      }
      return false;
    }

    setCopy((prev) => {
      const next = { ...prev };
      for (const entry of entries) {
        next[entry.key] = entry.value;
      }
      return next;
    });

    return true;
  };

  const saveCopy = async (key: string, value: string) => {
    const ok = await saveCopyEntries([{ key, value }]);
    if (ok) {
      setStatus(`Saved "${key}".`);
    }
    return ok;
  };

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!supabase) return;

    supabase
      .from('landing_copy')
      .select('key,value')
      .then(({ data, error }) => {
        if (error) {
          if (error.message.includes('landing_copy')) {
            setStatus(
              "Using local copy cache. Run the 'landing_copy' migration in Supabase.",
              true,
            );
          } else {
            setStatus('Could not load landing copy from Supabase.', true);
          }
          return;
        }

        const nextCopy: LandingCopyMap = {};
        for (const row of data ?? []) {
          if (typeof row.key === 'string' && typeof row.value === 'string') {
            nextCopy[row.key] = row.value;
          }
        }

        setCopy(nextCopy);
      });
  }, [setStatus, supabase]);

  useEffect(() => {
    if (!(canEdit && isSidebarOpen) || !supabase) return;

    supabase
      .from('projects')
      .select(
        'id,slug,title,location,completion,description,website,sort_order,is_published,cover_image,gallery_images',
      )
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setStatus(error.message, true);
          return;
        }

        const nextProjects = (data ?? []) as EditorProject[];
        setProjects(nextProjects);
        if (!activeProjectSlug && nextProjects[0]?.slug) {
          setActiveProjectSlug(nextProjects[0].slug);
        }
      });
  }, [activeProjectSlug, canEdit, isSidebarOpen, setStatus, supabase]);

  useEffect(() => {
    if (!(canEdit && isSidebarOpen)) return;

    const preventLockedNavigation = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const lockedLink = target.closest<HTMLAnchorElement>(
        'a[data-editor-lock-nav="true"]',
      );
      if (!lockedLink) return;

      event.preventDefault();
      event.stopPropagation();
    };

    document.addEventListener('click', preventLockedNavigation, true);
    return () => {
      document.removeEventListener('click', preventLockedNavigation, true);
    };
  }, [canEdit, isSidebarOpen]);

  const availableProjectSlugs = useMemo(
    () => projects.map((project) => project.slug),
    [projects],
  );
  const selectedSlugs = useMemo(
    () =>
      selectedSlugsDraft ??
      parseFeaturedSlugs(copy[FEATURED_ORDER_KEY], availableProjectSlugs),
    [availableProjectSlugs, copy, selectedSlugsDraft],
  );
  const projectAddOptions = useMemo(
    () => projects.filter((project) => !selectedSlugs.includes(project.slug)),
    [projects, selectedSlugs],
  );
  const projectToAddValue = projectAddOptions.some(
    (project) => project.slug === projectToAdd,
  )
    ? projectToAdd
    : (projectAddOptions[0]?.slug ?? '');
  const getDraftValue = (field: CopyField) =>
    copyDraftOverrides[field.key] ?? copy[field.key] ?? field.fallback;

  const updateSelectedProjects = async (nextSlugs: string[]) => {
    const normalized = nextSlugs.filter(
      (slug, index) =>
        availableProjectSlugs.includes(slug) && nextSlugs.indexOf(slug) === index,
    );
    setSelectedSlugsDraft(normalized);
    setCopy((prev) => ({
      ...prev,
      [FEATURED_ORDER_KEY]: JSON.stringify(normalized),
    }));
    await saveCopy(FEATURED_ORDER_KEY, JSON.stringify(normalized));
  };

  const saveProjectPatch = async (
    projectSlug: string,
    patch: Partial<EditorProject>,
    successMessage: string,
  ) => {
    if (!supabase || !session?.user) return false;
    setIsSavingProject(true);

    const { error } = await supabase.from('projects').update(patch).eq('slug', projectSlug);

    setIsSavingProject(false);

    if (error) {
      setStatus(error.message, true);
      return false;
    }

    setProjects((prev) =>
      prev.map((project) =>
        project.slug === projectSlug
          ? {
              ...project,
              ...patch,
            }
          : project,
      ),
    );
    setStatus(successMessage);
    return true;
  };

  const reorderProjects = async (nextProjects: EditorProject[]) => {
    if (!supabase || !session?.user) return false;

    const updates = nextProjects.map((project, index) => ({
      slug: project.slug,
      sort_order: (index + 1) * 10,
    }));

    setIsSavingProject(true);
    const results = await Promise.all(
      updates.map(({ slug, sort_order }) =>
        supabase.from('projects').update({ sort_order }).eq('slug', slug),
      ),
    );
    setIsSavingProject(false);

    const failed = results.find((result) => result.error);
    if (failed?.error) {
      setStatus(failed.error.message, true);
      return false;
    }

    setProjects(
      nextProjects.map((project, index) => ({
        ...project,
        sort_order: updates[index].sort_order,
      })),
    );
    setStatus('Project order saved.');
    return true;
  };

  const moveProject = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const next = [...projects];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    await reorderProjects(next);
  };

  const updateActiveProjectDraft = (patch: Partial<EditorProject>) => {
    if (!activeProjectSlug) return;
    setProjects((prev) =>
      prev.map((project) =>
        project.slug === activeProjectSlug
          ? {
              ...project,
              ...patch,
            }
          : project,
      ),
    );
  };

  const handleSaveActiveProject = async () => {
    if (!activeProject) return;

    const normalize = (value: string | null | undefined) => {
      const trimmed = value?.trim();
      return trimmed ? trimmed : null;
    };

    await saveProjectPatch(
      activeProject.slug,
      {
        title: normalize(activeProject.title),
        location: normalize(activeProject.location),
        completion: normalize(activeProject.completion),
        website: normalize(activeProject.website),
        description: normalize(activeProject.description),
        is_published: activeProject.is_published ?? true,
      },
      `Saved project "${activeProject.title || activeProject.slug}".`,
    );
  };

  const handleSaveCopyDraft = async () => {
    if (!canEdit) return;

    const changedEntries: CopyEntry[] = COPY_FIELDS.map((field) => ({
      key: field.key,
      value: getDraftValue(field).trim(),
    })).filter((entry) => (copy[entry.key] ?? '') !== entry.value);

    if (changedEntries.length > 0) {
      setCopy((prev) => {
        const next = { ...prev };
        for (const entry of changedEntries) {
          next[entry.key] = entry.value;
        }
        return next;
      });
    }

    setIsSavingCopyDraft(true);
    const ok = await saveCopyEntries(changedEntries);
    setIsSavingCopyDraft(false);

    if (ok) {
      setCopyDraftOverrides((prev) => {
        const next = { ...prev };
        for (const entry of changedEntries) {
          delete next[entry.key];
        }
        return next;
      });
      setStatus(changedEntries.length > 0 ? 'Copy saved.' : 'No copy changes.');
    }
  };

  const uploadProjectImage = async (
    projectSlug: string,
    file: File,
    type: 'cover' | 'gallery',
  ) => {
    if (!supabase || !session?.user) return;
    if (!file) return;

    setIsUploadingImage(true);

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeSlug = projectSlug.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    const filePath = `projects/${type}/${safeSlug}-${Date.now()}.${extension}`;
    const bucket = getSupabaseStorageBucket();

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setIsUploadingImage(false);
      setStatus(uploadError.message, true);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    const imageUrl = publicUrlData.publicUrl;

    const currentProject = projects.find((project) => project.slug === projectSlug);
    const nextGallery =
      type === 'gallery'
        ? [...new Set([...(currentProject?.gallery_images ?? []), imageUrl])]
        : currentProject?.gallery_images ?? [];

    const patch =
      type === 'cover'
        ? { cover_image: imageUrl }
        : { gallery_images: nextGallery };

    const { error: updateError } = await supabase
      .from('projects')
      .update(patch)
      .eq('slug', projectSlug);

    setIsUploadingImage(false);

    if (updateError) {
      setStatus(updateError.message, true);
      return;
    }

    setProjects((prev) =>
      prev.map((project) =>
        project.slug === projectSlug
          ? {
              ...project,
              ...(type === 'cover'
                ? { cover_image: imageUrl }
                : { gallery_images: nextGallery }),
            }
          : project,
      ),
    );

    setStatus(
      type === 'cover'
        ? `Cover image updated for ${projectSlug}.`
        : `Gallery image added for ${projectSlug}.`,
    );
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;

    setIsBusy(true);
    setStatus('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsBusy(false);

    if (error) {
      setStatus(error.message, true);
      return;
    }

    setPassword('');
    setStatus('Logged in.');
    setIsSidebarOpen(true);
  };

  const handleLogout = async () => {
    if (!supabase) return;
    setIsBusy(true);
    const { error } = await supabase.auth.signOut();
    setIsBusy(false);

    if (error) {
      setStatus(error.message, true);
      return;
    }

    setStatus('Logged out.');
  };

  const activeProject =
    projects.find((project) => project.slug === activeProjectSlug) ?? null;

  return (
    <LandingCopyEditorContext.Provider value={{ copy, canEdit, saveCopy }}>
      {children}

      <Button
        type="button"
        variant="secondary"
        className="fixed right-4 bottom-4 z-50 border border-black/20 bg-white/95 text-black backdrop-blur"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Pencil className="mr-2 h-4 w-4" />
        Content Editor
      </Button>

      {isSidebarOpen ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20">
          <aside className="h-full w-[min(96vw,560px)] overflow-y-auto border-l border-black/10 bg-white p-5 text-black shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="nav-caps text-sm tracking-[0.18em]">Content Editor</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
                Close
              </Button>
            </div>

            {!supabase ? (
              <p className="text-sm">
                Supabase is not configured. Add `NEXT_PUBLIC_SUPABASE_URL` and a
                public key env var.
              </p>
            ) : canEdit ? (
              <div className="space-y-5">
                <div className="rounded-sm border border-black/10 p-3 text-sm">
                  <p className="font-medium">
                    Logged in as {session?.user?.email ?? 'editor'}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </Button>
                  </div>
                </div>

                <details open className="rounded-sm border border-black/10 p-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between">
                    <span className="nav-caps text-xs">Section Copy</span>
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  </summary>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Update all landing copy from one place.
                  </p>
                  <div className="mt-3 space-y-3">
                    {COPY_FIELDS.map((field) => (
                      <label key={field.key} className="block space-y-1">
                        <span className="nav-caps text-[10px] text-muted-foreground">
                          {field.label}
                        </span>
                        {field.multiline ? (
                          <Textarea
                            value={getDraftValue(field)}
                            onChange={(event) =>
                              setCopyDraftOverrides((prev) => ({
                                ...prev,
                                [field.key]: event.target.value,
                              }))
                            }
                            rows={3}
                          />
                        ) : (
                          <Input
                            value={getDraftValue(field)}
                            onChange={(event) =>
                              setCopyDraftOverrides((prev) => ({
                                ...prev,
                                [field.key]: event.target.value,
                              }))
                            }
                          />
                        )}
                      </label>
                    ))}
                    <Button
                      type="button"
                      onClick={() => {
                        void handleSaveCopyDraft();
                      }}
                      disabled={isSavingCopyDraft}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSavingCopyDraft ? 'Saving...' : 'Save Copy'}
                    </Button>
                  </div>
                </details>

                <details open className="rounded-sm border border-black/10 p-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between">
                    <span className="nav-caps text-xs">Selected Projects</span>
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  </summary>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Choose and reorder projects for the landing section.
                  </p>
                  <div className="mt-3 space-y-2">
                    {selectedSlugs.map((slug, index) => {
                      const project = projects.find((entry) => entry.slug === slug);
                      return (
                        <div
                          key={slug}
                          className="flex items-center justify-between rounded-sm border border-black/10 px-3 py-2"
                        >
                          <p className="text-sm">
                            {index + 1}. {project?.title || slug}
                          </p>
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={index === 0}
                              onClick={() => {
                                const next = [...selectedSlugs];
                                [next[index - 1], next[index]] = [next[index], next[index - 1]];
                                void updateSelectedProjects(next);
                              }}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={index === selectedSlugs.length - 1}
                              onClick={() => {
                                const next = [...selectedSlugs];
                                [next[index + 1], next[index]] = [next[index], next[index + 1]];
                                void updateSelectedProjects(next);
                              }}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setActiveProjectSlug(slug)}
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const next = selectedSlugs.filter((entry) => entry !== slug);
                                void updateSelectedProjects(next);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex gap-2">
                      <select
                        className="border-input bg-background w-full rounded-sm border px-3 py-2 text-sm"
                        value={projectToAddValue}
                        onChange={(event) => setProjectToAdd(event.target.value)}
                      >
                        <option value="">Select project</option>
                        {projectAddOptions.map((project) => (
                          <option key={project.slug} value={project.slug}>
                            {project.title || project.slug}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={!projectToAddValue}
                        onClick={() => {
                          if (!projectToAddValue) return;
                          void updateSelectedProjects([...selectedSlugs, projectToAddValue]);
                          setProjectToAdd('');
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </details>

                <details open className="rounded-sm border border-black/10 p-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between">
                    <span className="nav-caps text-xs">Projects</span>
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  </summary>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Edit metadata, upload images, and reorder all projects.
                  </p>

                  <div className="mt-3 space-y-3">
                    <select
                      className="border-input bg-background w-full rounded-sm border px-3 py-2 text-sm"
                      value={activeProjectSlug}
                      onChange={(event) => setActiveProjectSlug(event.target.value)}
                    >
                      {projects.map((project) => (
                        <option key={project.slug} value={project.slug}>
                          {project.title || project.slug}
                        </option>
                      ))}
                    </select>

                    {activeProject ? (
                      <div className="rounded-sm border border-black/10 p-3">
                        <p className="text-sm font-medium">
                          {activeProject.title || activeProject.slug}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Slug: {activeProject.slug}
                        </p>

                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <label className="block space-y-1">
                            <span className="nav-caps text-[10px] text-muted-foreground">Title</span>
                            <Input
                              value={activeProject.title ?? ''}
                              onChange={(event) =>
                                updateActiveProjectDraft({ title: event.target.value })
                              }
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="nav-caps text-[10px] text-muted-foreground">Location</span>
                            <Input
                              value={activeProject.location ?? ''}
                              onChange={(event) =>
                                updateActiveProjectDraft({ location: event.target.value })
                              }
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="nav-caps text-[10px] text-muted-foreground">
                              Completion
                            </span>
                            <Input
                              value={activeProject.completion ?? ''}
                              onChange={(event) =>
                                updateActiveProjectDraft({ completion: event.target.value })
                              }
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="nav-caps text-[10px] text-muted-foreground">Website</span>
                            <Input
                              value={activeProject.website ?? ''}
                              onChange={(event) =>
                                updateActiveProjectDraft({ website: event.target.value })
                              }
                            />
                          </label>
                          <label className="block space-y-1 sm:col-span-2">
                            <span className="nav-caps text-[10px] text-muted-foreground">
                              Description
                            </span>
                            <Textarea
                              value={activeProject.description ?? ''}
                              onChange={(event) =>
                                updateActiveProjectDraft({ description: event.target.value })
                              }
                              rows={3}
                            />
                          </label>
                        </div>

                        <div className="mt-3">
                          <Button
                            type="button"
                            onClick={() => {
                              void handleSaveActiveProject();
                            }}
                            disabled={isSavingProject}
                          >
                            <Save className="mr-2 h-4 w-4" />
                            {isSavingProject ? 'Saving...' : 'Save Project'}
                          </Button>
                        </div>

                        {activeProject.cover_image ? (
                          <Image
                            src={activeProject.cover_image}
                            alt={`${activeProject.title || activeProject.slug} cover`}
                            width={480}
                            height={192}
                            className="mt-3 h-28 w-full rounded-sm object-cover"
                          />
                        ) : null}

                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          <label className="inline-flex cursor-pointer items-center justify-center rounded-sm border border-black/20 px-3 py-2 text-sm">
                            <ImagePlus className="mr-2 h-4 w-4" />
                            Upload Cover
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (!file) return;
                                void uploadProjectImage(activeProject.slug, file, 'cover');
                                event.currentTarget.value = '';
                              }}
                            />
                          </label>
                          <label className="inline-flex cursor-pointer items-center justify-center rounded-sm border border-black/20 px-3 py-2 text-sm">
                            <ImagePlus className="mr-2 h-4 w-4" />
                            Add Gallery Image
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (!file) return;
                                void uploadProjectImage(activeProject.slug, file, 'gallery');
                                event.currentTarget.value = '';
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    ) : null}

                    <div className="max-h-64 overflow-auto rounded-sm border border-black/10">
                      {projects.map((project, index) => (
                        <div
                          key={project.slug}
                          className={`flex items-center justify-between border-b border-black/10 px-3 py-2 text-sm last:border-b-0 ${project.slug === activeProjectSlug ? 'bg-black/[0.03]' : ''}`}
                        >
                          <span>
                            {index + 1}. {project.title || project.slug}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={index === 0 || isSavingProject}
                              onClick={() => {
                                void moveProject(index, 'up');
                              }}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={index === projects.length - 1 || isSavingProject}
                              onClick={() => {
                                void moveProject(index, 'down');
                              }}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setActiveProjectSlug(project.slug)}
                            >
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>

                {statusMessage ? (
                  <p
                    className={`rounded-sm border px-3 py-2 text-xs ${isStatusError ? 'border-red-200 text-red-600' : 'border-emerald-200 text-emerald-700'}`}
                  >
                    {statusMessage}
                  </p>
                ) : null}
                {isUploadingImage ? (
                  <p className="text-xs text-muted-foreground">Uploading image...</p>
                ) : null}
              </div>
            ) : (
              <form className="space-y-3" onSubmit={handleLogin}>
                <p className="text-sm font-medium">
                  Log in with Supabase email/password
                </p>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
                <Button type="submit" className="w-full" disabled={isBusy}>
                  <LogIn className="mr-2 h-4 w-4" />
                  {isBusy ? 'Logging In...' : 'Log In'}
                </Button>
                {statusMessage ? (
                  <p
                    className={`text-xs ${isStatusError ? 'text-red-600' : 'text-emerald-700'}`}
                  >
                    {statusMessage}
                  </p>
                ) : null}
              </form>
            )}
          </aside>
        </div>
      ) : null}
    </LandingCopyEditorContext.Provider>
  );
}
