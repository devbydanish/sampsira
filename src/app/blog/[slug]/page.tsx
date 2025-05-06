
// Layout
import BlogDetails from '@/view/layout/blog-details'

// Components
import MainFooter from '@/core/components/footer/main'
import MainHeader from '@/core/components/header/main'


export default async function BlogDetailsPage() {

    return (
        <>
            <MainHeader />
            <BlogDetails />
            <MainFooter />
        </>
    )
}