import {fetchStory} from "@/lib/storyblok";
import {StoryblokRenderer, StoryWithContent} from "@/app/components/StoryBlockRenderer";
import Link from "next/link";

export async function ServicesDetailPage({ params }: { params: { slug: string } }) {
    const { slug } = params

    const story = (await fetchStory(`leistungen/${slug}`, {
        next: { tags: [`leistung:${slug}`, 'leistungen'], revalidate: 300 } as any
    })) as StoryWithContent | null

    return (
        <main>
            <StoryblokRenderer story={story} />
            <nav style={{ marginTop: '2rem' }}>
                <Link href="/leistungen">Zurück zu den Leistungen</Link>
            </nav>
        </main>
    )
}
