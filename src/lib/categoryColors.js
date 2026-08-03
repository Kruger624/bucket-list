// Muted, warm palette for category accents — see design brief "Bucket List App Visual Refresh".
// Each known category name maps to a fixed color trio. Categories created on the fly get
// whichever of the 11 rotating colors haven't been claimed yet, in creation order. Once all 11
// are in use, assignment cycles back to the start and repeats. Warm gray (MISC_COLOR) is
// reserved exclusively for genuinely uncategorized items — it is never assigned to a named
// category.
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
  },
  {
    key: 'rust',
    names: [],
    accent: '#8A4B2E',
    badgeBg: '#C68A5F',
    badgeText: '#3A1F0E'
  },
  {
    key: 'olive',
    names: [],
    accent: '#6B6423',
    badgeBg: '#B7AE5C',
    badgeText: '#33300F'
  },
  {
    key: 'lavender',
    names: [],
    accent: '#5B4E77',
    badgeBg: '#A79BC4',
    badgeText: '#2E2545'
  },
  {
    key: 'seafoam',
    names: [],
    accent: '#2E6B6B',
    badgeBg: '#7FB8B8',
    badgeText: '#0F3232'
  }
]

// Reserved exclusively for uncategorized items — never assigned to a named category,
// and not part of the 11-color rotation above.
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

  // Assign leftover colors in creation order so a brand-new category never
  // reshuffles the color already assigned to an older one. Once the leftover
  // pool is exhausted, cycle back to the start and repeat rather than
  // falling back to the uncategorized gray.
  const byCreatedAt = [...categories].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  let leftoverIndex = 0
  for (const category of byCreatedAt) {
    if (map.has(category.id)) continue
    map.set(category.id, leftovers[leftoverIndex % leftovers.length])
    leftoverIndex += 1
  }

  return map
}
