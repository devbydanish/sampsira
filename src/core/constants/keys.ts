export const KEYS: string[] = [
    'C', 'Cm', 'C#', 'C#m',
    'D', 'Dm', 'D#', 'D#m',
    'E', 'Em',
    'F', 'Fm', 'F#', 'F#m',
    'G', 'Gm', 'G#', 'G#m',
    'A', 'Am', 'A#', 'A#m',
    'B', 'Bm'
] as const

export type KeyOption = typeof KEYS[number]