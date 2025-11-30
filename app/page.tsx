import { fetchStory } from '../lib/storyblok'

export default async function Home() {
  // Wir taggen diese Seite mit "home" damit revalidateTag("home") sie neu baut.
  const story = await fetchStory('home', {
    // Next fetch option to attach tags to cached render
    next: { tags: ['home'], revalidate: 60 } as any
  })

  return (
      <main>
        <h1>{story?.content?.title ?? 'Startseite'}</h1>
        <p>{story?.content?.body ?? 'Dies ist die Startseite.'}</p>
        <p>
          <a href="/mitarbeiter">Mitarbeiter</a> | <a href="/leistungen">Leistungen</a>
        </p>
      </main>
  )
}
