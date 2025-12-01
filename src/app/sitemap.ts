import { MetadataRoute } from 'next'

/**
 * Génération dynamique du sitemap pour NikahScore
 * Liste toutes les URLs publiques du site pour les moteurs de recherche
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nikahscore.com'
    const currentDate = new Date()

    return [
        // Homepage
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        // Pages principales
        {
            url: `${baseUrl}/pricing`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        // Pages d'authentification
        {
            url: `${baseUrl}/auth/login`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/auth/register`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        // Pages légales
        {
            url: `${baseUrl}/terms`,
            lastModified: currentDate,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: currentDate,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ]
}
