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

    const url = `https://api.storyblok.com/v2/cdn/stories/${encodeURIComponent(slug)}?token=${STORYBLOK_TOKEN}`
    const res = await fetch(url, fetchOptions)
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

    const url = `https://api.storyblok.com/v2/cdn/stories?starts_with=${encodeURIComponent(prefix)}&token=${STORYBLOK_TOKEN}`
    const res = await fetch(url, fetchOptions)
    if (!res.ok) return []
    const data = await res.json()
    return (data.stories || []) as Story[]
}