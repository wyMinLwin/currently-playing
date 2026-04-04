import type { TrackData } from "./spotify";

function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? str.slice(0, maxLen - 1) + "…" : str;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const SPOTIFY_ICON = `<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" fill="#1DB954"/>`;

export function buildCurrentlyPlayingSvg(
  displayName: string,
  track: TrackData | null,
  albumArtBase64?: string,
): string {
  const width = 480;
  const height = 120;
  const bg = "#1a1815";
  const cardBg = "#232019";
  const textPrimary = "#ede9df";
  const textMuted = "#8a8278";
  const accent = "#c49a5a";
  const barBg = "#2e2a23";

  const safeName = escapeXml(truncate(displayName, 28));

  if (!track) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" rx="12" fill="${bg}"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="11" fill="${cardBg}" stroke="${barBg}" stroke-width="1"/>
  <g transform="translate(${width / 2 - 100}, ${height / 2 - 12})">
    <g transform="translate(0, 0) scale(0.75)">
      <svg viewBox="0 0 24 24" width="24" height="24">${SPOTIFY_ICON}</svg>
    </g>
    <text x="26" y="14" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="13" fill="${textMuted}"><tspan font-weight="600" fill="${textPrimary}">${safeName}</tspan> is not playing</text>
  </g>
</svg>`;
  }

  const trackName = escapeXml(truncate(track.trackName, 34));
  const artistName = escapeXml(truncate(track.artistName, 40));
  const albumName = escapeXml(truncate(track.albumName, 40));

  const artSize = 80;
  const artX = 18;
  const artY = (height - artSize) / 2;
  const textX = artX + artSize + 16;

  const albumArtImage = albumArtBase64
    ? `<clipPath id="art-clip"><rect x="${artX}" y="${artY}" width="${artSize}" height="${artSize}" rx="8"/></clipPath>
    <image href="data:image/jpeg;base64,${albumArtBase64}" x="${artX}" y="${artY}" width="${artSize}" height="${artSize}" clip-path="url(#art-clip)"/>`
    : `<rect x="${artX}" y="${artY}" width="${artSize}" height="${artSize}" rx="8" fill="${barBg}"/>`;

  const headerY = 28;
  const header = track.isPlaying
    ? `<g transform="translate(${textX}, ${headerY - 10})">
      ${[0, 1, 2, 3].map((i) => `<rect x="${i * 5}" y="${10 - [7, 10, 5, 8][i]}" width="3" height="${[7, 10, 5, 8][i]}" rx="1" fill="${accent}"><animate attributeName="height" values="${[7, 10, 5, 8][i]};${[3, 5, 8, 4][i]};${[7, 10, 5, 8][i]}" dur="${[0.8, 0.6, 0.9, 0.7][i]}s" repeatCount="indefinite"/><animate attributeName="y" values="${10 - [7, 10, 5, 8][i]};${10 - [3, 5, 8, 4][i]};${10 - [7, 10, 5, 8][i]}" dur="${[0.8, 0.6, 0.9, 0.7][i]}s" repeatCount="indefinite"/></rect>`).join("")}
    </g>
    <text x="${textX + 28}" y="${headerY}" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="11" fill="${textMuted}"><tspan font-weight="600" fill="${accent}">${safeName}</tspan> is playing</text>`
    : `<g transform="translate(${textX}, ${headerY - 8})">
      <svg viewBox="0 0 24 24" width="12" height="12">${SPOTIFY_ICON}</svg>
    </g>
    <text x="${textX + 18}" y="${headerY}" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="11" fill="${textMuted}"><tspan font-weight="600" fill="${textPrimary}">${safeName}</tspan> is paused</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" rx="12" fill="${bg}"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="11" fill="${cardBg}" stroke="${barBg}" stroke-width="1"/>
  ${albumArtImage}
  ${header}
  <text x="${textX}" y="52" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="15" font-weight="700" fill="${textPrimary}">${trackName}</text>
  <text x="${textX}" y="72" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="12" fill="${textMuted}">${artistName}</text>
  <text x="${textX}" y="90" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="11" fill="${textMuted}" opacity="0.7">${albumName}</text>
</svg>`;
}
