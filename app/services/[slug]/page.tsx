import Link from 'next/link'
import { fetchStory } from '@/lib/storyblok'
import { StoryblokRenderer, type StoryWithContent } from '@/app/components/StoryBlockRenderer'

type PageProps = {
    params: Promise<{ slug: string }>
}

export default async function ServiceDetailPage({ params }: PageProps) {
    const { slug } = await params

    const story = (await fetchStory(`leistungen/${slug}`, {
        next: { tags: [`leistungen:${slug}`, 'leistungen'], revalidate: 300 } as any
    })) as StoryWithContent | null

    console.log("STORY", story)

    return (
        <main>
            <StoryblokRenderer story={story} />

            <nav style={{ marginTop: '2rem' }}>
                <Link href="/services">Zurück zu den Services</Link>
            </nav>
        </main>
    )
}
