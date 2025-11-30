// Startseite mit dynamischem Storyblok-Renderer
import {fetchStory} from "@/lib/storyblok";
import {StoryblokRenderer, StoryWithContent} from "@/app/components/StoryBlockRenderer";
import Link from "next/link";

export default async function Home() {
    const story = (await fetchStory('home', {
        next: { tags: ['home'], revalidate: 60 } as any
    })) as StoryWithContent | null

    return (
        <main>
            <StoryblokRenderer story={story} />

            <nav style={{ marginTop: '2rem' }}>
                <Link href="/mitarbeiter">Mitarbeiter</Link> |{' '}
                <Link href="/leistungen">Leistungen</Link>
            </nav>
        </main>
    )
}
