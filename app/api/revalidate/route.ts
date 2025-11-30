import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

type StoryblokPayload = {
    story?: {
        id?: number
        name?: string
        slug?: string
        full_slug?: string
        [key: string]: any
    }
    [key: string]: any
}

/**
 * POST /api/revalidate
 * - prüft secret (query oder Header x-webhook-secret)
 * - erwartet Storyblok payload mit story.slug / story.full_slug
 * - mapped slug -> tag(s) und ruft revalidateTag(tag) auf
 *
 * Unterstützt:
 * - "home" -> 'home'
 * - "mitarbeiter" -> 'mitarbeiter'
 * - "leistungen" -> 'leistungen'
 * - "leistungen/<slug>" -> 'leistung:<slug>' + 'leistungen'
 */
export async function POST(request: Request) {
    const url = new URL(request.url)
    const secretQuery = url.searchParams.get('secret') || ''
    const headerSecret = request.headers.get('x-webhook-secret') || ''
    const expected = process.env.REVALIDATE_SECRET || ''

    if (!expected) {
        return NextResponse.json({ message: 'REVALIDATE_SECRET not configured on server.' }, { status: 500 })
    }

    if (secretQuery !== expected && headerSecret !== expected) {
        return NextResponse.json({ message: 'Invalid secret.' }, { status: 401 })
    }

    let payload: StoryblokPayload = {}
    try {
        payload = await request.json()
    } catch {
        // ignore
    }

    const story = payload.story
    const slug = story?.slug || story?.full_slug || ''

    const tagsToRevalidate: string[] = []

    // Basic mappings
    if (slug === 'home' || slug === 'homepage' || slug === '') tagsToRevalidate.push('home')
    if (slug === 'mitarbeiter' || slug === 'team' || slug === 'employees') tagsToRevalidate.push('mitarbeiter')

    // Leistungen:
    if (slug === 'leistungen' || slug === 'services') {
        tagsToRevalidate.push('leistungen')
    }

    if (typeof story?.full_slug === 'string' && story.full_slug.startsWith('leistungen/')) {
        const parts = story.full_slug.split('/')
        const itemSlug = parts.slice(1).join('/') // supports nested paths
        if (itemSlug) {
            tagsToRevalidate.push(`leistung:${itemSlug}`)
            tagsToRevalidate.push('leistungen') // optional: keep list up-to-date
        }
    }

    if (tagsToRevalidate.length === 0) {
        return NextResponse.json({ revalidated: false, message: `No tags matched for slug "${slug}"` })
    }

    try {
        for (const tag of tagsToRevalidate) {
            await revalidateTag(tag)
        }
        return NextResponse.json({ revalidated: true, tags: tagsToRevalidate })
    } catch (err: any) {
        console.error('Revalidation error:', err)
        return NextResponse.json({ message: 'Error revalidating', error: String(err) }, { status: 500 })
    }
}