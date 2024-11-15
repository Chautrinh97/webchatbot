import { redirect } from 'next/navigation';

export default function NotFound() {
  redirect('/chat');
  return null; 
}
