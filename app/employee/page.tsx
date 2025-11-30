import { fetchStory } from '../../lib/storyblok'

export default async function EmployeePage() {
    // Tagge mit "mitarbeiter"
    const story = await fetchStory('mitarbeiter', {
        next: { tags: ['mitarbeiter'], revalidate: 300 } as any
    })

    return (
        <main>
            <h1>{story?.content?.title ?? 'Mitarbeiter'}</h1>
            <p>{story?.content?.body ?? 'Liste unserer Mitarbeiter wird angezeigt.'}</p>
            <p>
                <a href="/">Start</a> | <a href="/leistungen">Leistungen</a>
            </p>
        </main>
    )
}