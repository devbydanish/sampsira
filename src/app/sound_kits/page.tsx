
// Layout
import SoundKits from '@/view/layout/sound-kits'

// Utilities
import { getSoundKits } from '@/core/utils/helper'


export default async function SoundKitsPage() {

    const soundKits = await getSoundKits()
	
	return <SoundKits soundKits={soundKits} />
}
