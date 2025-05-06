
// Modules
import { redirect, RedirectType } from 'next/navigation'


export default async function NotFound() {
	redirect('/404', RedirectType.replace)
}
