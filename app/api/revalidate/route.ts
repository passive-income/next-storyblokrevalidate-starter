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
    action?: string  // Neu: Action-Typ loggen
    [key: string]: any
}

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || ''

export async function POST(request: Request) {
    const secretValidationResponse = validateSecret(request)
    if (secretValidationResponse) {
        return secretValidationResponse
    }

    const payload = await parseStoryblokPayload(request)
    const story = payload.story
    const action = payload.action || 'unknown'  // Action für Logging
    const slug = story?.slug || story?.full_slug || ''
    const fullSlug = story?.full_slug

    // Logging hinzugefügt
    console.log(`🔄 Webhook received: ${action} for "${slug}"`)

    const tagsToRevalidate = collectRevalidationTags(slug, fullSlug)

    if (tagsToRevalidate.length === 0) {
        return NextResponse.json({
            revalidated: false,
            message: `No tags matched for slug "${slug}"`,
            action  // Action in Response hinzufügen
        })
    }

    try {
        for (const tag of tagsToRevalidate) {
            console.log(`♻️ Revalidating tag: ${tag}`)  // Tag-Logging
            // @ts-expect-error: In unserem Setup nutzen wir die tag-basierte Variante ohne zusätzlichen Pfad
            await revalidateTag(tag)
        }
        return NextResponse.json({
            revalidated: true,
            tags: tagsToRevalidate,
            action,  // Action in Response
            slug     // Slug in Response
        })
    } catch (error: unknown) {
        console.error('❌ Revalidation error:', error)  // Error-Logging
        return NextResponse.json(
            {
                message: 'Error revalidating',
                error: String(error),
                action,  // Action auch bei Fehler
                slug
            },
            {status: 500}
        )
    }
}

function validateSecret(request: Request) {
    if (!REVALIDATE_SECRET) {
        return NextResponse.json(
            {message: 'REVALIDATE_SECRET not configured on server.'},
            {status: 500}
        )
    }

    const url = new URL(request.url)
    const secretQuery = url.searchParams.get('secret') || ''
    const headerSecret = request.headers.get('x-webhook-secret') || ''

    if (secretQuery !== REVALIDATE_SECRET && headerSecret !== REVALIDATE_SECRET) {
        return NextResponse.json({message: 'Invalid secret.'}, {status: 401})
    }

    return null
}

async function parseStoryblokPayload(request: Request): Promise<StoryblokPayload> {
    try {
        return await request.json()
    } catch {
        return {}
    }
}

function collectRevalidationTags(slug: string, fullSlug?: string): string[] {
    const tags: string[] = []

    // Basic mappings
    if (slug === 'home' || slug === 'homepage' || slug === '') {
        tags.push('home')
    }
    if (slug === 'mitarbeiter' || slug === 'team' || slug === 'employees') {
        tags.push('mitarbeiter')
    }

    // Leistungen (Listenseite)
    if (slug === 'leistungen' || slug === 'services') {
        tags.push('leistungen')
    }

    // Leistungen-Detailseiten
    if (typeof fullSlug === 'string' && fullSlug.startsWith('leistungen/')) {
        const parts = fullSlug.split('/')
        const leistungSlug = parts.slice(1).join('/') // supports nested paths
        if (leistungSlug) {
            tags.push(`leistung:${leistungSlug}`)
            tags.push('leistungen') // optional: keep list up-to-date
        }
    }

    return tags
}
