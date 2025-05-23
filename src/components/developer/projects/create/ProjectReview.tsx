import React from 'react';
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FiArrowLeft, FiFileText, FiMapPin, FiDollarSign, FiCpu, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, pdf } from '@react-pdf/renderer';

interface ProjectReviewProps {
  projectData: any;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

// PDF Document styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40},
  header: {
    marginBottom: 30,
    borderBottom: '2px solid #3B82F6',
    paddingBottom: 20},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10},
  subtitle: {
    fontSize: 14,
    color: '#6B7280'},
  section: {
    marginBottom: 20},
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10},
  row: {
    flexDirection: 'row',
    marginBottom: 8},
  label: {
    width: '40%',
    fontSize: 12,
    color: '#6B7280'},
  value: {
    width: '60%',
    fontSize: 12,
    color: '#1F2937'});

// PDF Document Component
const ProjectSummaryPDF = ({ projectData }: { projectData: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{projectData.basicInfo.projectName}</Text>
        <Text style={styles.subtitle}>Project Summary Report</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Project Type:</Text>
          <Text style={styles.value}>{projectData.basicInfo.projectType}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Target Market:</Text>
          <Text style={styles.value}>{projectData.basicInfo.targetMarket}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Estimated Units:</Text>
          <Text style={styles.value}>{projectData.basicInfo.estimatedUnits}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>
            {projectData.location.address}, {projectData.location.city}, {projectData.location.county}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Eircode:</Text>
          <Text style={styles.value}>{projectData.location.eircode}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Site Area:</Text>
          <Text style={styles.value}>{projectData.location.siteArea} m²</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Overview</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Total Investment:</Text>
          <Text style={styles.value}>€{parseInt(projectData.financials.totalInvestment).toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Expected Revenue:</Text>
          <Text style={styles.value}>€{parseInt(projectData.financials.expectedRevenue).toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Financing Type:</Text>
          <Text style={styles.value}>{projectData.financials.financingType}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default function ProjectReview({ projectData, onSubmit, onBack, isSubmitting }: ProjectReviewProps) {
  const [termsAcceptedsetTermsAccepted] = useState(false);
  const [dataAccuracyConfirmedsetDataAccuracyConfirmed] = useState(false);

  const calculateMetrics = () => {
    const totalCost = parseInt(projectData.financials.constructionCost || '0') + 
                     parseInt(projectData.financials.landCost || '0') + 
                     parseInt(projectData.financials.marketingBudget || '0');
    const revenue = parseInt(projectData.financials.expectedRevenue || '0');
    const roi = ((revenue - totalCost) / totalCost * 100).toFixed(1);
    const profitMargin = projectData.financials.profitMargin;

    return { totalCost, revenue, roi, profitMargin };
  };

  const metrics = calculateMetrics();
  const canSubmit = termsAccepted && dataAccuracyConfirmed && !isSubmitting;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600">Review your project details before submission</p>
      </div>

      <div className="space-y-6">
        {/* Project Summary Card */}
        <motion.div
          initial={ opacity: 0, y: 20 }
          animate={ opacity: 1, y: 0 }
          transition={ duration: 0.3 }
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <FiFileText className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Project Summary</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FiFileText className="w-4 h-4" />
                  Basic Information
                </h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-600">Project Name</dt>
                    <dd className="font-medium">{projectData.basicInfo.projectName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">Type</dt>
                    <dd className="font-medium capitalize">{projectData.basicInfo.projectType}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">Target Market</dt>
                    <dd className="font-medium capitalize">{projectData.basicInfo.targetMarket}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">Units</dt>
                    <dd className="font-medium">{projectData.basicInfo.estimatedUnits}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FiMapPin className="w-4 h-4" />
                  Location
                </h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-600">Address</dt>
                    <dd className="font-medium">{projectData.location.address}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">City</dt>
                    <dd className="font-medium">{projectData.location.city}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">Eircode</dt>
                    <dd className="font-medium">{projectData.location.eircode}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">Site Area</dt>
                    <dd className="font-medium">{projectData.location.siteArea} m²</dd>
                  </div>
                </dl>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Financial Summary */}
        <motion.div
          initial={ opacity: 0, y: 20 }
          animate={ opacity: 1, y: 0 }
          transition={ duration: 0.3, delay: 0.1 }
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <FiDollarSign className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Financial Overview</h3>
            </div>

            <div className="grid grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Investment</p>
                <p className="text-2xl font-bold text-gray-900">
                  €{parseInt(projectData.financials.totalInvestment).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Expected Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  €{metrics.revenue.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">ROI</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.roi}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Profit Margin</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.profitMargin}%</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium text-gray-900 mb-3">Cost Breakdown</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Construction</p>
                  <p className="font-medium">€{parseInt(projectData.financials.constructionCost).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Land</p>
                  <p className="font-medium">€{parseInt(projectData.financials.landCost).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Marketing</p>
                  <p className="font-medium">€{parseInt(projectData.financials.marketingBudget).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI Recommendations Summary */}
        {projectData.aiSuggestions?.acceptedRecommendations?.length> 0 && (
          <motion.div
            initial={ opacity: 0, y: 20 }
            animate={ opacity: 1, y: 0 }
            transition={ duration: 0.3, delay: 0.2 }
          >
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <FiCpu className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI Recommendations Applied</h3>
              </div>

              <div className="space-y-3">
                {projectData.aiSuggestions.acceptedRecommendations.map((id: string) => {
                  const insight = projectData.aiSuggestions.insights.find((i: any) => i.id === id);
                  if (!insight) return null;

                  return (
                    <div key={id} className="flex items-start gap-3">
                      <FiCheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{insight.title}</p>
                        <p className="text-sm text-gray-600">{insight.recommendation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Confirmation Checkboxes */}
        <motion.div
          initial={ opacity: 0, y: 20 }
          animate={ opacity: 1, y: 0 }
          transition={ duration: 0.3, delay: 0.3 }
          className="space-y-4"
        >
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked: any) => setTermsAccepted(checked as boolean)}
              />
              <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                I accept the <a href="#" className="text-blue-600 hover:underline">terms and conditions</a> and 
                understand that this submission will be reviewed by the PropIE team before approval.
              </label>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="accuracy"
                checked={dataAccuracyConfirmed}
                onCheckedChange={(checked: any) => setDataAccuracyConfirmed(checked as boolean)}
              />
              <label htmlFor="accuracy" className="text-sm text-gray-700 cursor-pointer">
                I confirm that all information provided is accurate and complete to the best of my knowledge.
              </label>
            </div>
          </Card>
        </motion.div>

        {/* Warning Alert */}
        {!canSubmit && (
          <Alert>
            <FiAlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please accept the terms and confirm data accuracy before submitting.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8">
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
            >
              <FiArrowLeft className="mr-2" />
              Back
            </Button>

            <PDFDownloadLink
              document={<ProjectSummaryPDF projectData={projectData} />}
              fileName={`${projectData.basicInfo.projectName.replace(/\s+/g, '_')}_Summary.pdf`}
            >
              {({ loading }) => (
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                >
                  {loading ? 'Generating PDF...' : 'Download Summary'}
                </Button>
              )}
            </PDFDownloadLink>
          </div>

          <Button
            onClick={onSubmit}
            disabled={!canSubmit}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <motion.div
                  animate={ rotate: 360 }
                  transition={ duration: 1, repeat: Infinity, ease: "linear" }
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Submitting...
              </span>
            ) : (
              'Submit Project'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}