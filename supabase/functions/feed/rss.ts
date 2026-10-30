export interface Podcast {
  title: string;
  description: string;
  link: string;
  language: string;
  author: string;
  owner_email: string;
  image_url: string;
  category: string;
  explicit: boolean;
}

export interface Episode {
  guid: string;
  title: string;
  description: string;
  audio_url: string;
  audio_bytes: number;
  audio_type: string;
  duration_seconds: number;
  image_url: string | null;
  episode_number: number | null;
  season_number: number | null;
  explicit: boolean | null;
  published_at: string;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const yesNo = (b: boolean) => (b ? "true" : "false");

export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(s)}`;
}

function item(show: Podcast, e: Episode): string {
  const lines = [
    `<title>${esc(e.title)}</title>`,
    `<description>${esc(e.description)}</description>`,
    `<guid isPermaLink="false">${esc(e.guid)}</guid>`,
    `<pubDate>${new Date(e.published_at).toUTCString()}</pubDate>`,
    `<enclosure url="${esc(e.audio_url)}" length="${e.audio_bytes}" type="${esc(e.audio_type)}"/>`,
    `<itunes:duration>${formatDuration(e.duration_seconds)}</itunes:duration>`,
    `<itunes:explicit>${yesNo(e.explicit ?? show.explicit)}</itunes:explicit>`,
    `<itunes:episodeType>full</itunes:episodeType>`,
  ];
  if (e.image_url) lines.push(`<itunes:image href="${esc(e.image_url)}"/>`);
  if (e.episode_number != null) lines.push(`<itunes:episode>${e.episode_number}</itunes:episode>`);
  if (e.season_number != null) lines.push(`<itunes:season>${e.season_number}</itunes:season>`);
  return `    <item>\n      ${lines.join("\n      ")}\n    </item>`;
}

export function buildFeed(show: Podcast, episodes: Episode[], selfUrl: string): string {
  const latest = episodes[0]?.published_at ?? new Date(0).toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(show.title)}</title>
    <link>${esc(show.link)}</link>
    <description>${esc(show.description)}</description>
    <language>${esc(show.language)}</language>
    <lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate>
    <atom:link href="${esc(selfUrl)}" rel="self" type="application/rss+xml"/>
    <itunes:author>${esc(show.author)}</itunes:author>
    <itunes:owner>
      <itunes:name>${esc(show.author)}</itunes:name>
      <itunes:email>${esc(show.owner_email)}</itunes:email>
    </itunes:owner>
    <itunes:image href="${esc(show.image_url)}"/>
    <itunes:category text="${esc(show.category)}"/>
    <itunes:explicit>${yesNo(show.explicit)}</itunes:explicit>
    <itunes:type>episodic</itunes:type>
${episodes.map((e) => item(show, e)).join("\n")}
  </channel>
</rss>
`;
}
