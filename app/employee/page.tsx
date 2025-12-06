import { fetchStory } from "@/lib/storyblok"
import { StoryblokRenderer, StoryWithContent } from "@/app/components/StoryBlockRenderer"

// Statische Generation - keine Zeit-basierte Revalidierung
export const revalidate = false

export default async function EmployeePage() {
    const story = (await fetchStory('mitarbeiter', {
        next: { tags: ['mitarbeiter'] } // Nur via Webhook aktualisieren
    })) as StoryWithContent | null

    return (
        <main>
            <StoryblokRenderer story={story} />
        </main>
    )
}