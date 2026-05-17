/**
 * One-time script: generates 3D isometric character images for each host type.
 * Run: node scripts/generate-characters.mjs
 * Requires OPENAI_API_KEY in .env.local
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Load .env.local manually
const envPath = resolve(root, '.env.local');
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
  }
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('❌  OPENAI_API_KEY not found in .env.local');
  process.exit(1);
}

const client = new OpenAI({ apiKey });

const HOST_TYPES = [
  {
    id: 'angel',
    imagePrompt:
      'Cute 3D isometric chibi character, an angel host with tiny white wings and a halo, holding a glowing heart, wearing a soft pastel apron, standing in a cozy mini house with warm lighting, kawaii style, clean white background, high quality render',
  },
  {
    id: 'perfectionist',
    imagePrompt:
      'Cute 3D isometric chibi character, a meticulous inspector host holding a clipboard with a checklist, wearing glasses and a tidy uniform, standing next to a perfectly organized miniature room with ruler and magnifying glass, kawaii style, clean white background, high quality render',
  },
  {
    id: 'businessman',
    imagePrompt:
      'Cute 3D isometric chibi character, a smart business host in a tiny suit holding a tablet showing graphs, surrounded by mini coins and star rating icons, confident pose with a briefcase, kawaii style, clean white background, high quality render',
  },
  {
    id: 'free',
    imagePrompt:
      'Cute 3D isometric chibi character, a laid-back relaxed host lounging in a tiny hammock, wearing casual clothes and sandals, surrounded by little potted plants and a sun hat, peaceful smile, kawaii style, clean white background, high quality render',
  },
  {
    id: 'socialite',
    imagePrompt:
      'Cute 3D isometric chibi character, an energetic social host holding a smartphone with a chat bubble, surrounded by mini star review badges and confetti, big bright smile and waving hand, kawaii style, clean white background, high quality render',
  },
  {
    id: 'guardian',
    imagePrompt:
      'Cute 3D isometric chibi character, a seasoned professional host standing confidently holding a large key ring, wearing a vest with a name badge, surrounded by trophy and shield icons, experienced and trustworthy expression, kawaii style, clean white background, high quality render',
  },
];

async function generate(type) {
  const outPath = resolve(root, 'public', 'characters', `${type.id}.png`);
  if (existsSync(outPath)) {
    console.log(`⏭  ${type.id}.png already exists, skipping`);
    return;
  }

  console.log(`🎨  Generating ${type.id}...`);
  const response = await client.images.generate({
    model: 'gpt-image-1',
    prompt: type.imagePrompt,
    n: 1,
    size: '1024x1024',
    quality: 'medium',
  });

  const b64 = response.data[0].b64_json;
  writeFileSync(outPath, Buffer.from(b64, 'base64'));
  console.log(`✅  Saved public/characters/${type.id}.png`);
}

for (const type of HOST_TYPES) {
  await generate(type);
}

console.log('\n🎉  All characters generated!');
