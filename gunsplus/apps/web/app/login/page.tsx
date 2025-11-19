import { redirect } from 'next/navigation'

export default function LoginPage() {
  // Temporary: redirect login to the existing admin login screen
  redirect('/admin/login')
}

