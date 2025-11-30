import Link from 'next/link'
import { fetchStory } from '@/lib/storyblok'
import {StoryblokRenderer, StoryWithContent} from "@/app/components/StoryBlockRenderer";

export default async function EmployeePage() {
    const story = (await fetchStory('mitarbeiter', {
        next: { tags: ['mitarbeiter'], revalidate: 300 } as any
    })) as StoryWithContent | null

    return (
        <main>
            <StoryblokRenderer story={story} />
            <nav style={{ marginTop: '2rem' }}>
                <Link href="/">Start</Link> | <Link href="/leistungen">Leistungen</Link>
            </nav>
        </main>
    )
}
