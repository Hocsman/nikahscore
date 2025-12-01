import Script from 'next/script'

/**
 * Composant pour ajouter les données structurées JSON-LD pour le SEO
 * Aide Google à mieux comprendre le contenu du site
 */
export function StructuredData() {
    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'NikahScore',
        alternateName: 'NikahScore - Compatibilité Matrimoniale',
        url: 'https://nikahscore.com',
        description: 'Plateforme de compatibilité matrimoniale islamique avec questionnaire scientifique et analyse détaillée.',
        potentialAction: {
            '@type': 'SearchAction',
            target: 'https://nikahscore.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string',
        },
    }

    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'NikahScore',
        url: 'https://nikahscore.com',
        logo: 'https://nikahscore.com/logo.png',
        description: 'Plateforme innovante de compatibilité matrimoniale selon les valeurs islamiques',
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Support',
            email: 'contact@nikahscore.com',
            availableLanguage: ['French', 'Arabic', 'English'],
        },
        sameAs: [
            'https://twitter.com/nikahscore',
            'https://facebook.com/nikahscore',
            'https://instagram.com/nikahscore',
        ],
    }

    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'NikahScore Premium',
        description: 'Accès premium à la plateforme de compatibilité matrimoniale avec analyses illimitées et conseils personnalisés',
        brand: {
            '@type': 'Brand',
            name: 'NikahScore',
        },
        offers: [
            {
                '@type': 'Offer',
                name: 'Plan Premium',
                price: '19.90',
                priceCurrency: 'EUR',
                availability: 'https://schema.org/InStock',
                url: 'https://nikahscore.com/pricing',
            },
            {
                '@type': 'Offer',
                name: 'Plan Conseil Premium',
                price: '49.90',
                priceCurrency: 'EUR',
                availability: 'https://schema.org/InStock',
                url: 'https://nikahscore.com/pricing',
            },
        ],
    }

    return (
        <>
            <Script
                id="website-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(websiteSchema),
                }}
            />
            <Script
                id="organization-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationSchema),
                }}
            />
            <Script
                id="product-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(productSchema),
                }}
            />
        </>
    )
}
