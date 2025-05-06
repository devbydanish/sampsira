/**
 * @name Settings
 * @file page.tsx
 * @description Settings page component
 */


// Components
import ProfileForm from './form'


export default async function ProfilePage() {
	
	return (
		<>
            <div className='under-hero container'  style={{ marginTop: '100px' }}>
				<div className='section'>
					<div className='plan bg-light'>
						<ProfileForm />
					</div>
				</div>
			</div>
		</>
	)
}