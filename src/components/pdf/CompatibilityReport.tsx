import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #EC4899',
    paddingBottom: 20,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EC4899',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#9333EA',
    marginBottom: 10,
  },
  coupleInfo: {
    backgroundColor: '#FDF2F8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  coupleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 10,
    color: '#6B7280',
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    borderLeft: '4 solid #EC4899',
    paddingLeft: 10,
  },
  scoreContainer: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EC4899',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  dimensionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
  },
  dimensionName: {
    fontSize: 12,
    color: '#1F2937',
    width: '40%',
  },
  dimensionBarContainer: {
    width: '45%',
    height: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    overflow: 'hidden',
  },
  dimensionBar: {
    height: '100%',
    borderRadius: 10,
  },
  dimensionScore: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    width: '15%',
    textAlign: 'right',
  },
  insightBox: {
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    borderLeft: '3 solid #10B981',
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    borderLeft: '3 solid #F59E0B',
  },
  insightTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  insightText: {
    fontSize: 10,
    color: '#4B5563',
    lineHeight: 1.5,
  },
  recommendation: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  recommendationNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EC4899',
    marginRight: 8,
    width: 20,
  },
  recommendationText: {
    fontSize: 10,
    color: '#4B5563',
    flex: 1,
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '1 solid #E5E7EB',
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 9,
    color: '#9CA3AF',
  },
  footerBrand: {
    fontSize: 9,
    color: '#EC4899',
    fontWeight: 'bold',
  },
})

interface CompatibilityReportProps {
  coupleCode: string
  user1Name: string
  user2Name: string
  overallScore: number
  dimensions: {
    name: string
    score: number
    color: string
  }[]
  strengths: string[]
  improvements: string[]
  recommendations: string[]
  generatedDate: string
}

const CompatibilityReport: React.FC<CompatibilityReportProps> = ({
  coupleCode,
  user1Name,
  user2Name,
  overallScore,
  dimensions,
  strengths,
  improvements,
  recommendations,
  generatedDate,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>💝 NikahScore</Text>
          <Text style={styles.subtitle}>Rapport de Compatibilité Personnalisé</Text>
        </View>

        {/* Couple Info */}
        <View style={styles.coupleInfo}>
          <View style={styles.coupleRow}>
            <Text style={styles.label}>Couple:</Text>
            <Text style={styles.value}>{user1Name} & {user2Name}</Text>
          </View>
          <View style={styles.coupleRow}>
            <Text style={styles.label}>Code Couple:</Text>
            <Text style={styles.value}>{coupleCode}</Text>
          </View>
          <View style={styles.coupleRow}>
            <Text style={styles.label}>Date de génération:</Text>
            <Text style={styles.value}>{generatedDate}</Text>
          </View>
        </View>

        {/* Overall Score */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Score Global de Compatibilité</Text>
          <View style={styles.scoreContainer}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{overallScore}%</Text>
            </View>
            <Text style={styles.scoreLabel}>Taux de compatibilité global</Text>
          </View>
        </View>

        {/* Dimensions Scores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Analyse par Dimension</Text>
          {dimensions.map((dim, index) => (
            <View key={index} style={styles.dimensionRow}>
              <Text style={styles.dimensionName}>{dim.name}</Text>
              <View style={styles.dimensionBarContainer}>
                <View
                  style={[
                    styles.dimensionBar,
                    { 
                      width: `${dim.score}%`,
                      backgroundColor: dim.color 
                    },
                  ]}
                />
              </View>
              <Text style={styles.dimensionScore}>{dim.score}%</Text>
            </View>
          ))}
        </View>

        {/* Strengths */}
        {strengths.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💪 Vos Forces</Text>
            {strengths.map((strength, index) => (
              <View key={index} style={styles.insightBox}>
                <Text style={styles.insightText}>• {strength}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Page Break */}
      </Page>

      <Page size="A4" style={styles.page}>
        {/* Improvements */}
        {improvements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚠️ Points d'Attention</Text>
            {improvements.map((improvement, index) => (
              <View key={index} style={styles.warningBox}>
                <Text style={styles.insightText}>• {improvement}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎁 Recommandations Personnalisées</Text>
          {recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendation}>
              <Text style={styles.recommendationNumber}>{index + 1}.</Text>
              <Text style={styles.recommendationText}>{rec}</Text>
            </View>
          ))}
        </View>

        {/* Premium Note */}
        <View style={[styles.section, { marginTop: 30 }]}>
          <View style={[styles.insightBox, { backgroundColor: '#FDF2F8', borderLeftColor: '#EC4899' }]}>
            <Text style={styles.insightTitle}>💎 Rapport Premium NikahScore</Text>
            <Text style={styles.insightText}>
              Ce rapport détaillé est exclusif aux membres Premium. Il inclut une analyse complète
              de votre compatibilité, des recommandations personnalisées et des conseils d'experts
              pour renforcer votre relation.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Généré par NikahScore Premium • Votre partenaire pour une relation épanouie
          </Text>
          <Text style={styles.footerBrand}>nikahscore.com</Text>
        </View>
      </Page>
    </Document>
  )
}

export default CompatibilityReport
