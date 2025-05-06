export const MOODS: string[] = [
    'Happy',
    'Sad',
    'Energetic',
    'Chill',
    'Aggressive',
    'Romantic',
    'Dark',
    'Upbeat',
    'Melancholic',
    'Epic',
    'Dreamy',
    'Intense'
] as const

export type MoodOption = typeof MOODS[number]