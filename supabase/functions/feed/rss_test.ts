import { assertEquals, assertStringIncludes } from "jsr:@std/assert@1";
import { buildFeed, formatDuration, type Episode, type Podcast } from "./rss.ts";

const show: Podcast = {
  title: "Cyanocast & Co",
  description: "Un podcast quotidien",
  link: "https://example.com",
  language: "fr",
  author: "Constantin",
  owner_email: "constantin.moreira@gmail.com",
  image_url: "https://example.com/cover.jpg",
  category: "Technology",
  explicit: false,
};

const ep: Episode = {
  guid: "ep-1",
  title: "Épisode <1>",
  description: "Desc",
  audio_url: "https://example.com/ep1.mp3",
  audio_bytes: 1234567,
  audio_type: "audio/mpeg",
  duration_seconds: 3725,
  image_url: "https://example.com/ep1.jpg",
  episode_number: 1,
  season_number: null,
  explicit: null,
  published_at: "2026-10-30T06:00:00Z",
};

Deno.test("formatDuration", () => {
  assertEquals(formatDuration(3725), "01:02:05");
});

Deno.test("buildFeed échappe le XML et inclut l'enclosure", () => {
  const xml = buildFeed(show, [ep], "https://example.com/feed");
  assertStringIncludes(xml, "Cyanocast &amp; Co");
  assertStringIncludes(xml, "Épisode &lt;1&gt;");
  assertStringIncludes(xml, 'length="1234567"');
  assertStringIncludes(xml, "<itunes:duration>01:02:05</itunes:duration>");
});
