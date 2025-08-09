import MoodClientWrapper from '@/view/mood/mood-client-wrapper'
import { ParamsTypes } from '@/core/types'

export default function MoodPage({ params }: ParamsTypes) {
    return <MoodClientWrapper slug={String(params.slug)} />
}
