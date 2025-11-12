import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface PartnerCompletedNotificationProps {
  creatorName: string
  partnerName: string
  shareCode: string
  completionDate: string
}

export default function PartnerCompletedNotification({
  creatorName = 'Ahmed',
  partnerName = 'Fatima',
  shareCode = 'ABC123XYZ456',
  completionDate = '12 novembre 2025',
}: PartnerCompletedNotificationProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nikahscore.com'
  const comparisonUrl = `${baseUrl}/results/couple/${shareCode}`

  return (
    <Html>
      <Head />
      <Preview>
        {partnerName} a complété le questionnaire NikahScore ! Découvrez votre compatibilité 💕
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo et en-tête */}
          <Section style={header}>
            <Img
              src={`${baseUrl}/logo.png`}
              width="60"
              height="60"
              alt="NikahScore"
              style={logo}
            />
            <Heading style={h1}>Bonne nouvelle ! 🎉</Heading>
          </Section>

          {/* Contenu principal */}
          <Section style={content}>
            <Text style={paragraph}>
              Salam {creatorName} ! 👋
            </Text>

            <Text style={paragraph}>
              Nous avons une excellente nouvelle à vous annoncer :
            </Text>

            <Section style={highlightBox}>
              <Text style={highlightText}>
                💕 <strong>{partnerName}</strong> a complété le questionnaire de compatibilité !
              </Text>
              <Text style={dateText}>
                Complété le {completionDate}
              </Text>
            </Section>

            <Text style={paragraph}>
              Vous pouvez maintenant découvrir votre <strong>analyse de compatibilité détaillée</strong> :
            </Text>

            <ul style={list}>
              <li style={listItem}>📊 Graphique comparatif par catégorie</li>
              <li style={listItem}>🔍 Comparaison question par question</li>
              <li style={listItem}>💪 Vos forces en commun</li>
              <li style={listItem}>💬 Sujets à approfondir ensemble</li>
              <li style={listItem}>📈 Score de compatibilité global</li>
            </ul>

            <Section style={buttonContainer}>
              <Button style={button} href={comparisonUrl}>
                Voir la Comparaison Complète
              </Button>
            </Section>

            <Text style={paragraph}>
              Ou copiez ce lien dans votre navigateur :
            </Text>
            <Text style={linkText}>
              <Link href={comparisonUrl} style={link}>
                {comparisonUrl}
              </Link>
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Conseils */}
          <Section style={tipsSection}>
            <Heading style={h2}>💡 Nos Conseils</Heading>
            <Text style={paragraph}>
              Prenez le temps de consulter les résultats ensemble. Les points de divergence
              ne sont pas des obstacles, mais des opportunités de mieux vous comprendre.
            </Text>
            <Text style={paragraph}>
              Discutez des sujets où vous avez des différences, avec respect et ouverture d'esprit.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Cet email a été envoyé à partir de{' '}
              <Link href={baseUrl} style={link}>
                NikahScore.com
              </Link>
            </Text>
            <Text style={footerText}>
              Plateforme de compatibilité matrimoniale selon les valeurs islamiques
            </Text>
            <Text style={footerText}>
              © 2025 NikahScore. Tous droits réservés.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const header = {
  padding: '32px 24px',
  textAlign: 'center' as const,
  backgroundColor: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
  borderRadius: '8px 8px 0 0',
}

const logo = {
  margin: '0 auto 16px',
}

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '8px 0',
  padding: '0',
  lineHeight: '1.4',
}

const h2 = {
  color: '#1f2937',
  fontSize: '22px',
  fontWeight: 'bold',
  margin: '0 0 16px',
}

const content = {
  padding: '24px',
}

const paragraph = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const highlightBox = {
  backgroundColor: '#f3e8ff',
  border: '2px solid #9333ea',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const highlightText = {
  color: '#7c3aed',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 8px',
}

const dateText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
}

const list = {
  margin: '16px 0',
  paddingLeft: '20px',
}

const listItem = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '24px',
  marginBottom: '8px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#9333ea',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  cursor: 'pointer',
}

const linkText = {
  fontSize: '14px',
  color: '#6b7280',
  textAlign: 'center' as const,
  margin: '16px 0',
  wordBreak: 'break-all' as const,
}

const link = {
  color: '#9333ea',
  textDecoration: 'underline',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
}

const tipsSection = {
  padding: '0 24px',
}

const footer = {
  padding: '0 24px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '4px 0',
}
