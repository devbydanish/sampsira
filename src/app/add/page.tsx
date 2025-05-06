
// Components
import SongCard from './card'


export default async function AddSongPage() {
	
	return (
		<>
            {/* Under hero [[ Find at scss/framework/hero.scss ]] */}
            <div className='under-hero-upload container'>
                {/* Section [[ Find at scss/framework/section.scss ]] */}
                <div className='section'>
                    <div className='col-xl-7 col-md-10 mx-auto'>
                        <SongCard />
                    </div>
                </div>
            </div>
		</>
	)
}
