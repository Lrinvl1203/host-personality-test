export type HostTypeId = 'angel' | 'perfectionist' | 'businessman' | 'free' | 'socialite' | 'guardian';

export interface HostType {
  id: HostTypeId;
  title: string;
  imagePrompt: string;
}

export const HOST_TYPES: HostType[] = [
  {
    id: 'angel',
    title: '천사표 케어 호스트',
    imagePrompt:
      'Cute 3D isometric chibi character, an angel host with tiny white wings and a halo, holding a glowing heart, wearing a soft pastel apron, standing in a cozy mini house with warm lighting, kawaii style, clean white background, high quality render',
  },
  {
    id: 'perfectionist',
    title: '꼼꼼한 원칙주의자',
    imagePrompt:
      'Cute 3D isometric chibi character, a meticulous inspector host holding a clipboard with a checklist, wearing glasses and a tidy uniform, standing next to a perfectly organized miniature room with ruler and magnifying glass, kawaii style, clean white background, high quality render',
  },
  {
    id: 'businessman',
    title: '스마트 비즈니스 호스트',
    imagePrompt:
      'Cute 3D isometric chibi character, a smart business host in a tiny suit holding a tablet showing graphs, surrounded by mini coins and star rating icons, confident pose with a briefcase, kawaii style, clean white background, high quality render',
  },
  {
    id: 'free',
    title: '느긋한 자유로운 호스트',
    imagePrompt:
      'Cute 3D isometric chibi character, a laid-back relaxed host lounging in a tiny hammock, wearing casual clothes and sandals, surrounded by little potted plants and a sun hat, peaceful smile, kawaii style, clean white background, high quality render',
  },
  {
    id: 'socialite',
    title: '소통왕 에너자이저',
    imagePrompt:
      'Cute 3D isometric chibi character, an energetic social host holding a smartphone with a chat bubble, surrounded by mini star review badges and confetti, big bright smile and waving hand, kawaii style, clean white background, high quality render',
  },
  {
    id: 'guardian',
    title: '든든한 프로 호스트',
    imagePrompt:
      'Cute 3D isometric chibi character, a seasoned professional host standing confidently holding a large key ring, wearing a vest with a name badge, surrounded by trophy and shield icons, experienced and trustworthy expression, kawaii style, clean white background, high quality render',
  },
];

export const HOST_TYPE_IDS = HOST_TYPES.map((t) => t.id);
