// Layout
import Samples from '@/view/layout/samples'

// Utilities
import { getGenres, getMoods, getTracks, getSoundKits } from '@/core/utils/helper'

export default async function SamplesPage() {
    const [genres, moods, tracks, soundKits] = await Promise.all([
        getGenres(),
        getMoods(),
        getTracks(),
        getSoundKits()
    ])

    return <Samples genres={genres} moods={moods} tracks={tracks} soundKits={soundKits} />
}
