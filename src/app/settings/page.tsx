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
		    <div style={{ width: '100%', background: '#111', padding: '100px 0 0 0', margin: 0 }}>
		            <h2 className="container fw-bold text-white" style={{ margin: 0, textAlign: 'left' }}>Settings</h2>
		        </div>
		    <div className='under-hero container'  style={{ marginTop: '24px' }}>
		        <div className='section'>
		            <div className='plan bg-light'>
		                <ProfileForm />
		            </div>
		        </div>
		    </div>
		</>
	)
}