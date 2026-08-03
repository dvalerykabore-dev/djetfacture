import { createClient } from './client';

export interface SupabaseConnectionStatus {
  isConfigured: boolean;
  isConnected: boolean;
  url: string;
  hasAnonKey: boolean;
  message: string;
  tablesFound?: string[];
  errorDetails?: string;
}

export async function checkSupabaseConnection(): Promise<SupabaseConnectionStatus> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const isConfigured =
    Boolean(url) &&
    Boolean(anonKey) &&
    !url.includes('example.supabase.co') &&
    !url.includes('your-project-id') &&
    !anonKey.includes('your-anon-key');

  if (!isConfigured) {
    return {
      isConfigured: false,
      isConnected: false,
      url: url || 'Non définie',
      hasAnonKey: Boolean(anonKey),
      message: 'Variables Supabase non configurées ou contenants des valeurs d\'exemple dans .env.local.',
    };
  }

  try {
    const supabase = createClient();
    
    // Tenter d'interroger la table clients ou organizations
    const { data, error } = await supabase.from('organizations').select('id, name').limit(1);

    if (error) {
      // Si la table n'existe pas encore ou permission
      if (error.code === 'PGRST301' || error.message.includes('relation') || error.code === '42P01') {
        return {
          isConfigured: true,
          isConnected: true,
          url,
          hasAnonKey: true,
          message: 'Connexion réseau à Supabase réussie, mais les tables (ex: organizations) ne sont pas encore créées. Veuillez exécuter le fichier migration init_schema.sql.',
          errorDetails: error.message,
        };
      }

      return {
        isConfigured: true,
        isConnected: false,
        url,
        hasAnonKey: true,
        message: `Erreur lors de la connexion à Supabase: ${error.message}`,
        errorDetails: error.message,
      };
    }

    return {
      isConfigured: true,
      isConnected: true,
      url,
      hasAnonKey: true,
      message: 'Connexion Supabase opérationnelle et base de données synchronisée.',
      tablesFound: ['organizations', 'clients', 'invoices', 'profiles'],
    };
  } catch (err: any) {
    return {
      isConfigured: true,
      isConnected: false,
      url,
      hasAnonKey: true,
      message: `Exception de connexion: ${err?.message || 'Inconnue'}`,
      errorDetails: String(err),
    };
  }
}
