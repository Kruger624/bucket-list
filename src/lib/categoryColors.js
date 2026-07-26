// Muted, warm palette for category accents — see design brief "Bucket List App Visual Refresh".
// Each known category name maps to a fixed color trio. Categories created on the fly get
// whichever of the extra/unused colors haven't been claimed yet, falling back to the neutral
// "misc" treatment once the palette is exhausted.
const PALETTE = [
  {
    key: 'travel',
    names: ['travel'],
    accent: '#D85A30',
    badgeBg: '#F0997B',
    badgeText: '#4A1B0C'
  },
  {
    key: 'food',
    names: ['food & drink', 'food and drink'],
    accent: '#0F6E56',
    badgeBg: '#5DCAA5',
    badgeText: '#04342C'
  },
  {
    key: 'experiences',
    names: ['experiences & activities', 'experiences and activities'],
    accent: '#854F0B',
    badgeBg: '#EF9F27',
    badgeText: '#412402'
  },
  {
    key: 'culture',
    names: ['culture'],
    accent: '#993556',
    badgeBg: '#ED93B1',
    badgeText: '#4B1528'
  },
  {
    key: 'home',
    names: ['home projects'],
    accent: '#534AB7',
    badgeBg: '#AFA9EC',
    badgeText: '#26215C'
  },
  {
    key: 'wellness',
    names: ['wellness'],
    accent: '#185FA5',
    badgeBg: '#85B7EB',
    badgeText: '#042C53'
  },
  {
    key: 'outdoors',
    names: ['outdoors'],
    accent: '#3B6D11',
    badgeBg: '#97C459',
    badgeText: '#173404'
  }
]

export const MISC_COLOR = {
  key: 'misc',
  accent: '#5F5E5A',
  badgeBg: '#B4B2A9',
  badgeText: '#2C2C2A'
}

export function buildCategoryColorMap(categories) {
  const map = new Map()
  const usedKeys = new Set()

  for (const category of categories) {
    const normalized = category.name.trim().toLowerCase()
    const match = PALETTE.find((p) => p.names.includes(normalized))
    if (match) {
      map.set(category.id, match)
      usedKeys.add(match.key)
    }
  }

  const leftovers = PALETTE.filter((p) => !usedKeys.has(p.key))
  let leftoverIndex = 0

  // Assign leftover colors in creation order so a brand-new category never
  // reshuffles the color already assigned to an older one.
  const byCreatedAt = [...categories].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  for (const category of byCreatedAt) {
    if (map.has(category.id)) continue
    if (leftoverIndex < leftovers.length) {
      map.set(category.id, leftovers[leftoverIndex])
      leftoverIndex += 1
    } else {
      map.set(category.id, MISC_COLOR)
    }
  }

  return map
}
