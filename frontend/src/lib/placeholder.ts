/**
 * Generates elegant SVG placeholder images as data URIs so the demo
 * works fully offline. In production these URLs are replaced by
 * Cloudinary / S3 / MinIO URLs served from the backend.
 */

const MOTIFS: Record<string, string> = {
  ring: '<circle cx="200" cy="215" r="70" fill="none" stroke="{fg}" stroke-width="14"/><path d="M200 118 l26 30 -26 34 -26 -34 z" fill="{fg}"/>',
  earring:
    '<circle cx="200" cy="150" r="26" fill="none" stroke="{fg}" stroke-width="10"/><path d="M200 176 v34" stroke="{fg}" stroke-width="8"/><path d="M200 210 l34 44 -34 56 -34 -56 z" fill="{fg}"/>',
  necklace:
    '<path d="M110 130 q90 130 180 0" fill="none" stroke="{fg}" stroke-width="10" stroke-linecap="round"/><path d="M200 196 l30 38 -30 50 -30 -50 z" fill="{fg}"/>',
  chain:
    '<path d="M120 140 q80 110 160 0" fill="none" stroke="{fg}" stroke-width="9" stroke-dasharray="18 10" stroke-linecap="round"/>',
  pendant:
    '<path d="M200 130 v40" stroke="{fg}" stroke-width="8"/><circle cx="200" cy="150" r="14" fill="none" stroke="{fg}" stroke-width="7"/><ellipse cx="200" cy="230" rx="46" ry="58" fill="{fg}"/>',
  bangle:
    '<circle cx="200" cy="200" r="88" fill="none" stroke="{fg}" stroke-width="16"/><circle cx="200" cy="200" r="62" fill="none" stroke="{fg}" stroke-width="5"/>',
  bracelet:
    '<path d="M120 200 a80 80 0 0 1 160 0" fill="none" stroke="{fg}" stroke-width="14" stroke-linecap="round"/><circle cx="200" cy="132" r="16" fill="{fg}"/>',
  anklet:
    '<path d="M120 210 q80 60 160 0" fill="none" stroke="{fg}" stroke-width="9" stroke-linecap="round"/><circle cx="160" cy="232" r="7" fill="{fg}"/><circle cx="200" cy="240" r="7" fill="{fg}"/><circle cx="240" cy="232" r="7" fill="{fg}"/>',
  mangalsutra:
    '<path d="M120 130 q80 100 160 0" fill="none" stroke="{fg}" stroke-width="8" stroke-dasharray="4 8"/><circle cx="200" cy="215" r="24" fill="{fg}"/><circle cx="172" cy="200" r="9" fill="{fg}"/><circle cx="228" cy="200" r="9" fill="{fg}"/>',
  nosepin:
    '<circle cx="200" cy="200" r="20" fill="{fg}"/><g stroke="{fg}" stroke-width="6" stroke-linecap="round"><path d="M200 160 v-24"/><path d="M200 240 v24"/><path d="M160 200 h-24"/><path d="M240 200 h24"/><path d="M172 172 l-17 -17"/><path d="M228 172 l17 -17"/><path d="M172 228 l-17 17"/><path d="M228 228 l17 17"/></g>',
  set: '<path d="M130 128 q70 76 140 0" fill="none" stroke="{fg}" stroke-width="8"/><path d="M200 176 l22 28 -22 36 -22 -36 z" fill="{fg}"/><circle cx="140" cy="268" r="22" fill="none" stroke="{fg}" stroke-width="8"/><circle cx="260" cy="268" r="22" fill="none" stroke="{fg}" stroke-width="8"/>',
};

const PALETTES: [string, string, string][] = [
  ['#f6ead8', '#eed9b8', '#a5761f'], // champagne gold
  ['#f2e8e8', '#e6d0d0', '#8f5656'], // rose
  ['#e9edf2', '#d3dbe6', '#5a6b84'], // silver blue
  ['#ece9f2', '#d9d2e8', '#6d5a8a'], // amethyst
  ['#e9f0ec', '#d2e2d8', '#4e7361'], // emerald
  ['#f4ece2', '#e8d8c2', '#96662a'], // antique
];

export function jewelleryImage(motif: string, seed: number, label = ''): string {
  const [bg1, bg2, fg] = PALETTES[seed % PALETTES.length];
  const shape = (MOTIFS[motif] ?? MOTIFS.ring).replaceAll('{fg}', fg);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></linearGradient></defs><rect width="400" height="400" fill="url(#bg)"/><circle cx="200" cy="200" r="140" fill="#ffffff" opacity="0.45"/>${shape}${
    label
      ? `<text x="200" y="368" text-anchor="middle" font-family="Georgia,serif" font-size="19" fill="${fg}" opacity="0.85">${label}</text>`
      : ''
  }</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function bannerImage(seed: number, w = 1400, h = 520): string {
  const [bg1, bg2, fg] = PALETTES[seed % PALETTES.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="0.6"><stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#bg)"/><g opacity="0.35" fill="none" stroke="${fg}" stroke-width="3"><circle cx="${w - 190}" cy="${h / 2}" r="150"/><circle cx="${w - 190}" cy="${h / 2}" r="105"/><circle cx="${w - 190}" cy="${h / 2}" r="60"/></g><path d="M${w - 190} ${h / 2 - 40} l34 40 -34 52 -34 -52 z" fill="${fg}" opacity="0.6"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function avatarImage(name: string): string {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const seed = name.length % PALETTES.length;
  const [bg1, , fg] = PALETTES[seed];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" rx="40" fill="${bg1}"/><text x="40" y="50" text-anchor="middle" font-family="Inter,sans-serif" font-size="28" font-weight="600" fill="${fg}">${initials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
