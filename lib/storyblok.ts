
export type Story = {
    id: number
    name: string
    slug: string
    full_slug?: string
    content?: any
    [key: string]: any
}

const STORYBLOK_TOKEN = process.env.STORYBLOK_TOKEN

/**
 * Fetch a single story by slug.
 * Accepts fetchOptions so App pages can attach next tags.
 */
export async function fetchStory(slug: string, fetchOptions?: RequestInit): Promise<Story | null> {
    if (!STORYBLOK_TOKEN) {
        return {
            id: 0,
            name: `Demo: ${slug}`,
            slug,
            full_slug: slug,
            content: { title: slug === 'home' ? 'Willkommen' : slug === 'mitarbeiter' ? 'Unser Team' : `Leistung: ${slug}`, body: 'Demo-Inhalt' }
        }
    }

    // Verschiedene Cache-Strategien je nach Umgebung
    const isPreview = process.env.NODE_ENV === 'development' || process.env.STORYBLOK_PREVIEW === 'true'
    const cacheParam = isPreview ? `&cv=${Date.now()}` : ''
    const url = `https://api.storyblok.com/v2/cdn/stories/${encodeURIComponent(slug)}?token=${STORYBLOK_TOKEN}${cacheParam}`

    // Intelligente Standard-Cache-Zeiten basierend auf Content-Typ
    const getDefaultCacheTime = (slug: string) => {
        // Statische Seiten: Sehr lange Cache-Zeiten
        if (slug === 'home' || slug === 'mitarbeiter') return 7200 // 2 Stunden
        // Listen: Mittlere Cache-Zeiten
        if (slug === 'leistungen') return 1800 // 30 Minuten
        // Detailseiten: Kürzere Cache-Zeiten
        return 900 // 15 Minuten für dynamische Inhalte
    }

    const defaultOptions: RequestInit = {
        next: {
            revalidate: isPreview ? 0 : getDefaultCacheTime(slug) // Kein Cache in Preview
        }
    }

    // Merge mit benutzerdefinierten Optionen
    const mergedOptions = {
        ...defaultOptions,
        ...fetchOptions,
        next: {
            ...defaultOptions.next,
            ...fetchOptions?.next
        }
    }

    const res = await fetch(url, mergedOptions)

    // Development-Logging für Cache-Monitoring
    if (process.env.NODE_ENV === 'development') {
        console.log(`📦 Storyblok fetch "${slug}":`, {
            status: res.status,
            cached: res.headers.get('x-nextjs-cache'),
            revalidate: mergedOptions.next?.revalidate,
            isPreview,
            cacheTime: getDefaultCacheTime(slug)
        })
    }

    if (!res.ok) return null
    const data = await res.json()
    return data.story as Story
}

/**
 * Fetch list of stories under a folder/prefix (e.g. "leistungen").
 * Uses Storyblok "starts_with" query param.
 */
export async function fetchStories(prefix: string, fetchOptions?: RequestInit): Promise<Story[]> {
    if (!STORYBLOK_TOKEN) {
        // Demo list
        return [
            { id: 1, name: 'Beratung', slug: 'beratung', full_slug: `${prefix}/beratung`, content: { title: 'Beratung', summary: 'Beratung für dein Business' } },
            { id: 2, name: 'Entwicklung', slug: 'entwicklung', full_slug: `${prefix}/entwicklung`, content: { title: 'Entwicklung', summary: 'Frontend & Backend' } },
            { id: 3, name: 'Design', slug: 'design', full_slug: `${prefix}/design`, content: { title: 'Design', summary: 'Produkt & UX Design' } }
        ]
    }

    const isPreview = process.env.NODE_ENV === 'development' || process.env.STORYBLOK_PREVIEW === 'true'
    const cacheParam = isPreview ? `&cv=${Date.now()}` : ''
    const url = `https://api.storyblok.com/v2/cdn/stories?starts_with=${encodeURIComponent(prefix)}&token=${STORYBLOK_TOKEN}${cacheParam}`

    // Listen haben längere Cache-Zeiten da sie seltener ändern
    const defaultOptions: RequestInit = {
        next: {
            revalidate: isPreview ? 0 : 3600 // 1 Stunde für Listen in Production
        }
    }

    const mergedOptions = {
        ...defaultOptions,
        ...fetchOptions,
        next: {
            ...defaultOptions.next,
            ...fetchOptions?.next
        }
    }

    const res = await fetch(url, mergedOptions)

    if (process.env.NODE_ENV === 'development') {
        console.log(`📋 Storyblok list "${prefix}":`, {
            status: res.status,
            cached: res.headers.get('x-nextjs-cache'),
            revalidate: mergedOptions.next?.revalidate,
            isPreview
        })
    }

    if (!res.ok) return []
    const data = await res.json()
    return (data.stories || []) as Story[]
}