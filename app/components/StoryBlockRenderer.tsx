import Link from 'next/link'
import type { Story } from '@/lib/storyblok'

type StoryblokBlock = {
    _uid?: string
    component: string
    [key: string]: any
}

type StoryContent = {
    title?: string
    body?: StoryblokBlock[] | string
    [key: string]: any
}

export type StoryWithContent = Story & { content?: StoryContent }

function StoryblokBlockRenderer({ block }: { block: StoryblokBlock }) {
    switch (block.component) {
        case 'headline':
            return <h2>{block.text}</h2>

        case 'rich_text':
            return <p>{block.text}</p>

        case 'button':
            return (
                <p>
                    <Link href={block.link ?? '#'} className="btn">
                        {block.label ?? 'Button'}
                    </Link>
                </p>
            )

        default:
            return (
                <pre style={{ background: '#f3f3f3', padding: '0.5rem' }}>
          Unbekannter Blocktyp: {block.component}
        </pre>
            )
    }
}

export function StoryblokRenderer({ story }: { story: StoryWithContent | null }) {
    if (!story) {
        return <p>Inhalt nicht gefunden.</p>
    }

    const content = story.content ?? {}
    const body = content.body

    return (
        <article>
            <h1>{content.title ?? story.name}</h1>

            {Array.isArray(body) ? (
                body.map((block) => (
                    <StoryblokBlockRenderer
                        key={block._uid ?? `${block.component}-${Math.random()}`}
                        block={block}
                    />
                ))
            ) : typeof body === 'string' ? (
                <p>{body}</p>
            ) : null}
        </article>
    )
}
