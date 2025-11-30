import Link from 'next/link'
import { fetchStories } from '@/lib/storyblok'
import {StoryWithContent} from "@/app/components/StoryBlockRenderer";

export default async function ServicesPage() {
    const stories = (await fetchStories('leistungen', {
        next: { tags: ['leistungen'], revalidate: 300 } as any
    })) as StoryWithContent[]

    return (
        <main>
            <h1>Leistungen</h1>
            <ul>
                {stories.map((leistung) => (
                    <li key={leistung.id}>
                        <Link href={`/services/${leistung.slug}`}>
                            {leistung.content?.title ?? leistung.name}
                        </Link>
                    </li>
                ))}
            </ul>
            <nav style={{ marginTop: '2rem' }}>
                <Link href="/">Start</Link> | <Link href="/employee">Mitarbeiter</Link>
            </nav>
        </main>
    )
}
