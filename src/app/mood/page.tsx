import { redirect } from 'next/navigation';

export default function MoodPage() {
  redirect('/404');
  return null;
}