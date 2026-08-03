import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/tableau-de-bord/', '/factures/', '/clients/', '/parametres/', '/bienvenue/'],
    },
    sitemap: 'https://djetfacture.app/sitemap.xml',
  };
}
