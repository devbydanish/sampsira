
// Modules
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

// Utilities
import { title } from '@/core/utils'


export default async function FourOFourPage() {

	const errorPage = await getTranslations('sidebar')

	
	return (
		<div className='d-flex align-items-center justify-content-center min-vh-100'>
			<div className='container text-center fs-5'>
				<div className='row'>
					<div className='col-xl-7 col-lg-9 col-lg-10 mx-auto'>
						<h1 
							className='display-1 fw-bold'
							dangerouslySetInnerHTML={{__html: title(errorPage, '404_page')}}
						/>
						<p>{errorPage('404_description')}</p>
						<Link 
							href='/' 
							className='btn btn-lg btn-primary rounded-pill mt-5' 
							style={{minWidth: 200}}
						>
							{errorPage('404_link')}
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
