import Link from 'next/link'
import { fetchStory } from '@/lib/storyblok'
import { StoryblokRenderer, type StoryWithContent } from '@/app/components/StoryBlockRenderer'

type PageProps = {
    params: { slug: string }
}

export default async function ServiceDetailPage({ params }: PageProps) {
    const { slug } = params

    const story = (await fetchStory(`services/${slug}`, {
        next: { tags: [`service:${slug}`, 'services'], revalidate: 300 } as any
    })) as StoryWithContent | null

    return (
        <main>
            <StoryblokRenderer story={story} />

            <nav style={{ marginTop: '2rem' }}>
                <Link href="/services">Zurück zu den Services</Link>
            </nav>
        </main>
    )
}
