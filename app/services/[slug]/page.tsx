import { fetchStory } from '../../../lib/storyblok'
import Link from 'next/link'

type Props = {
    params: {
        slug: string
    }
}

export default async function ServicesDetailPage({ params }: Props) {
    const { slug } = params

    // Tagge die Detailseite sowohl mit "leistung:<slug>" als auch optional mit "leistungen"
    const story = await fetchStory(`leistungen/${slug}`, {
        next: { tags: [`leistung:${slug}`, 'leistungen'], revalidate: 300 } as any
    })

    if (!story) {
        return (
            <main>
                <h1>Leistung nicht gefunden</h1>
                <p>Die Leistung "{slug}" konnte nicht gefunden werden.</p>
                <p>
                    <Link href="/leistungen">Zurück zu Leistungen</Link>
                </p>
            </main>
        )
    }

    return (
        <main>
            <h1>{story.content?.title ?? story.name}</h1>
            <p>{story.content?.body ?? 'Details zur Leistung.'}</p>
            <p>
                <Link href="/leistungen">Zurück zu Leistungen</Link>
            </p>
        </main>
    )
}