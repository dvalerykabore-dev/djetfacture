import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirection automatique vers la page d'authentification obligatoire /login au chargement
  redirect('/login');
}
