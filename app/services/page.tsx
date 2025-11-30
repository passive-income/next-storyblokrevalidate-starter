import Link from 'next/link'
import { fetchStories } from '../../lib/storyblok'

export default async function ServicesPage() {
    // Tagge die Listenseite mit "leistungen" so, dass revalidateTag('leistungen') sie neu baut.
    const stories = await fetchStories('leistungen', {
        next: { tags: ['leistungen'], revalidate: 120 } as any
    })

    return (
        <main>
            <h1>Leistungen</h1>
            <ul>
                {stories.map((s) => (
                    <li key={s.id}>
                        <h2>
                            <Link href={`/leistungen/${s.slug}`}>{s.content?.title ?? s.name}</Link>
                        </h2>
                        <p>{s.content?.summary ?? ''}</p>
                    </li>
                ))}
            </ul>
            <p>
                <a href="/">Start</a> | <a href="/mitarbeiter">Mitarbeiter</a>
            </p>
        </main>
    )
}