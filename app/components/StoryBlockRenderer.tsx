
import React from 'react'
import { Story } from '@/lib/storyblok'

// Type für Story mit Content
export type StoryWithContent = Story & {
    content: {
        title?: string
        body?: string
        summary?: string
        [key: string]: any
    }
}

// Props für den Renderer
interface StoryblokRendererProps {
    story: StoryWithContent | null
}

// Einfacher Renderer für Storyblok-Content
export function StoryblokRenderer({ story }: StoryblokRendererProps) {
    if (!story) {
        return (
            <div>
                <h1>Inhalt nicht gefunden</h1>
                <p>Der angeforderte Inhalt konnte nicht geladen werden.</p>
            </div>
        )
    }

    const { content } = story

    return (
        <div>
            {content.title && (
                <h1 style={{ marginBottom: '1rem' }}>
                    {content.title}
                </h1>
            )}

            {content.summary && (
                <p style={{
                    fontSize: '1.1rem',
                    color: '#666',
                    marginBottom: '1.5rem'
                }}>
                    {content.summary}
                </p>
            )}

            {content.body && (
                <div style={{ lineHeight: '1.6' }}>
                    {/* Simple text content - erweitern Sie dies für rich text */}
                    <p>{content.body}</p>
                </div>
            )}

            {/* Debug info in development */}
            {process.env.NODE_ENV === 'development' && (
                <details style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px'
                }}>
                    <summary>🔍 Story Debug Info</summary>
                    <pre style={{
                        fontSize: '12px',
                        overflow: 'auto',
                        marginTop: '0.5rem'
                    }}>
                        {JSON.stringify(story, null, 2)}
                    </pre>
                </details>
            )}
        </div>
    )
}