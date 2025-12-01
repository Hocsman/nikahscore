import { MetadataRoute } from 'next'

/**
 * Configuration robots.txt pour NikahScore
 * Indique aux moteurs de recherche quelles pages indexer
 */
export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nikahscore.com'

    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/pricing',
                    '/faq',
                    '/contact',
                    '/auth/login',
                    '/auth/register',
                    '/terms',
                    '/privacy',
                ],
                disallow: [
                    '/dashboard',
                    '/dashboard/*',
                    '/profile',
                    '/profile/*',
                    '/admin',
                    '/admin/*',
                    '/api/*',
                    '/questionnaire/*',
                    '/results/*',
                    '/couple',
                    '/couple/*',
                    '/welcome',
                    '/success',
                    '/coach-ai',
                    '/diagnostic',
                    '/premium',
                ],
            },
            // Règle spéciale pour les bons bots
            {
                userAgent: ['Googlebot', 'Bingbot'],
                allow: [
                    '/',
                    '/pricing',
                    '/faq',
                    '/contact',
                    '/auth/*',
                    '/terms',
                    '/privacy',
                ],
                disallow: [
                    '/dashboard/*',
                    '/profile/*',
                    '/admin/*',
                    '/api/*',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
