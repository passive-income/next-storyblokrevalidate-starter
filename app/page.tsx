// Startseite mit dynamischem Storyblok-Renderer
import {fetchStory} from "@/lib/storyblok";
import {StoryblokRenderer, StoryWithContent} from "@/app/components/StoryBlockRenderer";
import Link from "next/link";

export default async function Home() {
    const story = (await fetchStory('home', {
        next: { tags: ['home'], revalidate: 3600 } as any  // 1 Stunde statt 60s
    })) as StoryWithContent | null

    return (
        <main>
            <StoryblokRenderer story={story} />

            <nav style={{ marginTop: '2rem' }}>
                <Link href="/employee">Mitarbeiter</Link> |{' '}
                <Link href="/services">Leistungen</Link>
            </nav>
        </main>
    )
}