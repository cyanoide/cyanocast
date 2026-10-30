# Cyanocast

Podcast quotidien : flux RSS généré par une Edge Function Supabase, page d'admin statique sur GitHub Pages.

- `docs/` : page d'admin (GitHub Pages, branche `main`, dossier `/docs`)
- `supabase/functions/feed/` : génération du flux RSS
- `supabase/migrations/` : schéma et règles RLS

La clé `anon` dans `docs/index.html` est publique par conception ; l'accès en écriture est protégé par les règles RLS.
Ne jamais committer la clé `service_role`.
