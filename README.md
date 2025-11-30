```markdown
# Next.js 16 App Router Starter — gezielte Cache-Invalidierung via Webhook (Storyblok)

Dieses Starter-Projekt nutzt Next.js 16 App Router + TypeScript und zeigt:
- Hauptseiten: / (Startseite) und /mitarbeiter (Mitarbeiterseite)
- Neue Seiten: /leistungen (Liste) und /leistungen/[slug] (dynamische Leistungs‑Detailseite)
- Tag‑basierte Cache‑Verknüpfung:
  - Listenseite: tag "leistungen"
  - Detailseiten: tag "leistung:<slug>" (z. B. "leistung:beratung")
- API-Webhook: POST /api/revalidate?secret=... -> mappt Storyblok payload (story.slug / story.full_slug) auf Tags und ruft revalidateTag(tag) auf

Schnellstart
1. Kopiere das Repo.
2. Erstelle `.env.local` anhand von `.env.local.example`.
3. Installiere Abhängigkeiten:
   npm install
4. Dev:
   npm run dev

Webhook in Storyblok (Kurz)
1. Space Settings → Webhooks.
2. URL: https://your-domain.com/api/revalidate?secret=DEIN_SECRET
3. Events: content:published, content:updated, content:unpublished
4. Storyblok sendet `story.slug` / `story.full_slug`. Die Route mappt slug → Tag(s):
   - "leistungen" → revalidateTag('leistungen')
   - "leistungen/<slug>" → revalidateTag(`leistung:<slug>`) und optional revalidateTag('leistungen')

Sicherheit
- Setze REVALIDATE_SECRET in `.env.local`.
- Optional: HMAC/IP-Checks ergänzen.

Wenn du möchtest, pushe ich die Dateien in das GitHub-Repo, sobald das Repo existiert oder ich die notwendigen Rechte erhalte.
```