-- Remplace les règles liées à un UUID par is_admin() (profiles.role = 'admin').
drop policy "admin lit tous les episodes" on public.episodes;
drop policy "admin ajoute des episodes" on public.episodes;
drop policy "admin modifie les episodes" on public.episodes;
drop policy "admin supprime les episodes" on public.episodes;
drop policy "admin gere audio et images" on storage.objects;
drop policy "admin modifie podcast" on public.podcast;

create policy "admin lit tous les episodes" on public.episodes
  for select to authenticated using ((select public.is_admin()));

create policy "admin ajoute des episodes" on public.episodes
  for insert to authenticated with check ((select public.is_admin()));

create policy "admin modifie les episodes" on public.episodes
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "admin supprime les episodes" on public.episodes
  for delete to authenticated using ((select public.is_admin()));

create policy "admin gere audio et images" on storage.objects
  for all to authenticated
  using (bucket_id in ('audio', 'images') and (select public.is_admin()))
  with check (bucket_id in ('audio', 'images') and (select public.is_admin()));

create policy "admin modifie podcast" on public.podcast
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
