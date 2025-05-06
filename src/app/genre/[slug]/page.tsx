// Components
import GenreClientWrapper from '@/view/genre/genre-client-wrapper'

interface Props {
    params: {
        slug: string
    }
}

export default function GenrePage({ params }: Props) {
    return <GenreClientWrapper slug={params.slug} />
}
