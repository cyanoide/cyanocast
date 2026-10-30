-- Seul l'utilisateur admin peut écrire. Les inscriptions sont fermées côté Auth.
create policy "admin lit tous les episodes" on public.episodes
  for select to authenticated
  using (auth.uid() = '5634321b-7bdb-48e8-8ffd-40b6a86200eb');

create policy "admin ajoute des episodes" on public.episodes
  for insert to authenticated
  with check (auth.uid() = '5634321b-7bdb-48e8-8ffd-40b6a86200eb');

create policy "admin modifie les episodes" on public.episodes
  for update to authenticated
  using (auth.uid() = '5634321b-7bdb-48e8-8ffd-40b6a86200eb')
  with check (auth.uid() = '5634321b-7bdb-48e8-8ffd-40b6a86200eb');

create policy "admin supprime les episodes" on public.episodes
  for delete to authenticated
  using (auth.uid() = '5634321b-7bdb-48e8-8ffd-40b6a86200eb');

create policy "admin gere audio et images" on storage.objects
  for all to authenticated
  using (bucket_id in ('audio', 'images') and auth.uid() = '5634321b-7bdb-48e8-8ffd-40b6a86200eb')
  with check (bucket_id in ('audio', 'images') and auth.uid() = '5634321b-7bdb-48e8-8ffd-40b6a86200eb');

create policy "admin modifie podcast" on public.podcast
  for all to authenticated
  using (auth.uid() = '5634321b-7bdb-48e8-8ffd-40b6a86200eb')
  with check (auth.uid() = '5634321b-7bdb-48e8-8ffd-40b6a86200eb');
