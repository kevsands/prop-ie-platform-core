# Codebase Audit Report

## General Statistics

- Total files: 658
- Total lines of code: 152762

## Folder Structure

| Folder | File Count | Expected Content |
|--------|------------|------------------|
| src | 658 | Unknown purpose |

### Missing Recommended Folders

- `components`: UI components
- `pages`: Page components or route handlers
- `hooks`: Custom React hooks
- `services`: API services and data fetching
- `utils`: Utility functions
- `contexts`: React contexts
- `types`: TypeScript types and interfaces
- `styles`: CSS, SCSS, or style-related files
- `assets`: Static assets like images
- `api`: API endpoints or handlers

## Potential Duplications

### User Authentication (241 files)

> **Warning**: High number of files matching this pattern, suggesting potential duplication of functionality.

- `src/__tests__/middleware.test.ts`
- `src/api/auth/login/[...nextauth]/route.ts`
- `src/api/auth/login/route.ts`
- `src/api/index.ts`
- `src/app/api/auth/[...nextauth]/auth-helpers.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/register/route.ts`
- `src/app/api/auth-disabled/route.ts`
- `src/app/api/customization/options/route.ts`
- `src/app/api/customization/route.ts`
- `src/app/api/documents/route.ts`
- `src/app/api/finance/budget-vs-actual/route.ts`
- `src/app/api/finance/projections/route.ts`
- `src/app/api/finance/route.ts`
- `src/app/api/monitoring/api-metrics/route.ts`
- `src/app/api/projects/[id]/activity/route.ts`
- `src/app/api/projects/[id]/alerts/route.ts`
- `src/app/api/projects/[id]/route.ts`
- `src/app/api/projects/[id]/sales/route.ts`
- `src/app/api/projects/[id]/timeline/route.ts`
- `src/app/api/projects/route.ts`
- `src/app/api/sales/route.ts`
- `src/app/api/security/report/route.ts`
- `src/app/api/units/route.ts`
- `src/app/api/users/route.ts`
- `src/app/dashboard/@main/page.tsx`
- `src/app/dashboard/@main/profile/page.tsx`
- `src/app/dashboard/@main/security/page.tsx`
- `src/app/dashboard/@sidebar/default.tsx`
- `src/app/developer/properties/page.tsx`
- `src/app/developments/page.tsx`
- `src/app/login/page.tsx`
- `src/app/projects/[slug]/units/[id]/page.tsx`
- `src/app/projects/propprojects/units/unit11/[slug]/units/page.tsx`
- `src/app/register/page.tsx`
- `src/app/user/security/page.tsx`
- `src/aws-exports.d.ts`
- `src/aws-exports.js`
- `src/components/AppWrapper.tsx`
- `src/components/AuthProvider.tsx`
- `src/components/ClientProviders.tsx`
- `src/components/HomePage.tsx`
- `src/components/about/AboutCta.tsx`
- `src/components/about/AboutMission.tsx`
- `src/components/about/AboutPageClient.tsx`
- `src/components/about/AboutTeam.tsx`
- `src/components/about/AboutTimeline.tsx`
- `src/components/about/AboutValues.tsx`
- `src/components/about/Timeline.tsx`
- `src/components/admin/AdminDocumentReview.tsx`
- `src/components/admin/AdminFinancialDashboard.tsx`
- `src/components/admin/EnhancedSecurityDashboard.tsx`
- `src/components/auth/AuthErrorBoundary.tsx`
- `src/components/auth/LoginForm.stories.tsx`
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/ProtectedRoute.tsx`
- `src/components/auth/RegisterForm.tsx`
- `src/components/auth/UserRegistration.tsx`
- `src/components/buyer/BuyerDashboardContent.tsx`
- `src/components/buyer/BuyerFinancialDashboard.tsx`
- `src/components/buyer/DocumentManager.tsx`
- `src/components/buyer/DocumentUpload.tsx`
- `src/components/buyer/PurchaseList.tsx`
- `src/components/contact/ContactFaq.tsx`
- `src/components/contact/ContactForm.tsx`
- `src/components/contact/ContactMap.tsx`
- `src/components/contact/ContactOffices.tsx`
- `src/components/contact/ContactPageClient.tsx`
- `src/components/contact/ContactSocialCta.tsx`
- `src/components/contact/Faq.tsx`
- `src/components/dashboard/BuyerDashboard.tsx`
- `src/components/dashboard/DeveloperDashboard.tsx`
- `src/components/dashboard/ProjectOverview.tsx`
- `src/components/dashboard/index.tsx`
- `src/components/developer/DeveloperHeader.tsx`
- `src/components/developer/project/wizard/PlanningPermissionUpload.tsx`
- `src/components/developer/project/wizard/ProjectBasicInfo.tsx`
- `src/components/developer/project/wizard/ScheduleOfAccommodation.tsx`
- `src/components/developer/project/wizard/SitePlanUpload.tsx`
- `src/components/development/DevelopmentDetail.tsx`
- `src/components/documents/DocumentGenerator.tsx`
- `src/components/features/FeatureFlagAdmin.tsx`
- `src/components/features/home/HeroSection.tsx`
- `src/components/finance/BudgetVsActualCard.tsx`
- `src/components/finance/FinancialMetricCard.tsx`
- `src/components/htb/HelpToBuyClaimUpload.tsx`
- `src/components/htb/developer/ClaimNotes.tsx`
- `src/components/layout/AppWrapper.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/MainNavigation.jsx`
- `src/components/layout/_app.tsx`
- `src/components/navigation/ConsistentNavigation.tsx`
- `src/components/navigation/MainNavigation.tsx`
- `src/components/navigation/Navbar.tsx`
- `src/components/pages/Page.tsx`
- `src/components/pages/admin/documents/AdminDocumentsPage.tsx`
- `src/components/pages/buyer/documents/BuyerDocumentsPage.tsx`
- `src/components/pages/developments/DevelopmentsPage.tsx`
- `src/components/pages/index.tsx`
- `src/components/pages/login/LoginPage.tsx`
- `src/components/pages/properties/PropertiesPage.tsx`
- `src/components/pages/register/RegisterPage.tsx`
- `src/components/pages/solicitor/SolicitorPage.tsx`
- `src/components/pages/test-api/TestapiPage.tsx`
- `src/components/properties/PropertyCard.tsx`
- `src/components/property/PropertyReservation.tsx`
- `src/components/property/PurchaseInitiation.tsx`
- `src/components/security/EnhancedSecurityDashboard.tsx`
- `src/components/security/MFAChallenge.tsx`
- `src/components/security/MFASetup.tsx`
- `src/components/security/SecurityAlerts.tsx`
- `src/components/security/SecurityDashboard.tsx`
- `src/components/security/SecurityMetricsChart.tsx`
- `src/components/security/SecurityMonitoringDashboard.tsx`
- `src/components/security/SecuritySetupWizard.tsx`
- `src/components/security/SecurityTimeline.tsx`
- `src/components/security/ThreatVisualization.tsx`
- `src/components/security/TrustedDevices.tsx`
- `src/components/security/mfa/MFASetup.tsx`
- `src/components/security/withCSRFProtection.tsx`
- `src/components/ui/RealTimeChat.tsx`
- `src/components/ui/alert.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/label.tsx`
- `src/components/ui/navigation-menu.tsx`
- `src/components/ui/sheet.tsx`
- `src/components/ui/sidebar.tsx`
- `src/components/ui/spinner.tsx`
- `src/components/ui/toast.tsx`
- `src/components/ui/toggle-group.tsx`
- `src/components/ui/toggle.tsx`
- `src/config/environment.ts`
- `src/config/index.ts`
- `src/context/AuthContext.tsx`
- `src/context/DevAuthContext.tsx`
- `src/context/NotificationContext.tsx`
- `src/data/mockDevelopments.ts`
- `src/hooks/use-amplify-data.ts`
- `src/hooks/useAuth.tsx`
- `src/hooks/useDocumentTemplates.ts`
- `src/hooks/useFormWithToast.ts`
- `src/hooks/useOrganisation.ts`
- `src/hooks/usePermissions.ts`
- `src/hooks/useSecurityMonitor.ts`
- `src/hooks/useSecuritySettings.ts`
- `src/lib/ModelLoaderComponent.tsx`
- `src/lib/amplify/api.ts`
- `src/lib/amplify/auth/mfa.ts`
- `src/lib/amplify/auth.ts`
- `src/lib/amplify/config.ts`
- `src/lib/amplify/index.ts`
- `src/lib/amplify/interceptors.ts`
- `src/lib/amplify/server-adapter.ts`
- `src/lib/amplify/types.ts`
- `src/lib/amplify-client.ts`
- `src/lib/amplify-data.ts`
- `src/lib/amplify.ts`
- `src/lib/api-client.ts`
- `src/lib/auth.ts`
- `src/lib/data-service.ts`
- `src/lib/db/mappers.ts`
- `src/lib/features/featureFlags.ts`
- `src/lib/monitoring/apiPerformance.ts`
- `src/lib/security/amplify-integration.ts`
- `src/lib/security/analytics.ts`
- `src/lib/security/apiProtection.ts`
- `src/lib/security/auditLogger.ts`
- `src/lib/security/authLogger.ts`
- `src/lib/security/enhancedAnalytics.ts`
- `src/lib/security/errorHandling.ts`
- `src/lib/security/index.ts`
- `src/lib/security/mfa/index.ts`
- `src/lib/security/mfa/qrCodeGenerator.ts`
- `src/lib/security/mfa.ts`
- `src/lib/security/performanceCorrelation.ts`
- `src/lib/security/rateLimit.ts`
- `src/lib/security/securityAnalyticsClient.ts`
- `src/lib/security/securityPerformanceIntegration.ts`
- `src/lib/security/sessionFingerprint.ts`
- `src/lib/security/threatDetection.ts`
- `src/lib/security/urlSafetyCheck.ts`
- `src/lib/security/validation.ts`
- `src/lib/services/auth.ts`
- `src/lib/services/htb.ts`
- `src/lib/services/index.ts`
- `src/lib/services/sales.ts`
- `src/lib/supplierApi.ts`
- `src/middleware/security.ts`
- `src/middleware.ts`
- `src/pages/_app.tsx`
- `src/pages/admin/financial.tsx`
- `src/pages/auth/login.tsx`
- `src/pages/auth/register.tsx`
- `src/pages/buyer/dashboard.tsx`
- `src/services/api.ts`
- `src/services/apiClient.ts`
- `src/services/customization/CustomizationService.ts`
- `src/services/documentService.ts`
- `src/services/propertyService.ts`
- `src/services/supplychain/SupplyChainService.ts`
- `src/services/user-service.ts`
- `src/stories/Header.stories.ts`
- `src/stories/Header.tsx`
- `src/stories/Page.stories.ts`
- `src/stories/Page.tsx`
- `src/tests/dashboard/TestDashboard.tsx`
- `src/tests/security/amplifyV6SecurityIntegrationTest.ts`
- `src/tests/security/runTests.ts`
- `src/tests/security/scenarios.ts`
- `src/tests/security/testUtils.ts`
- `src/types/amplify/api.d.ts`
- `src/types/amplify/api.ts`
- `src/types/amplify/auth.d.ts`
- `src/types/amplify/auth.ts`
- `src/types/amplify/config.ts`
- `src/types/amplify/index.d.ts`
- `src/types/amplify/index.ts`
- `src/types/amplify/mfa.d.ts`
- `src/types/amplify.d.ts`
- `src/types/common/components.ts`
- `src/types/common/configuration.ts`
- `src/types/common/response.ts`
- `src/types/common/user.ts`
- `src/types/core/development.ts`
- `src/types/core/document.ts`
- `src/types/core/investor.ts`
- `src/types/core/location.ts`
- `src/types/core/marketing.ts`
- `src/types/core/project.ts`
- `src/types/core/sales.ts`
- `src/types/core/user.ts`
- `src/types/express.ts`
- `src/types/finance/investment-analysis.ts`
- `src/types/index.ts`
- `src/types/next-auth.d.ts`
- `src/utils/code-splitting.ts`
- `src/utils/performance/apiBatcher.ts`
- `src/utils/performance/monitor.tsx`
- `src/utils/performance/safeCache.ts`

### API Calls (237 files)

> **Warning**: High number of files matching this pattern, suggesting potential duplication of functionality.

- `src/__tests__/middleware.test.ts`
- `src/api/auth/login/[...nextauth]/route.ts`
- `src/api/index.ts`
- `src/app/about/page.tsx`
- `src/app/api/contractors/route.ts`
- `src/app/api/customization/options/route.ts`
- `src/app/api/customization/route.ts`
- `src/app/api/customizations/route.ts`
- `src/app/api/developments/route.ts`
- `src/app/api/documents/route.ts`
- `src/app/api/finance/budget-vs-actual/route.ts`
- `src/app/api/finance/projections/route.ts`
- `src/app/api/finance/route.ts`
- `src/app/api/htb-claims/route.ts`
- `src/app/api/projects/[id]/activity/route.ts`
- `src/app/api/projects/[id]/alerts/route.ts`
- `src/app/api/projects/[id]/route.ts`
- `src/app/api/projects/[id]/sales/route.ts`
- `src/app/api/projects/[id]/timeline/route.ts`
- `src/app/api/projects/route.ts`
- `src/app/api/properties/route.ts`
- `src/app/api/sales/route.ts`
- `src/app/api/security/log/route.ts`
- `src/app/api/units/route.ts`
- `src/app/buyer/customization/layout.tsx`
- `src/app/buyer/customization/page.tsx`
- `src/app/buyer/htb/buyer/HTBClaimProcess.tsx`
- `src/app/buyer/htb/buyer/HTBStatusViewer.tsx`
- `src/app/buyer/htb/buyer/developer/HTBClaimsDashboard.tsx`
- `src/app/contact/page.tsx`
- `src/app/dashboard/@main/page.tsx`
- `src/app/dashboard/@main/security/page.tsx`
- `src/app/dashboard/security/EnhancedSecurityDashboardPage.tsx`
- `src/app/dashboard/security/SecurityDashboardClient.tsx`
- `src/app/dashboard/security/page.tsx`
- `src/app/developer/documents/page.tsx`
- `src/app/developer/layout.tsx`
- `src/app/developer/project/[id]/page.tsx`
- `src/app/developer/project/[id]/sales/page.tsx`
- `src/app/developer/project/[id]/timeline/page.tsx`
- `src/app/developer/project/new/page.tsx`
- `src/app/developer/projects/page.tsx`
- `src/app/developments/[id]/page.tsx`
- `src/app/examples/developments/page.tsx`
- `src/app/prop/dashboard/page.tsx`
- `src/app/properties/[id]/page.tsx`
- `src/app/properties/search/page.tsx`
- `src/app/property/page.tsx`
- `src/aws-exports.js`
- `src/components/3d/RoomVisualizer.old.tsx`
- `src/components/3d/RoomVisualizer.tsx`
- `src/components/AmplifyDataFetcher.tsx`
- `src/components/HomePage.tsx`
- `src/components/QueryClientWrapper.tsx`
- `src/components/about/AboutTeam.tsx`
- `src/components/about/Hero.tsx`
- `src/components/about/Team.tsx`
- `src/components/accessibility/ScreenReaderText.stories.tsx`
- `src/components/admin/AdminDocumentReview.tsx`
- `src/components/admin/AdminFinancialDashboard.tsx`
- `src/components/admin/EnhancedSecurityDashboard.tsx`
- `src/components/admin/FeatureFlagManager.tsx`
- `src/components/admin/PerformanceDashboard.tsx`
- `src/components/auth/AuthErrorBoundary.tsx`
- `src/components/auth/RegisterForm.tsx`
- `src/components/buyer/BuyerDashboardContent.tsx`
- `src/components/buyer/BuyerFinancialDashboard.tsx`
- `src/components/buyer/DocumentManager.tsx`
- `src/components/buyer/DocumentUpload.tsx`
- `src/components/buyer/PurchaseDetail.tsx`
- `src/components/buyer/PurchaseList.tsx`
- `src/components/contact/ContactFaq.tsx`
- `src/components/contact/ContactForm.tsx`
- `src/components/contact/ContactInfo.tsx`
- `src/components/contact/ContactMap.tsx`
- `src/components/contact/ContactSocialCta.tsx`
- `src/components/contact/Faq.tsx`
- `src/components/contact/Hero.tsx`
- `src/components/contact/Map.tsx`
- `src/components/contact/Offices.tsx`
- `src/components/dashboard/BuyerDashboard.tsx`
- `src/components/dashboard/DeveloperDashboard.tsx`
- `src/components/dashboard/ProjectOverview.tsx`
- `src/components/dashboard/PropertyCustomizer.tsx`
- `src/components/developer/DeveloperDashboard.tsx`
- `src/components/developer/MicrosoftIntegration.tsx`
- `src/components/developer/project/fitzgerald-gardens/sales/page.tsx`
- `src/components/developer/project/fitzgerald-gardens/units/page.tsx`
- `src/components/developer/project/new/page.tsx`
- `src/components/developer/project/wizard/PlanningPermissionUpload.tsx`
- `src/components/developer/project/wizard/SitePlanUpload.tsx`
- `src/components/development/DevelopmentDetail.tsx`
- `src/components/document/DocumentComplianceTracker.tsx`
- `src/components/documents/DocumentGenerator.tsx`
- `src/components/documents/DocumentManager.tsx`
- `src/components/examples/DevelopmentList.tsx`
- `src/components/features/FeatureFlagAdmin.tsx`
- `src/components/features/development/DevelopmentList.tsx`
- `src/components/htb/HelpToBuyClaimUpload.tsx`
- `src/components/htb/developer/HTBClaimProcessor.tsx`
- `src/components/htb/developer/HTBClaimsDashboard.tsx`
- `src/components/htb/shared/HTBStepIndicator.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Header.tsx`
- `src/components/navigation/ConsistentNavigation.tsx`
- `src/components/navigation/MainNavigation.tsx`
- `src/components/pages/buyer/htb/BuyerHtbPage.tsx`
- `src/components/pages/buyer/htb/status/BuyerHtbStatusPage.tsx`
- `src/components/pages/developer/DeveloperPage.tsx`
- `src/components/pages/developer/new-project/DeveloperNew-projectPage.tsx`
- `src/components/pages/index.tsx`
- `src/components/pages/login/LoginPage.tsx`
- `src/components/pages/register/RegisterPage.tsx`
- `src/components/pages/solicitor/SolicitorPage.tsx`
- `src/components/pages/test-api/TestapiPage.tsx`
- `src/components/performance/PerformanceMonitor.tsx`
- `src/components/properties/PropertyCard.tsx`
- `src/components/property/PropertyCard.tsx`
- `src/components/property/PropertyDetail.tsx`
- `src/components/property/PropertyListing.tsx`
- `src/components/property/PurchaseInitiation.tsx`
- `src/components/sales/SalesProgressBar.tsx`
- `src/components/sales/SalesProgressTracker.tsx`
- `src/components/sections/AboutSection.jsx`
- `src/components/security/ClientSecurityProvider.tsx`
- `src/components/security/MFASetup.tsx`
- `src/components/security/OptimizedSecurityDashboard.tsx`
- `src/components/security/SecurityDashboard.tsx`
- `src/components/security/SecurityMonitoringDashboard.tsx`
- `src/components/security/TrustedDevices.tsx`
- `src/components/security/mfa/MFASetup.tsx`
- `src/components/security/withCSRFProtection.tsx`
- `src/components/timeline/ProjectTimeline.tsx`
- `src/components/ui/LoadingSpinner.tsx`
- `src/components/ui/RealTimeChat.tsx`
- `src/components/ui/carousel.tsx`
- `src/components/ui/loading-skeleton.stories.tsx`
- `src/config/environment.ts`
- `src/config/index.ts`
- `src/context/HTBContext.tsx`
- `src/context/NotificationContext.tsx`
- `src/data/developments.ts`
- `src/data/mock-models.ts`
- `src/data/mockDevelopments.ts`
- `src/hooks/api-hooks.ts`
- `src/hooks/use-amplify-data.ts`
- `src/hooks/useAuth.tsx`
- `src/hooks/useDashboardData.ts`
- `src/hooks/useDocumentTemplates.ts`
- `src/hooks/useFormWithToast.ts`
- `src/hooks/useGraphQL.ts`
- `src/hooks/useOrganisation.ts`
- `src/hooks/useSecurityMonitor.ts`
- `src/hooks/useSecurityPerformance.ts`
- `src/lib/ModelLoaderComponent.tsx`
- `src/lib/amplify/api.ts`
- `src/lib/amplify/auth/mfa.ts`
- `src/lib/amplify/auth.ts`
- `src/lib/amplify/cache.ts`
- `src/lib/amplify/config.ts`
- `src/lib/amplify/server-adapter.ts`
- `src/lib/amplify/server-helpers.ts`
- `src/lib/amplify/server.ts`
- `src/lib/amplify-data.ts`
- `src/lib/amplify.ts`
- `src/lib/analytics.ts`
- `src/lib/api/fetchWithCache.ts`
- `src/lib/api-client.ts`
- `src/lib/api.ts`
- `src/lib/auth.ts`
- `src/lib/cache/clientCache.ts`
- `src/lib/cache/dataCache.ts`
- `src/lib/data-service.ts`
- `src/lib/features/featureFlags.ts`
- `src/lib/monitoring/apiPerformance.ts`
- `src/lib/react-query-config.ts`
- `src/lib/security/amplify-integration.ts`
- `src/lib/security/apiProtection.ts`
- `src/lib/security/auditLogger.ts`
- `src/lib/security/authLogger.ts`
- `src/lib/security/cachedSecurityApi.ts`
- `src/lib/security/enhancedAnalytics.ts`
- `src/lib/security/errorHandling.ts`
- `src/lib/security/index.ts`
- `src/lib/security/mfa.ts`
- `src/lib/security/performanceCorrelation.ts`
- `src/lib/security/sanitize.ts`
- `src/lib/security/securityAnalyticsClient.ts`
- `src/lib/security/securityAnalyticsServer.ts`
- `src/lib/security/securityPerformanceIntegration.ts`
- `src/lib/security/sessionFingerprint.ts`
- `src/lib/security/urlSafetyCheck.ts`
- `src/lib/security/useSecurityMonitor.ts`
- `src/lib/security/validation.ts`
- `src/lib/services/auth.ts`
- `src/lib/services/documents.ts`
- `src/lib/services/htb.ts`
- `src/lib/services/properties.ts`
- `src/lib/services/sales.ts`
- `src/lib/services/units.ts`
- `src/lib/services/users.ts`
- `src/lib/supplierApi.ts`
- `src/services/DevelopmentService.ts`
- `src/services/api.ts`
- `src/services/apiClient.ts`
- `src/services/apiDataService.ts`
- `src/services/customization/CustomizationService.ts`
- `src/services/data-service/index.ts`
- `src/services/data-service/mock.ts`
- `src/services/document-service.ts`
- `src/services/documentService.ts`
- `src/services/htbService.ts`
- `src/services/propertyService.ts`
- `src/services/supplychain/SupplyChainService.ts`
- `src/stories/Button.stories.ts`
- `src/stories/Header.stories.ts`
- `src/stories/Header.tsx`
- `src/stories/Page.stories.ts`
- `src/stories/Page.tsx`
- `src/tests/dashboard/TestDashboard.tsx`
- `src/tests/security/amplifyV6SecurityIntegrationTest.ts`
- `src/tests/security/securityIntegrationTest.ts`
- `src/tests/security/testUtils.ts`
- `src/types/amplify/api.ts`
- `src/types/amplify.d.ts`
- `src/types/api.ts`
- `src/types/common/configuration.ts`
- `src/types/common/index.ts`
- `src/types/core/document.ts`
- `src/types/development/index.ts`
- `src/utils/code-splitting.ts`
- `src/utils/performance/apiBatcher.ts`
- `src/utils/performance/dataCache.ts`
- `src/utils/performance/lazyLoad.tsx`
- `src/utils/performance/monitor.tsx`
- `src/utils/performance/react-cache-polyfill.ts`
- `src/utils/performance/safeCache.ts`

### Data Hooks (442 files)

> **Warning**: High number of files matching this pattern, suggesting potential duplication of functionality.

- `src/__tests__/middleware.test.ts`
- `src/api/auth/login/route.ts`
- `src/api/index.ts`
- `src/app/ClientLayout.tsx`
- `src/app/about/page.tsx`
- `src/app/api/auth/[...nextauth]/auth-helpers.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/register/route.ts`
- `src/app/api/customization/options/route.ts`
- `src/app/api/customization/route.ts`
- `src/app/api/customizations/route.ts`
- `src/app/api/documents/route.ts`
- `src/app/api/finance/budget-vs-actual/route.ts`
- `src/app/api/finance/projections/route.ts`
- `src/app/api/finance/route.ts`
- `src/app/api/htb-claims/route.ts`
- `src/app/api/monitoring/api-metrics/route.ts`
- `src/app/api/projects/[id]/activity/route.ts`
- `src/app/api/projects/[id]/alerts/route.ts`
- `src/app/api/projects/[id]/route.ts`
- `src/app/api/projects/[id]/sales/route.ts`
- `src/app/api/projects/[id]/timeline/route.ts`
- `src/app/api/projects/route.ts`
- `src/app/api/sales/route.ts`
- `src/app/api/security/log/route.ts`
- `src/app/api/security/report/route.ts`
- `src/app/api/units/route.ts`
- `src/app/api/users/me/route.ts`
- `src/app/api/users/route.ts`
- `src/app/buyer/customization/page.tsx`
- `src/app/buyer/htb/HTBErrorBoundary.tsx`
- `src/app/buyer/htb/HTBErrorWrapper.tsx`
- `src/app/buyer/htb/buyer/HTBClaimProcess.tsx`
- `src/app/buyer/htb/buyer/HTBStatusViewer.tsx`
- `src/app/buyer/htb/buyer/developer/HTBClaimProcessor.tsx`
- `src/app/buyer/htb/buyer/developer/HTBClaimsDashboard.tsx`
- `src/app/contact/page.tsx`
- `src/app/dashboard/@main/page.tsx`
- `src/app/dashboard/@main/profile/page.tsx`
- `src/app/dashboard/@main/security/page.tsx`
- `src/app/dashboard/@sidebar/default.tsx`
- `src/app/dashboard/layout.tsx`
- `src/app/dashboard/security/EnhancedSecurityDashboardPage.tsx`
- `src/app/dashboard/security/SecurityDashboardClient.tsx`
- `src/app/developer/documents/page.tsx`
- `src/app/developer/finance/page.tsx`
- `src/app/developer/layout.tsx`
- `src/app/developer/project/[id]/page.tsx`
- `src/app/developer/project/[id]/sales/page.tsx`
- `src/app/developer/project/[id]/timeline/page.tsx`
- `src/app/developer/project/new/page.tsx`
- `src/app/developer/projects/page.tsx`
- `src/app/developer/properties/page.tsx`
- `src/app/developments/[id]/page.tsx`
- `src/app/login/page.tsx`
- `src/app/projects/[slug]/page.tsx`
- `src/app/projects/[slug]/units/[id]/page.tsx`
- `src/app/projects/propprojects/units/unit11/[slug]/units/page.tsx`
- `src/app/prop/dashboard/page.tsx`
- `src/app/prop/projects/page.tsx`
- `src/app/prop/templates/page.tsx`
- `src/app/properties/[id]/page.tsx`
- `src/app/properties/page.tsx`
- `src/app/properties/search/page.tsx`
- `src/app/property/page.tsx`
- `src/app/register/page.tsx`
- `src/app/user/security/setup/page.tsx`
- `src/aws-exports.d.ts`
- `src/aws-exports.js`
- `src/components/3d/ModelViewer.tsx`
- `src/components/3d/RoomVisualizer.old.tsx`
- `src/components/3d/RoomVisualizer.tsx`
- `src/components/AmplifyDataFetcher.tsx`
- `src/components/AmplifyProvider.tsx`
- `src/components/AppWrapper.tsx`
- `src/components/AuthProvider.tsx`
- `src/components/CustomizationSummary.tsx`
- `src/components/HomePage.tsx`
- `src/components/QueryClientWrapper.tsx`
- `src/components/about/AboutCta.tsx`
- `src/components/about/AboutHero.tsx`
- `src/components/about/AboutMission.tsx`
- `src/components/about/AboutPageClient.tsx`
- `src/components/about/AboutTeam.tsx`
- `src/components/about/AboutTimeline.tsx`
- `src/components/about/AboutValues.tsx`
- `src/components/about/Timeline.tsx`
- `src/components/about/Values.tsx`
- `src/components/accessibility/AccessibleForm.stories.tsx`
- `src/components/accessibility/AccessibleForm.tsx`
- `src/components/accessibility/KeyboardFocusHandler.tsx`
- `src/components/accessibility/ScreenReaderText.stories.tsx`
- `src/components/accessibility/ScreenReaderText.tsx`
- `src/components/admin/AdminDocumentReview.tsx`
- `src/components/admin/AdminFinancialDashboard.tsx`
- `src/components/admin/EnhancedSecurityDashboard.tsx`
- `src/components/admin/FeatureFlagManager.tsx`
- `src/components/admin/PerformanceDashboard.tsx`
- `src/components/analytics/PerformanceChart.tsx`
- `src/components/auth/AuthErrorBoundary.tsx`
- `src/components/auth/LoginForm.stories.tsx`
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/ProtectedRoute.tsx`
- `src/components/auth/RegisterForm.tsx`
- `src/components/auth/UserRegistration.tsx`
- `src/components/buyer/BuyerDashboard.tsx`
- `src/components/buyer/BuyerDashboardContent.tsx`
- `src/components/buyer/BuyerDashboardSidebar.tsx`
- `src/components/buyer/BuyerFinancialDashboard.tsx`
- `src/components/buyer/CustomizationPageContent.tsx`
- `src/components/buyer/DocumentManager.tsx`
- `src/components/buyer/DocumentUpload.tsx`
- `src/components/buyer/PurchaseDetail.tsx`
- `src/components/buyer/PurchaseList.tsx`
- `src/components/construction/SnagListItem.tsx`
- `src/components/construction/TasksList.tsx`
- `src/components/contact/ContactFaq.tsx`
- `src/components/contact/ContactForm.tsx`
- `src/components/contact/ContactHero.tsx`
- `src/components/contact/ContactMap.tsx`
- `src/components/contact/ContactOffices.tsx`
- `src/components/contact/ContactPageClient.tsx`
- `src/components/contact/ContactSocialCta.tsx`
- `src/components/contact/Map.tsx`
- `src/components/dashboard/AlertsList.tsx`
- `src/components/dashboard/BuyerDashboard.tsx`
- `src/components/dashboard/DeveloperDashboard.tsx`
- `src/components/dashboard/ProjectOverview.tsx`
- `src/components/dashboard/PropertyCustomizer.tsx`
- `src/components/dashboard/TasksList.tsx`
- `src/components/dashboard/index.tsx`
- `src/components/developer/DeveloperDashboard.tsx`
- `src/components/developer/DeveloperHeader.tsx`
- `src/components/developer/DeveloperSidebar.tsx`
- `src/components/developer/DeveloperThemeProvider.tsx`
- `src/components/developer/DeveloperThemeToggle.tsx`
- `src/components/developer/DocumentGeneration.tsx`
- `src/components/developer/FinancialDashboard.tsx`
- `src/components/developer/MicrosoftIntegration.tsx`
- `src/components/developer/ProfessionalAppointments.tsx`
- `src/components/developer/project/fitzgerald-gardens/page.tsx`
- `src/components/developer/project/fitzgerald-gardens/sales/page.tsx`
- `src/components/developer/project/fitzgerald-gardens/units/page.tsx`
- `src/components/developer/project/new/page.tsx`
- `src/components/developer/project/wizard/PlanningPermissionUpload.tsx`
- `src/components/developer/project/wizard/ProjectBasicInfo.tsx`
- `src/components/developer/project/wizard/ScheduleOfAccommodation.tsx`
- `src/components/developer/project/wizard/SitePlanUpload.tsx`
- `src/components/development/DevelopmentDetail.tsx`
- `src/components/document/DocumentCategoryProgress.tsx`
- `src/components/document/DocumentComplianceTracker.tsx`
- `src/components/document/DocumentFilterBar.tsx`
- `src/components/document/DocumentTimeline.tsx`
- `src/components/document/DocumentUploadDialog.tsx`
- `src/components/documents/DocumentFilterPanel.tsx`
- `src/components/documents/DocumentGenerator.tsx`
- `src/components/documents/DocumentManager.tsx`
- `src/components/documents/DocumentUploader.tsx`
- `src/components/examples/DevelopmentList.tsx`
- `src/components/features/FeatureFlag.tsx`
- `src/components/features/FeatureFlagAdmin.tsx`
- `src/components/features/home/HeroSection.tsx`
- `src/components/finance/BudgetVsActualCard.tsx`
- `src/components/finance/FinancialDashboard.tsx`
- `src/components/finance/FinancialMetricCard.tsx`
- `src/components/finance/ProfitabilityAnalysis.tsx`
- `src/components/finance/ROICalculator.tsx`
- `src/components/finance/ScenarioComparison.tsx`
- `src/components/htb/HTBWrapper.tsx`
- `src/components/htb/HelpToBuyClaimUpload.tsx`
- `src/components/htb/developer/HTBClaimProcessor.tsx`
- `src/components/htb/developer/HTBClaimsDashboard.tsx`
- `src/components/htb/developer/forms/AccessCodeForm.tsx`
- `src/components/htb/developer/forms/AddNoteForm.tsx`
- `src/components/htb/developer/forms/ClaimCodeForm.tsx`
- `src/components/htb/developer/forms/CompleteClaimForm.tsx`
- `src/components/htb/developer/forms/DepositAppliedForm.tsx`
- `src/components/htb/developer/forms/DocumentUploadForm.tsx`
- `src/components/htb/developer/forms/FundsReceivedForm.tsx`
- `src/components/htb/developer/forms/RequestFundsForm.tsx`
- `src/components/investor/InvestorMode.tsx`
- `src/components/investor/InvestorModeContext.tsx`
- `src/components/investor/InvestorModeToggle.tsx`
- `src/components/investor/index.ts`
- `src/components/layout/AppWrapper.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/Layout.tsx`
- `src/components/layout/MainNavigation.jsx`
- `src/components/navigation/ConsistentNavigation.tsx`
- `src/components/navigation/MainNavigation.tsx`
- `src/components/navigation/Navbar.tsx`
- `src/components/navigation/NavigationErrorBoundary.tsx`
- `src/components/navigation/Sidebar.tsx`
- `src/components/pages/Page.tsx`
- `src/components/pages/buyer/htb/BuyerHtbPage.tsx`
- `src/components/pages/buyer/htb/status/BuyerHtbStatusPage.tsx`
- `src/components/pages/developer/DeveloperPage.tsx`
- `src/components/pages/developer/new-project/DeveloperNew-projectPage.tsx`
- `src/components/pages/developments/DevelopmentSiteMap.tsx`
- `src/components/pages/developments/DevelopmentsList.tsx`
- `src/components/pages/developments/DevelopmentsPage.tsx`
- `src/components/pages/index.tsx`
- `src/components/pages/kyc-verifcationpage/Kyc-verifcationPage.tsx`
- `src/components/pages/login/LoginPage.tsx`
- `src/components/pages/properties/PropertiesPage.tsx`
- `src/components/pages/register/RegisterPage.tsx`
- `src/components/pages/solicitor/SolicitorPage.tsx`
- `src/components/pages/test-api/TestapiPage.tsx`
- `src/components/performance/LazyComponent.tsx`
- `src/components/performance/OptimizedComponent.tsx`
- `src/components/performance/PerformanceExample.tsx`
- `src/components/performance/PerformanceMonitor.tsx`
- `src/components/performance/VirtualizedList.tsx`
- `src/components/property/DevelopmentSiteMap.tsx`
- `src/components/property/PropertyDetail.tsx`
- `src/components/property/PropertyListing.tsx`
- `src/components/property/PropertyReservation.tsx`
- `src/components/property/PurchaseFlow.tsx`
- `src/components/property/PurchaseInitiation.tsx`
- `src/components/sales/SalesProgressTracker.tsx`
- `src/components/security/CSRFToken.tsx`
- `src/components/security/ClientSecurityProvider.tsx`
- `src/components/security/EnhancedSecurityDashboard.tsx`
- `src/components/security/MFAChallenge.tsx`
- `src/components/security/MFASetup.tsx`
- `src/components/security/OptimizedSecurityDashboard.tsx`
- `src/components/security/SafeLink.tsx`
- `src/components/security/SecurityAlerts.tsx`
- `src/components/security/SecurityDashboard.tsx`
- `src/components/security/SecurityMetricsChart.tsx`
- `src/components/security/SecurityMetricsSkeleton.tsx`
- `src/components/security/SecurityMonitor.tsx`
- `src/components/security/SecurityMonitoringDashboard.tsx`
- `src/components/security/SecuritySetupWizard.tsx`
- `src/components/security/SecurityTimeline.tsx`
- `src/components/security/ThreatVisualization.tsx`
- `src/components/security/TrustedDevices.tsx`
- `src/components/security/mfa/MFASetup.tsx`
- `src/components/security/withCSRFProtection.tsx`
- `src/components/timeline/DependencyLines.tsx`
- `src/components/timeline/ProjectTimeline.tsx`
- `src/components/timeline/TimelineToolbar.tsx`
- `src/components/ui/LoadingOverlay.tsx`
- `src/components/ui/NotificationCenter.tsx`
- `src/components/ui/RealTimeChat.tsx`
- `src/components/ui/carousel.tsx`
- `src/components/ui/chart.tsx`
- `src/components/ui/context-menu.tsx`
- `src/components/ui/dropdown-menu.tsx`
- `src/components/ui/error-boundary.stories.tsx`
- `src/components/ui/form-field.stories.tsx`
- `src/components/ui/form-field.tsx`
- `src/components/ui/form.tsx`
- `src/components/ui/input-otp.tsx`
- `src/components/ui/loading-skeleton.stories.tsx`
- `src/components/ui/sidebar.tsx`
- `src/components/ui/sonner.tsx`
- `src/components/ui/toast.stories.tsx`
- `src/components/ui/toast.tsx`
- `src/components/ui/toggle-group.tsx`
- `src/components/units/CustomizationOptions.tsx`
- `src/components/units/UnitCard.tsx`
- `src/config/environment.ts`
- `src/config/index.ts`
- `src/context/AuthContext.tsx`
- `src/context/CustomizationContext.tsx`
- `src/context/DevAuthContext.tsx`
- `src/context/HTBContext.tsx`
- `src/context/NotificationContext.tsx`
- `src/data/mock-models.ts`
- `src/hooks/api-hooks.ts`
- `src/hooks/use-amplify-data.ts`
- `src/hooks/use-mobile.tsx`
- `src/hooks/useAuth.tsx`
- `src/hooks/useClientSecurity.ts`
- `src/hooks/useDashboardData.ts`
- `src/hooks/useDocumentTemplates.ts`
- `src/hooks/useFormWithToast.ts`
- `src/hooks/useGraphQL.ts`
- `src/hooks/useOrganisation.ts`
- `src/hooks/usePerformanceMonitor.ts`
- `src/hooks/usePermissions.ts`
- `src/hooks/useSecurityFeatures.ts`
- `src/hooks/useSecurityMonitor.ts`
- `src/hooks/useSecurityPerformance.ts`
- `src/hooks/useSecuritySettings.ts`
- `src/hooks/useToast.ts`
- `src/lib/ModelLoaderComponent.tsx`
- `src/lib/amplify/api.ts`
- `src/lib/amplify/auth/mfa.ts`
- `src/lib/amplify/auth.ts`
- `src/lib/amplify/cache.ts`
- `src/lib/amplify/config.ts`
- `src/lib/amplify/index.ts`
- `src/lib/amplify/server-adapter.ts`
- `src/lib/amplify/server-helpers.ts`
- `src/lib/amplify/server.ts`
- `src/lib/amplify/storage.ts`
- `src/lib/amplify/types.ts`
- `src/lib/amplify-client.ts`
- `src/lib/amplify-data.ts`
- `src/lib/amplify.ts`
- `src/lib/analytics.ts`
- `src/lib/api-client.ts`
- `src/lib/api.ts`
- `src/lib/auth.ts`
- `src/lib/cache/clientCache.ts`
- `src/lib/data-service.ts`
- `src/lib/db/index.ts`
- `src/lib/db/mappers.ts`
- `src/lib/db/schema.ts`
- `src/lib/environment.ts`
- `src/lib/eventBus.ts`
- `src/lib/features/featureFlags.ts`
- `src/lib/mock.ts`
- `src/lib/monitoring/apiPerformance.ts`
- `src/lib/react-query-config.ts`
- `src/lib/security/amplify-integration.ts`
- `src/lib/security/analytics.ts`
- `src/lib/security/apiProtection.ts`
- `src/lib/security/auditLogger.ts`
- `src/lib/security/authLogger.ts`
- `src/lib/security/cachedSecurityApi.ts`
- `src/lib/security/enhancedAnalytics.ts`
- `src/lib/security/errorHandling.ts`
- `src/lib/security/index.ts`
- `src/lib/security/lazySecurityFeatures.ts`
- `src/lib/security/mfa/index.ts`
- `src/lib/security/mfa/qrCodeGenerator.ts`
- `src/lib/security/mfa.ts`
- `src/lib/security/performanceCorrelation.ts`
- `src/lib/security/sanitize.ts`
- `src/lib/security/securityAnalyticsClient.ts`
- `src/lib/security/securityAnalyticsTypes.ts`
- `src/lib/security/securityPerformanceIntegration.ts`
- `src/lib/security/sessionFingerprint.ts`
- `src/lib/security/urlSafetyCheck.ts`
- `src/lib/security/useSecurityMonitor.ts`
- `src/lib/security/validation.ts`
- `src/lib/services/__mocks__/users.ts`
- `src/lib/services/auth.ts`
- `src/lib/services/documents.ts`
- `src/lib/services/index.ts`
- `src/lib/services/users.ts`
- `src/lib/three-types.ts`
- `src/lib/utils/safeCache.ts`
- `src/middleware/security.ts`
- `src/middleware.ts`
- `src/pages/_app.tsx`
- `src/services/customization/CustomizationService.ts`
- `src/services/data-service/index.ts`
- `src/services/data-service/mock.ts`
- `src/services/document-service.ts`
- `src/services/documentService.ts`
- `src/services/htbServiceMock.ts`
- `src/services/index.ts`
- `src/services/mockDataService.ts`
- `src/services/propertyService.ts`
- `src/services/sales-service.ts`
- `src/services/user-service.ts`
- `src/stories/Button.tsx`
- `src/stories/Header.stories.ts`
- `src/stories/Header.tsx`
- `src/stories/Page.stories.ts`
- `src/stories/Page.tsx`
- `src/tests/dashboard/TestDashboard.tsx`
- `src/tests/security/TestRunnerUI.tsx`
- `src/tests/security/amplifyV6SecurityIntegrationTest.ts`
- `src/tests/security/runTests.ts`
- `src/tests/security/scenarios.ts`
- `src/tests/security/securityIntegrationTest.ts`
- `src/tests/security/testUtils.ts`
- `src/types/amplify/api.d.ts`
- `src/types/amplify/api.ts`
- `src/types/amplify/auth.d.ts`
- `src/types/amplify/auth.ts`
- `src/types/amplify/aws-sdk-types.d.ts`
- `src/types/amplify/config.ts`
- `src/types/amplify/index.d.ts`
- `src/types/amplify/index.ts`
- `src/types/amplify/storage.ts`
- `src/types/amplify.d.ts`
- `src/types/api.ts`
- `src/types/common/components.ts`
- `src/types/common/configuration.ts`
- `src/types/common/index.ts`
- `src/types/common/response.ts`
- `src/types/common/security-performance.ts`
- `src/types/common/status.ts`
- `src/types/common/user.ts`
- `src/types/common.ts`
- `src/types/core/analytics.ts`
- `src/types/core/development.ts`
- `src/types/core/document.ts`
- `src/types/core/financial.ts`
- `src/types/core/index.ts`
- `src/types/core/investor.ts`
- `src/types/core/location.ts`
- `src/types/core/marketing.ts`
- `src/types/core/professional.ts`
- `src/types/core/project.ts`
- `src/types/core/sales.ts`
- `src/types/core/unit.ts`
- `src/types/core/user.ts`
- `src/types/custom.d.ts`
- `src/types/customization.d.ts`
- `src/types/customization.ts`
- `src/types/dashboard.ts`
- `src/types/document.ts`
- `src/types/enums.ts`
- `src/types/environment.d.ts`
- `src/types/express.ts`
- `src/types/finance/cash-flow.ts`
- `src/types/finance/dashboard.ts`
- `src/types/finance/development-finance.ts`
- `src/types/finance/investment-analysis.ts`
- `src/types/htb.ts`
- `src/types/index.ts`
- `src/types/jsx-three-fiber.d.ts`
- `src/types/location.ts`
- `src/types/models.ts`
- `src/types/module-declarations.d.ts`
- `src/types/modules.d.ts`
- `src/types/next-auth.d.ts`
- `src/types/performance-types.d.ts`
- `src/types/project.ts`
- `src/types/properties.ts`
- `src/types/sales.ts`
- `src/types/unit.ts`
- `src/types/user.ts`
- `src/types.d.ts`
- `src/utils/paramValidator.ts`
- `src/utils/performance/dataCache.ts`
- `src/utils/performance/index.ts`
- `src/utils/performance/lazyLoad.tsx`
- `src/utils/performance/monitor.tsx`
- `src/utils/performance/react-cache-polyfill.ts`
- `src/utils/performance/react-cache-polyfill.tsx`
- `src/utils/performance/safeCache.ts`
- `src/utils/performance/safeMemo.tsx`
- `src/utils/performance/withMemo.tsx`

### Form Components (307 files)

> **Warning**: High number of files matching this pattern, suggesting potential duplication of functionality.

- `src/api/auth/login/[...nextauth]/route.ts`
- `src/app/api/auth/[...nextauth]/auth-helpers.ts`
- `src/app/api/customization/options/route.ts`
- `src/app/api/documents/route.ts`
- `src/app/api/finance/projections/route.ts`
- `src/app/api/monitoring/api-metrics/route.ts`
- `src/app/api/projects/[id]/timeline/route.ts`
- `src/app/api/projects/route.ts`
- `src/app/api/properties/route.ts`
- `src/app/api/sales/route.ts`
- `src/app/api/security/log/route.ts`
- `src/app/api/security/report/route.ts`
- `src/app/buyer/htb/buyer/HTBClaimProcess.tsx`
- `src/app/buyer/htb/buyer/HTBStatusViewer.tsx`
- `src/app/buyer/htb/buyer/developer/HTBClaimsDashboard.tsx`
- `src/app/contact/page.tsx`
- `src/app/counter.ts`
- `src/app/dashboard/@main/profile/page.tsx`
- `src/app/dashboard/@main/security/page.tsx`
- `src/app/dashboard/security/EnhancedSecurityDashboardPage.tsx`
- `src/app/dashboard/security/SecurityDashboardClient.tsx`
- `src/app/dashboard/security/page.tsx`
- `src/app/dev/testing-dashboard/page.tsx`
- `src/app/developer/projects/page.tsx`
- `src/app/developer/properties/page.tsx`
- `src/app/layout.tsx`
- `src/app/login/page.tsx`
- `src/app/page.tsx`
- `src/app/projects/[slug]/units/[id]/page.tsx`
- `src/app/projects/propprojects/units/unit11/[slug]/units/page.tsx`
- `src/app/prop/dashboard/page.tsx`
- `src/app/properties/[id]/page.tsx`
- `src/app/properties/page.tsx`
- `src/app/properties/search/page.tsx`
- `src/app/property/page.tsx`
- `src/app/register/page.tsx`
- `src/components/3d/RoomVisualizer.old.tsx`
- `src/components/3d/RoomVisualizer.tsx`
- `src/components/AmplifyDataFetcher.tsx`
- `src/components/AppWrapper.tsx`
- `src/components/HomePage.tsx`
- `src/components/about/Cta.tsx`
- `src/components/about/Hero.tsx`
- `src/components/about/Mission.tsx`
- `src/components/about/Team.tsx`
- `src/components/about/Timeline.tsx`
- `src/components/accessibility/AccessibleForm.stories.tsx`
- `src/components/accessibility/AccessibleForm.tsx`
- `src/components/accessibility/KeyboardFocusHandler.tsx`
- `src/components/accessibility/ScreenReaderText.stories.tsx`
- `src/components/accessibility/ScreenReaderText.tsx`
- `src/components/admin/AdminDocumentReview.tsx`
- `src/components/admin/AdminFinancialDashboard.tsx`
- `src/components/admin/EnhancedSecurityDashboard.tsx`
- `src/components/admin/FeatureFlagManager.tsx`
- `src/components/admin/PerformanceDashboard.tsx`
- `src/components/analytics/PerformanceChart.tsx`
- `src/components/auth/AuthErrorBoundary.tsx`
- `src/components/auth/LoginForm.stories.tsx`
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/RegisterForm.tsx`
- `src/components/auth/UserRegistration.tsx`
- `src/components/buyer/BuyerDashboard.tsx`
- `src/components/buyer/BuyerFinancialDashboard.tsx`
- `src/components/buyer/DocumentUpload.tsx`
- `src/components/buyer/PurchaseDetail.tsx`
- `src/components/buyer/PurchaseList.tsx`
- `src/components/contact/ContactForm.tsx`
- `src/components/contact/ContactInfo.tsx`
- `src/components/contact/ContactPageClient.tsx`
- `src/components/contact/ContactSocialCta.tsx`
- `src/components/contact/Faq.tsx`
- `src/components/contact/SocialCta.tsx`
- `src/components/contact/index.ts`
- `src/components/dashboard/AlertsList.tsx`
- `src/components/dashboard/ProjectOverview.tsx`
- `src/components/dashboard/ProjectStatusCard.tsx`
- `src/components/dashboard/PropertyCustomizer.tsx`
- `src/components/dashboard/TasksList.tsx`
- `src/components/developer/DeveloperDashboard.tsx`
- `src/components/developer/DeveloperSidebar.tsx`
- `src/components/developer/DocumentGeneration.tsx`
- `src/components/developer/FinancialDashboard.tsx`
- `src/components/developer/MicrosoftIntegration.tsx`
- `src/components/developer/project/fitzgerald-gardens/page.tsx`
- `src/components/developer/project/fitzgerald-gardens/sales/page.tsx`
- `src/components/developer/project/wizard/PlanningPermissionUpload.tsx`
- `src/components/developer/project/wizard/ProjectBasicInfo.tsx`
- `src/components/developer/project/wizard/ScheduleOfAccommodation.tsx`
- `src/components/developer/project/wizard/SitePlanUpload.tsx`
- `src/components/development/DevelopmentDetail.tsx`
- `src/components/document/DocumentCategoryProgress.tsx`
- `src/components/document/DocumentListItem.tsx`
- `src/components/document/DocumentUploadDialog.tsx`
- `src/components/documents/DocumentGenerator.tsx`
- `src/components/documents/DocumentList.tsx`
- `src/components/documents/DocumentUploader.tsx`
- `src/components/features/development/DevelopmentList.tsx`
- `src/components/finance/BudgetVsActualCard.tsx`
- `src/components/finance/CashFlowSummaryCard.tsx`
- `src/components/finance/FinancialChart.tsx`
- `src/components/finance/FinancialDashboard.tsx`
- `src/components/finance/FinancialMetricCard.tsx`
- `src/components/finance/ProfitabilityAnalysis.tsx`
- `src/components/finance/ROICalculator.tsx`
- `src/components/finance/ScenarioComparison.tsx`
- `src/components/htb/HelpToBuyClaimUpload.tsx`
- `src/components/htb/developer/ClaimDetails.tsx`
- `src/components/htb/developer/ClaimDocuments.tsx`
- `src/components/htb/developer/ClaimNotes.tsx`
- `src/components/htb/developer/HTBClaimProcessor.tsx`
- `src/components/htb/developer/HTBClaimsDashboard.tsx`
- `src/components/htb/developer/forms/AccessCodeForm.tsx`
- `src/components/htb/developer/forms/AddNoteForm.tsx`
- `src/components/htb/developer/forms/ClaimCodeForm.tsx`
- `src/components/htb/developer/forms/CompleteClaimForm.tsx`
- `src/components/htb/developer/forms/DepositAppliedForm.tsx`
- `src/components/htb/developer/forms/DocumentUploadForm.tsx`
- `src/components/htb/developer/forms/FundsReceivedForm.tsx`
- `src/components/htb/developer/forms/RequestFundsForm.tsx`
- `src/components/htb/developer/forms/index.ts`
- `src/components/investor/InvestorMode.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/navigation/Footer.tsx`
- `src/components/pages/Page.tsx`
- `src/components/pages/buyer/htb/BuyerHtbPage.tsx`
- `src/components/pages/buyer/htb/status/BuyerHtbStatusPage.tsx`
- `src/components/pages/developer/DeveloperPage.tsx`
- `src/components/pages/developer/new-project/DeveloperNew-projectPage.tsx`
- `src/components/pages/developments/DevelopmentSiteMap.tsx`
- `src/components/pages/developments/DevelopmentsPage.tsx`
- `src/components/pages/index.tsx`
- `src/components/pages/kyc-verifcationpage/Kyc-verifcationPage.tsx`
- `src/components/pages/login/LoginPage.tsx`
- `src/components/pages/register/RegisterPage.tsx`
- `src/components/pages/solicitor/SolicitorPage.tsx`
- `src/components/pages/test-api/TestapiPage.tsx`
- `src/components/performance/OptimizedComponent.tsx`
- `src/components/performance/PerformanceExample.tsx`
- `src/components/performance/PerformanceMonitor.tsx`
- `src/components/properties/PropertyCard.tsx`
- `src/components/property/DevelopmentSiteMap.tsx`
- `src/components/property/PropertyCard.tsx`
- `src/components/property/PropertyDetail.tsx`
- `src/components/property/PropertyListing.tsx`
- `src/components/property/PropertyReservation.tsx`
- `src/components/property/PurchaseFlow.tsx`
- `src/components/property/PurchaseInitiation.tsx`
- `src/components/sales/DepositTracker.tsx`
- `src/components/sales/SalesProgressTracker.tsx`
- `src/components/sections/AboutSection.jsx`
- `src/components/security/AppSecurityProvider.tsx`
- `src/components/security/EnhancedSecurityDashboard.tsx`
- `src/components/security/MFAChallenge.tsx`
- `src/components/security/MFASetup.tsx`
- `src/components/security/OptimizedSecurityDashboard.tsx`
- `src/components/security/SecurityDashboard.tsx`
- `src/components/security/SecurityMetricsChart.tsx`
- `src/components/security/SecurityMonitor.tsx`
- `src/components/security/SecurityMonitoringDashboard.tsx`
- `src/components/security/SecurityTimeline.tsx`
- `src/components/security/ThreatVisualization.tsx`
- `src/components/security/TrustedDevices.tsx`
- `src/components/security/mfa/MFASetup.tsx`
- `src/components/security/withCSRFProtection.tsx`
- `src/components/timeline/ProjectTimeline.tsx`
- `src/components/timeline/TimelineHeader.tsx`
- `src/components/timeline/TimelineRow.tsx`
- `src/components/timeline/TimelineSummaryCards.tsx`
- `src/components/ui/RealTimeChat.tsx`
- `src/components/ui/accordion.tsx`
- `src/components/ui/chart.tsx`
- `src/components/ui/form-field.stories.tsx`
- `src/components/ui/form-field.tsx`
- `src/components/ui/form.tsx`
- `src/components/ui/loading-skeleton.stories.tsx`
- `src/components/ui/loading-skeleton.tsx`
- `src/components/ui/progress.tsx`
- `src/components/ui/sidebar.tsx`
- `src/components/ui/switch.tsx`
- `src/components/units/CustomizationOptions.tsx`
- `src/components/units/UnitCard.tsx`
- `src/config/environment.ts`
- `src/context/AuthContext.tsx`
- `src/hooks/useClientSecurity.ts`
- `src/hooks/useFormWithToast.ts`
- `src/hooks/usePerformanceMonitor.ts`
- `src/hooks/usePermissions.ts`
- `src/hooks/useSecurityMonitor.ts`
- `src/hooks/useSecurityPerformance.ts`
- `src/lib/ModelLoaderComponent.tsx`
- `src/lib/amplify/api.ts`
- `src/lib/amplify/config.ts`
- `src/lib/amplify/interceptors.ts`
- `src/lib/amplify/server-helpers.ts`
- `src/lib/amplify/storage.ts`
- `src/lib/amplify-data.ts`
- `src/lib/api/fetchWithCache.ts`
- `src/lib/api-client.ts`
- `src/lib/data-service.ts`
- `src/lib/db/index.ts`
- `src/lib/mock.ts`
- `src/lib/mongodb-helper.ts`
- `src/lib/mongodb.ts`
- `src/lib/monitoring/apiPerformance.ts`
- `src/lib/security/amplify-integration.ts`
- `src/lib/security/apiProtection.ts`
- `src/lib/security/authLogger.ts`
- `src/lib/security/cachedSecurityApi.ts`
- `src/lib/security/enhancedAnalytics.ts`
- `src/lib/security/errorHandling.ts`
- `src/lib/security/index.ts`
- `src/lib/security/lazySecurityFeatures.ts`
- `src/lib/security/mfa/index.ts`
- `src/lib/security/mfa/qrCodeGenerator.ts`
- `src/lib/security/performanceCorrelation.ts`
- `src/lib/security/rateLimit.ts`
- `src/lib/security/sanitize.ts`
- `src/lib/security/security-exports.ts`
- `src/lib/security/securityAnalyticsClient.ts`
- `src/lib/security/securityAnalyticsServer.ts`
- `src/lib/security/securityAnalyticsTypes.ts`
- `src/lib/security/securityPerformanceIntegration.ts`
- `src/lib/security/sessionFingerprint.ts`
- `src/lib/security/urlSafetyCheck.ts`
- `src/lib/security/useSecurityMonitor.ts`
- `src/lib/security/validation.ts`
- `src/lib/services/auth.ts`
- `src/lib/services/htb.ts`
- `src/lib/services/properties.ts`
- `src/lib/services/sales.ts`
- `src/lib/services/units.ts`
- `src/lib/services/users.ts`
- `src/lib/supplierApi.ts`
- `src/lib/utils/serverCache.ts`
- `src/middleware/security.ts`
- `src/middleware.ts`
- `src/pages/auth/login.tsx`
- `src/pages/auth/register.tsx`
- `src/services/api.ts`
- `src/services/base/BaseService.ts`
- `src/services/contract/ContractService.ts`
- `src/services/data-service/index.ts`
- `src/services/document-service.ts`
- `src/services/documentService.ts`
- `src/services/htbService.ts`
- `src/services/sales-service.ts`
- `src/tests/dashboard/TestDashboard.tsx`
- `src/tests/security/TestRunnerUI.tsx`
- `src/tests/security/amplifyV6SecurityIntegrationTest.ts`
- `src/tests/security/scenarios.ts`
- `src/tests/security/testUtils.ts`
- `src/types/amplify/api.ts`
- `src/types/amplify/auth.ts`
- `src/types/amplify/index.ts`
- `src/types/amplify/storage.ts`
- `src/types/common/components.ts`
- `src/types/common/configuration.ts`
- `src/types/common/index.ts`
- `src/types/common/response.ts`
- `src/types/common/security-performance.ts`
- `src/types/common/status.ts`
- `src/types/common/user.ts`
- `src/types/contact.ts`
- `src/types/core/analytics.ts`
- `src/types/core/development.ts`
- `src/types/core/financial.ts`
- `src/types/core/investor.ts`
- `src/types/core/location.ts`
- `src/types/core/marketing.ts`
- `src/types/core/professional.ts`
- `src/types/core/project.ts`
- `src/types/core/unit.ts`
- `src/types/core/user.ts`
- `src/types/dashboard.ts`
- `src/types/development/filters.ts`
- `src/types/development/models.ts`
- `src/types/development/responses.ts`
- `src/types/enums.ts`
- `src/types/external-libs.ts`
- `src/types/finance/cash-flow.ts`
- `src/types/finance/dashboard.ts`
- `src/types/finance/development-finance.ts`
- `src/types/finance/investment-analysis.ts`
- `src/types/index.ts`
- `src/types/location.ts`
- `src/types/models.ts`
- `src/types/module-declarations.d.ts`
- `src/types/modules.d.ts`
- `src/types/performance-types.d.ts`
- `src/types/search.ts`
- `src/types/testing-library.d.ts`
- `src/types/timeline.ts`
- `src/utils/code-splitting.ts`
- `src/utils/date-utils.ts`
- `src/utils/finance/calculations.ts`
- `src/utils/finance/formatting.ts`
- `src/utils/paramValidator.ts`
- `src/utils/performance/apiBatcher.ts`
- `src/utils/performance/dataCache.ts`
- `src/utils/performance/index.ts`
- `src/utils/performance/lazyLoad.tsx`
- `src/utils/performance/monitor.tsx`
- `src/utils/performance/optimizeComponent.tsx`
- `src/utils/performance/safeCache.ts`
- `src/utils/performance/safeMemo.tsx`
- `src/utils/performance/withMemo.tsx`

### Property Components (163 files)

> **Warning**: High number of files matching this pattern, suggesting potential duplication of functionality.

- `src/api/index.ts`
- `src/app/about/page.tsx`
- `src/app/api/customization/options/route.ts`
- `src/app/api/customization/route.ts`
- `src/app/api/customizations/route.ts`
- `src/app/api/documents/route.ts`
- `src/app/api/htb-claims/route.ts`
- `src/app/api/projects/[id]/sales/route.ts`
- `src/app/api/properties/route.ts`
- `src/app/buyer/customization/page.tsx`
- `src/app/buyer/htb/HTBErrorBoundary.tsx`
- `src/app/buyer/htb/buyer/HTBClaimProcess.tsx`
- `src/app/buyer/htb/buyer/HTBStatusViewer.tsx`
- `src/app/buyer/htb/buyer/developer/HTBClaimsDashboard.tsx`
- `src/app/contact/page.tsx`
- `src/app/dashboard/@main/page.tsx`
- `src/app/developments/[id]/page.tsx`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/projects/[slug]/page.tsx`
- `src/app/projects/[slug]/units/[id]/page.tsx`
- `src/app/projects/propprojects/units/unit11/[slug]/units/page.tsx`
- `src/app/prop/dashboard/page.tsx`
- `src/app/prop/projects/page.tsx`
- `src/app/prop/templates/page.tsx`
- `src/app/properties/[id]/page.tsx`
- `src/app/properties/page.tsx`
- `src/app/properties/search/page.tsx`
- `src/app/property/page.tsx`
- `src/app/register/page.tsx`
- `src/components/HomePage.tsx`
- `src/components/about/Cta.tsx`
- `src/components/about/Hero.tsx`
- `src/components/about/Mission.tsx`
- `src/components/about/Team.tsx`
- `src/components/about/Timeline.tsx`
- `src/components/about/Values.tsx`
- `src/components/admin/AdminDocumentReview.tsx`
- `src/components/admin/AdminFinancialDashboard.tsx`
- `src/components/buyer/BuyerDashboard.tsx`
- `src/components/buyer/BuyerDashboardContent.tsx`
- `src/components/buyer/BuyerFinancialDashboard.tsx`
- `src/components/buyer/CustomizationPageContent.tsx`
- `src/components/buyer/DocumentManager.tsx`
- `src/components/buyer/DocumentUpload.tsx`
- `src/components/buyer/PurchaseDetail.tsx`
- `src/components/buyer/PurchaseList.tsx`
- `src/components/contact/Faq.tsx`
- `src/components/contact/Offices.tsx`
- `src/components/contact/SocialCta.tsx`
- `src/components/dashboard/PropertyCustomizer.tsx`
- `src/components/developer/MicrosoftIntegration.tsx`
- `src/components/developer/project/wizard/types.ts`
- `src/components/development/DevelopmentDetail.tsx`
- `src/components/finance/ROICalculator.tsx`
- `src/components/htb/HelpToBuyClaimUpload.tsx`
- `src/components/htb/developer/ClaimDetails.tsx`
- `src/components/htb/developer/HTBClaimProcessor.tsx`
- `src/components/htb/developer/HTBClaimsDashboard.tsx`
- `src/components/investor/InvestorDashboard.tsx`
- `src/components/investor/InvestorMode.tsx`
- `src/components/investor/PropertyInvestmentMetrics.tsx`
- `src/components/investor/index.ts`
- `src/components/navigation/Footer.tsx`
- `src/components/pages/Page.tsx`
- `src/components/pages/buyer/htb/BuyerHtbPage.tsx`
- `src/components/pages/buyer/htb/status/BuyerHtbStatusPage.tsx`
- `src/components/pages/developer/DeveloperPage.tsx`
- `src/components/pages/developer/new-project/DeveloperNew-projectPage.tsx`
- `src/components/pages/developments/DevelopmentsList.tsx`
- `src/components/pages/developments/DevelopmentsPage.tsx`
- `src/components/pages/index.tsx`
- `src/components/pages/properties/PropertiesPage.tsx`
- `src/components/pages/register/RegisterPage.tsx`
- `src/components/pages/solicitor/SolicitorPage.tsx`
- `src/components/pages/test-api/TestapiPage.tsx`
- `src/components/performance/VirtualizedList.tsx`
- `src/components/properties/PropertyCard.tsx`
- `src/components/property/PropertyCard.tsx`
- `src/components/property/PropertyDetail.tsx`
- `src/components/property/PropertyListing.tsx`
- `src/components/property/PropertyReservation.tsx`
- `src/components/property/PurchaseFlow.tsx`
- `src/components/property/PurchaseInitiation.tsx`
- `src/components/sales/SalesProgressTracker.tsx`
- `src/components/sections/AboutSection.jsx`
- `src/components/ui/RealTimeChat.tsx`
- `src/components/ui/loading-skeleton.stories.tsx`
- `src/context/CustomizationContext.tsx`
- `src/context/HTBContext.tsx`
- `src/context/NotificationContext.tsx`
- `src/data/mock-models.ts`
- `src/data/properties.ts`
- `src/graphql/queries.ts`
- `src/hooks/use-amplify-data.ts`
- `src/hooks/useDocumentTemplates.ts`
- `src/hooks/useSecurityPerformance.ts`
- `src/lib/ModelLoaderComponent.tsx`
- `src/lib/amplify-data.ts`
- `src/lib/auth.ts`
- `src/lib/data-service.ts`
- `src/lib/db/schema.ts`
- `src/lib/eventBus.ts`
- `src/lib/features/featureFlags.ts`
- `src/lib/mock.ts`
- `src/lib/mongodb-helper.ts`
- `src/lib/mongodb.ts`
- `src/lib/security/analytics.ts`
- `src/lib/security/index.ts`
- `src/lib/security/sanitize.ts`
- `src/lib/security/validation.ts`
- `src/lib/services/documents.ts`
- `src/lib/services/htb.ts`
- `src/lib/services/properties.ts`
- `src/lib/services/sales.ts`
- `src/services/DevelopmentService.ts`
- `src/services/api.ts`
- `src/services/apiClient.ts`
- `src/services/apiDataService.ts`
- `src/services/customization/CustomizationService.ts`
- `src/services/data-service/index.ts`
- `src/services/data-service/mock.ts`
- `src/services/document-service.ts`
- `src/services/htbService.ts`
- `src/services/htbServiceMock.ts`
- `src/services/index.ts`
- `src/services/mockDataService.ts`
- `src/services/propertyService.ts`
- `src/services/supplychain/SupplyChainService.ts`
- `src/tests/dashboard/TestDashboard.tsx`
- `src/types/common/status.ts`
- `src/types/common/user.ts`
- `src/types/common.ts`
- `src/types/core/analytics.ts`
- `src/types/core/document.ts`
- `src/types/core/investor.ts`
- `src/types/core/marketing.ts`
- `src/types/core/sales.ts`
- `src/types/core/unit.ts`
- `src/types/custom.d.ts`
- `src/types/customization.d.ts`
- `src/types/customization.ts`
- `src/types/development/models.ts`
- `src/types/developments.ts`
- `src/types/document.ts`
- `src/types/enums.ts`
- `src/types/environment.d.ts`
- `src/types/express.ts`
- `src/types/finance/cash-flow.ts`
- `src/types/htb.ts`
- `src/types/index.ts`
- `src/types/models.ts`
- `src/types/performance-types.d.ts`
- `src/types/properties.d.ts`
- `src/types/properties.ts`
- `src/types/sales.ts`
- `src/types/search.ts`
- `src/types/unit.ts`
- `src/types.d.ts`
- `src/utils/code-splitting.ts`
- `src/utils/finance/calculations.ts`
- `src/utils/graphql-helpers.ts`
- `src/utils/performance/safeMemo.tsx`

### Project Components (127 files)

> **Warning**: High number of files matching this pattern, suggesting potential duplication of functionality.

- `src/api/index.ts`
- `src/app/about/page.tsx`
- `src/app/api/contractors/route.ts`
- `src/app/api/finance/budget-vs-actual/route.ts`
- `src/app/api/finance/index.ts`
- `src/app/api/finance/projections/route.ts`
- `src/app/api/finance/route.ts`
- `src/app/api/monitoring/api-metrics/route.ts`
- `src/app/api/projects/[id]/activity/route.ts`
- `src/app/api/projects/[id]/alerts/route.ts`
- `src/app/api/projects/[id]/route.ts`
- `src/app/api/projects/[id]/sales/route.ts`
- `src/app/api/projects/[id]/timeline/route.ts`
- `src/app/api/projects/route.ts`
- `src/app/api/users/me/route.ts`
- `src/app/dashboard/@sidebar/default.tsx`
- `src/app/developer/documents/page.tsx`
- `src/app/developer/finance/page.tsx`
- `src/app/developer/new-project/page.tsx`
- `src/app/developer/project/[id]/page.tsx`
- `src/app/developer/project/[id]/sales/page.tsx`
- `src/app/developer/project/[id]/timeline/page.tsx`
- `src/app/developer/project/new/page.tsx`
- `src/app/developer/projects/page.tsx`
- `src/app/projects/[slug]/page.tsx`
- `src/app/projects/[slug]/units/[id]/page.tsx`
- `src/app/projects/propprojects/units/unit11/[slug]/units/page.tsx`
- `src/app/prop/dashboard/page.tsx`
- `src/app/prop/projects/FitzgeraldGardens/units/Unit1/route.ts`
- `src/app/prop/projects/page.tsx`
- `src/app/prop/templates/page.tsx`
- `src/app/properties/page.tsx`
- `src/app/properties/search/page.tsx`
- `src/aws-exports.d.ts`
- `src/aws-exports.js`
- `src/components/3d/ModelViewer.tsx`
- `src/components/HomePage.tsx`
- `src/components/about/Cta.tsx`
- `src/components/about/Team.tsx`
- `src/components/about/Timeline.tsx`
- `src/components/construction/TasksList.tsx`
- `src/components/contact/Faq.tsx`
- `src/components/dashboard/ProjectOverview.tsx`
- `src/components/dashboard/ProjectStatusCard.tsx`
- `src/components/developer/DeveloperDashboard.tsx`
- `src/components/developer/DeveloperHeader.tsx`
- `src/components/developer/DeveloperSidebar.tsx`
- `src/components/developer/DocumentGeneration.tsx`
- `src/components/developer/FinancialDashboard.tsx`
- `src/components/developer/MicrosoftIntegration.tsx`
- `src/components/developer/ProfessionalAppointments.tsx`
- `src/components/developer/project/fitzgerald-gardens/page.tsx`
- `src/components/developer/project/fitzgerald-gardens/sales/page.tsx`
- `src/components/developer/project/fitzgerald-gardens/units/page.tsx`
- `src/components/developer/project/new/page.tsx`
- `src/components/developer/project/wizard/ProjectBasicInfo.tsx`
- `src/components/developer/project/wizard/index.ts`
- `src/components/developer/properties/page.tsx`
- `src/components/development/DevelopmentDetail.tsx`
- `src/components/document/DocumentComplianceTracker.tsx`
- `src/components/document/DocumentUploadDialog.tsx`
- `src/components/finance/FinancialDashboard.tsx`
- `src/components/finance/ProfitabilityAnalysis.tsx`
- `src/components/finance/ROICalculator.tsx`
- `src/components/finance/ScenarioComparison.tsx`
- `src/components/investor/PropertyInvestmentMetrics.tsx`
- `src/components/navigation/Sidebar.tsx`
- `src/components/pages/developer/DeveloperPage.tsx`
- `src/components/pages/developer/new-project/DeveloperNew-projectPage.tsx`
- `src/components/projects/ProjectCard.tsx`
- `src/components/projects/ProjectListItem.tsx`
- `src/components/projects/ProjectStatusCard.tsx`
- `src/components/properties/PropertyCard.tsx`
- `src/components/property/PropertyCard.tsx`
- `src/components/property/PropertyDetail.tsx`
- `src/components/sales/SalesProgressTracker.tsx`
- `src/components/sections/AboutSection.jsx`
- `src/components/timeline/ProjectTimeline.tsx`
- `src/components/timeline/TimelineSummaryCards.tsx`
- `src/components/timeline/TimelineToolbar.tsx`
- `src/components/timeline/index.ts`
- `src/components/units/UnitCard.tsx`
- `src/config/index.ts`
- `src/data/mock-models.ts`
- `src/hooks/api-hooks.ts`
- `src/hooks/useDocumentTemplates.ts`
- `src/hooks/usePermissions.ts`
- `src/lib/ModelLoaderComponent.tsx`
- `src/lib/amplify/config.ts`
- `src/lib/react-query-config.ts`
- `src/services/data-service/mock.ts`
- `src/services/development-service.ts`
- `src/services/mockDataService.ts`
- `src/services/propertyService.ts`
- `src/types/api.ts`
- `src/types/common/user.ts`
- `src/types/core/analytics.ts`
- `src/types/core/development.ts`
- `src/types/core/document.ts`
- `src/types/core/financial.ts`
- `src/types/core/index.ts`
- `src/types/core/investor.ts`
- `src/types/core/marketing.ts`
- `src/types/core/professional.ts`
- `src/types/core/project.ts`
- `src/types/core/user.ts`
- `src/types/custom.d.ts`
- `src/types/dashboard.ts`
- `src/types/development/filters.ts`
- `src/types/development/models.ts`
- `src/types/developments.ts`
- `src/types/document.ts`
- `src/types/enums.ts`
- `src/types/finance/cash-flow.ts`
- `src/types/finance/dashboard.ts`
- `src/types/finance/development-finance.ts`
- `src/types/finance/investment-analysis.ts`
- `src/types/index.ts`
- `src/types/models.ts`
- `src/types/project.ts`
- `src/types/properties.d.ts`
- `src/types/properties.ts`
- `src/types/sales.ts`
- `src/types/search.ts`
- `src/types/timeline.ts`
- `src/types.d.ts`
- `src/utils/finance/calculations.ts`

### Navigation Components (117 files)

> **Warning**: High number of files matching this pattern, suggesting potential duplication of functionality.

- `src/app/ClientLayout.tsx`
- `src/app/buyer/customization/page.tsx`
- `src/app/buyer/htb/buyer/HTBClaimProcess.tsx`
- `src/app/buyer/htb/buyer/HTBStatusViewer.tsx`
- `src/app/buyer/htb/buyer/developer/HTBClaimProcessor.tsx`
- `src/app/buyer/htb/buyer/developer/HTBClaimsDashboard.tsx`
- `src/app/dashboard/@sidebar/default.tsx`
- `src/app/dashboard/layout.tsx`
- `src/app/dashboard/page.tsx`
- `src/app/developer/documents/page.tsx`
- `src/app/developer/layout.tsx`
- `src/app/developer/project/[id]/page.tsx`
- `src/app/developer/project/[id]/sales/page.tsx`
- `src/app/developer/project/[id]/timeline/page.tsx`
- `src/app/developer/project/new/page.tsx`
- `src/app/login/page.tsx`
- `src/app/page.tsx`
- `src/app/projects/[slug]/units/[id]/page.tsx`
- `src/app/projects/propprojects/units/unit11/[slug]/units/page.tsx`
- `src/app/prop/dashboard/page.tsx`
- `src/app/prop/projects/page.tsx`
- `src/app/prop/templates/page.tsx`
- `src/app/properties/[id]/page.tsx`
- `src/app/properties/search/page.tsx`
- `src/app/property/page.tsx`
- `src/app/register/page.tsx`
- `src/app/user/security/setup/page.tsx`
- `src/components/AppWrapper.tsx`
- `src/components/HomePage.tsx`
- `src/components/accessibility/AccessibleForm.stories.tsx`
- `src/components/accessibility/KeyboardFocusHandler.tsx`
- `src/components/accessibility/ScreenReaderText.stories.tsx`
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/ProtectedRoute.tsx`
- `src/components/auth/RegisterForm.tsx`
- `src/components/buyer/BuyerDashboard.tsx`
- `src/components/buyer/BuyerDashboardSidebar.tsx`
- `src/components/buyer/CustomizationPageContent.tsx`
- `src/components/buyer/DocumentUpload.tsx`
- `src/components/buyer/PurchaseDetail.tsx`
- `src/components/developer/DeveloperHeader.tsx`
- `src/components/developer/DeveloperSidebar.tsx`
- `src/components/developer/DeveloperThemeToggle.tsx`
- `src/components/developer/FinancialDashboard.tsx`
- `src/components/developer/project/new/page.tsx`
- `src/components/development/DevelopmentDetail.tsx`
- `src/components/document/DocumentComplianceTracker.tsx`
- `src/components/documents/DocumentGenerator.tsx`
- `src/components/examples/DevelopmentList.tsx`
- `src/components/features/home/HeroSection.tsx`
- `src/components/finance/FinancialDashboard.tsx`
- `src/components/finance/ScenarioComparison.tsx`
- `src/components/htb/developer/ClaimTabs.tsx`
- `src/components/htb/developer/HTBClaimProcessor.tsx`
- `src/components/htb/developer/HTBClaimsDashboard.tsx`
- `src/components/htb/shared/HTBStepIndicator.tsx`
- `src/components/investor/InvestorMode.tsx`
- `src/components/layout/AppWrapper.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/Layout.tsx`
- `src/components/layout/MainNavigation.jsx`
- `src/components/navigation/ConsistentNavigation.tsx`
- `src/components/navigation/MainNavigation.tsx`
- `src/components/navigation/Navbar.tsx`
- `src/components/navigation/NavigationErrorBoundary.tsx`
- `src/components/navigation/Sidebar.tsx`
- `src/components/pages/Page.tsx`
- `src/components/pages/buyer/htb/BuyerHtbPage.tsx`
- `src/components/pages/developer/DeveloperPage.tsx`
- `src/components/pages/developer/new-project/DeveloperNew-projectPage.tsx`
- `src/components/pages/developments/DevelopmentsPage.tsx`
- `src/components/pages/index.tsx`
- `src/components/pages/kyc-verifcationpage/Kyc-verifcationPage.tsx`
- `src/components/pages/login/LoginPage.tsx`
- `src/components/pages/properties/PropertiesPage.tsx`
- `src/components/pages/register/RegisterPage.tsx`
- `src/components/pages/solicitor/SolicitorPage.tsx`
- `src/components/property/PropertyDetail.tsx`
- `src/components/property/PurchaseInitiation.tsx`
- `src/components/security/CSRFToken.tsx`
- `src/components/security/SafeLink.tsx`
- `src/components/security/mfa/MFASetup.tsx`
- `src/components/security/withCSRFProtection.tsx`
- `src/components/ui/NotificationCenter.tsx`
- `src/components/ui/breadcrumb.tsx`
- `src/components/ui/calendar.tsx`
- `src/components/ui/context-menu.tsx`
- `src/components/ui/dropdown-menu.tsx`
- `src/components/ui/menubar.tsx`
- `src/components/ui/navigation-menu.tsx`
- `src/components/ui/pagination.tsx`
- `src/components/ui/sidebar.tsx`
- `src/context/CustomizationContext.tsx`
- `src/hooks/useClientSecurity.ts`
- `src/hooks/useSecurityFeatures.ts`
- `src/hooks/useSecurityMonitor.ts`
- `src/hooks/useSecurityPerformance.ts`
- `src/lib/ModelLoaderComponent.tsx`
- `src/lib/amplify/api.ts`
- `src/lib/analytics.ts`
- `src/lib/security/auditLogger.ts`
- `src/lib/security/authLogger.ts`
- `src/lib/security/errorHandling.ts`
- `src/lib/security/index.ts`
- `src/lib/security/lazySecurityFeatures.ts`
- `src/lib/security/performanceCorrelation.ts`
- `src/lib/security/sessionFingerprint.ts`
- `src/lib/security/urlSafetyCheck.ts`
- `src/lib/security/useSecurityMonitor.ts`
- `src/lib/security/validation.ts`
- `src/stories/Page.tsx`
- `src/tests/security/runTests.ts`
- `src/types/common/components.ts`
- `src/types/unit.ts`
- `src/utils/paramValidator.ts`
- `src/utils/performance/lazyLoad.tsx`
- `src/utils/performance/monitor.tsx`

### List/Grid Views (259 files)

> **Warning**: High number of files matching this pattern, suggesting potential duplication of functionality.

- `src/app/about/page.tsx`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/api/developments/route.ts`
- `src/app/api/documents/route.ts`
- `src/app/api/projects/route.ts`
- `src/app/api/users/route.ts`
- `src/app/buyer/customization/page.tsx`
- `src/app/buyer/htb/HTBErrorWrapper.tsx`
- `src/app/buyer/htb/buyer/HTBClaimProcess.tsx`
- `src/app/buyer/htb/buyer/HTBStatusViewer.tsx`
- `src/app/buyer/htb/buyer/developer/HTBClaimsDashboard.tsx`
- `src/app/counter.ts`
- `src/app/dashboard/@main/page.tsx`
- `src/app/dashboard/@main/profile/page.tsx`
- `src/app/dashboard/@main/security/page.tsx`
- `src/app/developer/documents/page.tsx`
- `src/app/developer/new-project/page.tsx`
- `src/app/developer/project/[id]/page.tsx`
- `src/app/developer/project/[id]/timeline/page.tsx`
- `src/app/developer/projects/page.tsx`
- `src/app/developments/page.tsx`
- `src/app/examples/developments/page.tsx`
- `src/app/page.tsx`
- `src/app/projects/[slug]/page.tsx`
- `src/app/projects/[slug]/units/[id]/page.tsx`
- `src/app/projects/propprojects/units/unit11/[slug]/units/page.tsx`
- `src/app/prop/dashboard/page.tsx`
- `src/app/prop/projects/page.tsx`
- `src/app/prop/templates/page.tsx`
- `src/app/properties/[id]/page.tsx`
- `src/app/properties/loading.tsx`
- `src/app/properties/page.tsx`
- `src/app/properties/search/page.tsx`
- `src/app/property/page.tsx`
- `src/components/3d/ModelViewer.tsx`
- `src/components/CustomizationSummary.tsx`
- `src/components/HomePage.tsx`
- `src/components/about/AboutTeam.tsx`
- `src/components/about/AboutValues.tsx`
- `src/components/about/Cta.tsx`
- `src/components/about/Mission.tsx`
- `src/components/about/Team.tsx`
- `src/components/about/Values.tsx`
- `src/components/accessibility/KeyboardFocusHandler.tsx`
- `src/components/accessibility/ScreenReaderText.stories.tsx`
- `src/components/admin/AdminDocumentReview.tsx`
- `src/components/admin/AdminFinancialDashboard.tsx`
- `src/components/admin/EnhancedSecurityDashboard.tsx`
- `src/components/admin/PerformanceDashboard.tsx`
- `src/components/analytics/PerformanceChart.tsx`
- `src/components/auth/RegisterForm.tsx`
- `src/components/auth/UserRegistration.tsx`
- `src/components/buyer/BuyerDashboard.tsx`
- `src/components/buyer/BuyerDashboardContent.tsx`
- `src/components/buyer/BuyerFinancialDashboard.tsx`
- `src/components/buyer/CustomizationPageContent.tsx`
- `src/components/buyer/PurchaseDetail.tsx`
- `src/components/buyer/PurchaseList.tsx`
- `src/components/construction/SnagListItem.tsx`
- `src/components/construction/TasksList.tsx`
- `src/components/contact/ContactFaq.tsx`
- `src/components/contact/ContactForm.tsx`
- `src/components/contact/ContactMap.tsx`
- `src/components/contact/ContactOffices.tsx`
- `src/components/contact/Faq.tsx`
- `src/components/contact/Map.tsx`
- `src/components/contact/Offices.tsx`
- `src/components/contact/SocialCta.tsx`
- `src/components/dashboard/AlertsList.tsx`
- `src/components/dashboard/BuyerDashboard.tsx`
- `src/components/dashboard/DeveloperDashboard.tsx`
- `src/components/dashboard/ProjectOverview.tsx`
- `src/components/dashboard/PropertyCustomizer.tsx`
- `src/components/dashboard/TasksList.tsx`
- `src/components/dashboard/index.tsx`
- `src/components/developer/DeveloperDashboard.tsx`
- `src/components/developer/DocumentGeneration.tsx`
- `src/components/developer/FinancialDashboard.tsx`
- `src/components/developer/MicrosoftIntegration.tsx`
- `src/components/developer/ProfessionalAppointments.tsx`
- `src/components/developer/project/fitzgerald-gardens/page.tsx`
- `src/components/developer/project/fitzgerald-gardens/sales/page.tsx`
- `src/components/developer/project/fitzgerald-gardens/units/page.tsx`
- `src/components/developer/project/wizard/PlanningPermissionUpload.tsx`
- `src/components/developer/project/wizard/ProjectBasicInfo.tsx`
- `src/components/developer/project/wizard/ScheduleOfAccommodation.tsx`
- `src/components/developer/project/wizard/SitePlanUpload.tsx`
- `src/components/development/DevelopmentDetail.tsx`
- `src/components/document/DocumentCategoryProgress.tsx`
- `src/components/document/DocumentComplianceTracker.tsx`
- `src/components/document/DocumentListItem.tsx`
- `src/components/document/DocumentUploadDialog.tsx`
- `src/components/document/index.ts`
- `src/components/documents/DocumentGenerator.tsx`
- `src/components/documents/DocumentList.tsx`
- `src/components/documents/DocumentManager.tsx`
- `src/components/documents/DocumentUploader.tsx`
- `src/components/documents/index.ts`
- `src/components/examples/DevelopmentList.tsx`
- `src/components/features/FeatureFlagAdmin.tsx`
- `src/components/features/development/DevelopmentList.tsx`
- `src/components/finance/CashFlowSummaryCard.tsx`
- `src/components/finance/FinancialChart.tsx`
- `src/components/finance/FinancialDashboard.tsx`
- `src/components/finance/ProfitabilityAnalysis.tsx`
- `src/components/finance/ROICalculator.tsx`
- `src/components/finance/ScenarioComparison.tsx`
- `src/components/htb/HelpToBuyClaimUpload.tsx`
- `src/components/htb/developer/ClaimDetails.tsx`
- `src/components/htb/developer/HTBClaimsDashboard.tsx`
- `src/components/investor/InvestorDashboard.tsx`
- `src/components/investor/InvestorMode.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/MainNavigation.jsx`
- `src/components/navigation/ConsistentNavigation.tsx`
- `src/components/navigation/Footer.tsx`
- `src/components/pages/Page.tsx`
- `src/components/pages/buyer/htb/BuyerHtbPage.tsx`
- `src/components/pages/buyer/htb/status/BuyerHtbStatusPage.tsx`
- `src/components/pages/developer/DeveloperPage.tsx`
- `src/components/pages/developer/new-project/DeveloperNew-projectPage.tsx`
- `src/components/pages/developments/DevelopmentsList.tsx`
- `src/components/pages/developments/DevelopmentsPage.tsx`
- `src/components/pages/developments/index.tsx`
- `src/components/pages/index.tsx`
- `src/components/pages/login/LoginPage.tsx`
- `src/components/pages/properties/PropertiesPage.tsx`
- `src/components/pages/register/RegisterPage.tsx`
- `src/components/pages/solicitor/SolicitorPage.tsx`
- `src/components/pages/test-api/TestapiPage.tsx`
- `src/components/performance/PerformanceExample.tsx`
- `src/components/performance/PerformanceMonitor.tsx`
- `src/components/performance/VirtualizedList.tsx`
- `src/components/projects/ProjectListItem.tsx`
- `src/components/properties/PropertyCard.tsx`
- `src/components/property/DevelopmentSiteMap.tsx`
- `src/components/property/PropertyDetail.tsx`
- `src/components/property/PropertyListing.tsx`
- `src/components/property/PropertyReservation.tsx`
- `src/components/property/PurchaseFlow.tsx`
- `src/components/sales/SalesFunnelChart.tsx`
- `src/components/sales/SalesProgressTracker.tsx`
- `src/components/sections/AboutSection.jsx`
- `src/components/security/EnhancedSecurityDashboard.tsx`
- `src/components/security/MFAChallenge.tsx`
- `src/components/security/MFASetup.tsx`
- `src/components/security/OptimizedSecurityDashboard.tsx`
- `src/components/security/SecurityDashboard.tsx`
- `src/components/security/SecurityMetricsSkeleton.tsx`
- `src/components/security/SecurityMonitoringDashboard.tsx`
- `src/components/security/SecuritySetupWizard.tsx`
- `src/components/security/ThreatVisualization.tsx`
- `src/components/security/mfa/MFASetup.tsx`
- `src/components/security/withCSRFProtection.tsx`
- `src/components/timeline/DependencyLines.tsx`
- `src/components/timeline/ProjectTimeline.tsx`
- `src/components/timeline/TimelineSummaryCards.tsx`
- `src/components/ui/RealTimeChat.tsx`
- `src/components/ui/alert-dialog.tsx`
- `src/components/ui/breadcrumb.tsx`
- `src/components/ui/chart.tsx`
- `src/components/ui/command.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/drawer.tsx`
- `src/components/ui/loading-skeleton.stories.tsx`
- `src/components/ui/loading-skeleton.tsx`
- `src/components/ui/navigation-menu.tsx`
- `src/components/ui/pagination.tsx`
- `src/components/ui/radio-group.tsx`
- `src/components/ui/sidebar.tsx`
- `src/components/ui/tabs.tsx`
- `src/components/units/CustomizationOptions.tsx`
- `src/context/AuthContext.tsx`
- `src/context/HTBContext.tsx`
- `src/context/NotificationContext.tsx`
- `src/data/customizationOptions.ts`
- `src/graphql/queries.ts`
- `src/hooks/use-mobile.tsx`
- `src/hooks/useClientSecurity.ts`
- `src/hooks/useDocumentTemplates.ts`
- `src/hooks/useSecurityMonitor.ts`
- `src/lib/ModelLoaderComponent.tsx`
- `src/lib/amplify/index.ts`
- `src/lib/amplify/server-adapter.ts`
- `src/lib/amplify/storage.ts`
- `src/lib/amplify/types.ts`
- `src/lib/amplify-data.ts`
- `src/lib/amplify.ts`
- `src/lib/analytics.ts`
- `src/lib/api.ts`
- `src/lib/data-service.ts`
- `src/lib/db/index.ts`
- `src/lib/db/mappers.ts`
- `src/lib/environment.ts`
- `src/lib/eventBus.ts`
- `src/lib/react-query-config.ts`
- `src/lib/security/amplify-integration.ts`
- `src/lib/security/apiProtection.ts`
- `src/lib/security/auditLogger.ts`
- `src/lib/security/enhancedAnalytics.ts`
- `src/lib/security/index.ts`
- `src/lib/security/mfa.ts`
- `src/lib/security/performanceCorrelation.ts`
- `src/lib/security/securityAnalyticsClient.ts`
- `src/lib/security/sessionFingerprint.ts`
- `src/lib/security/urlSafetyCheck.ts`
- `src/lib/security/useSecurityMonitor.ts`
- `src/lib/services/__mocks__/units.ts`
- `src/lib/services/__mocks__/users.ts`
- `src/lib/services/documents.ts`
- `src/lib/services/properties.ts`
- `src/lib/services/sales.ts`
- `src/lib/services/units.ts`
- `src/lib/three-types.ts`
- `src/lib/utils/safeCache.ts`
- `src/services/DevelopmentService.ts`
- `src/services/apiDataService.ts`
- `src/services/base/BaseService.ts`
- `src/services/customization/CustomizationService.ts`
- `src/services/data-service/mock.ts`
- `src/services/development-service.ts`
- `src/services/document-service.ts`
- `src/services/documentService.ts`
- `src/services/propertyService.ts`
- `src/services/sales-service.ts`
- `src/services/supplychain/SupplyChainService.ts`
- `src/services/user-service.ts`
- `src/tests/dashboard/TestDashboard.tsx`
- `src/tests/security/TestRunnerUI.tsx`
- `src/tests/security/scenarios.ts`
- `src/types/amplify/auth.ts`
- `src/types/amplify/storage.ts`
- `src/types/common/components.ts`
- `src/types/common/index.ts`
- `src/types/contact.ts`
- `src/types/core/analytics.ts`
- `src/types/core/investor.ts`
- `src/types/core/project.ts`
- `src/types/core/sales.ts`
- `src/types/core/user.ts`
- `src/types/custom.d.ts`
- `src/types/customization.ts`
- `src/types/development/index.ts`
- `src/types/development/models.ts`
- `src/types/development/responses.ts`
- `src/types/express.ts`
- `src/types/finance/dashboard.ts`
- `src/types/index.ts`
- `src/types/jsx-three-fiber.d.ts`
- `src/types/performance-types.d.ts`
- `src/types/properties.d.ts`
- `src/types/properties.ts`
- `src/types/search.ts`
- `src/types/three-fiber.d.ts`
- `src/types.d.ts`
- `src/utils/performance/index.ts`
- `src/utils/performance/monitor.tsx`
- `src/utils/performance/optimizeComponent.tsx`
- `src/utils/performance/safeMemo.tsx`

### Modals/Dialogs (19 files)

> **Warning**: High number of files matching this pattern, suggesting potential duplication of functionality.

- `src/app/developer/documents/page.tsx`
- `src/components/accessibility/ScreenReaderText.stories.tsx`
- `src/components/accessibility/ScreenReaderText.tsx`
- `src/components/admin/FeatureFlagManager.tsx`
- `src/components/developer/ProfessionalAppointments.tsx`
- `src/components/document/DocumentUploadDialog.tsx`
- `src/components/document/index.ts`
- `src/components/features/FeatureFlagAdmin.tsx`
- `src/components/finance/ROICalculator.tsx`
- `src/components/finance/ScenarioComparison.tsx`
- `src/components/security/SecurityAlerts.tsx`
- `src/components/security/TrustedDevices.tsx`
- `src/components/timeline/ProjectTimeline.tsx`
- `src/components/ui/alert-dialog.tsx`
- `src/components/ui/command.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/sheet.tsx`
- `src/types/common/components.ts`
- `src/utils/code-splitting.ts`

## Similar Components

No significantly similar components found.

## Naming Convention Violations

| File | Type | Issue |
|------|------|-------|
| `src/components/3d/RoomVisualizer.old.tsx` | component | Components should start with uppercase |
| `src/components/about/index.ts` | component | Components should start with uppercase |
| `src/components/accessibility/AccessibleForm.stories.tsx` | component | Components should start with uppercase |
| `src/components/accessibility/ScreenReaderText.stories.tsx` | component | Components should start with uppercase |
| `src/components/auth/LoginForm.stories.tsx` | component | Components should start with uppercase |
| `src/components/contact/index.ts` | component | Components should start with uppercase |
| `src/components/dashboard/index.tsx` | component | Components should start with uppercase |
| `src/components/developer/project/fitzgerald-gardens/page.tsx` | component | Components should start with uppercase |
| `src/components/developer/project/fitzgerald-gardens/sales/page.tsx` | component | Components should start with uppercase |
| `src/components/developer/project/fitzgerald-gardens/units/page.tsx` | component | Components should start with uppercase |
| `src/components/developer/project/new/page.tsx` | component | Components should start with uppercase |
| `src/components/developer/project/wizard/index.ts` | component | Components should start with uppercase |
| `src/components/developer/project/wizard/types.ts` | component | Components should start with uppercase |
| `src/components/developer/properties/page.tsx` | component | Components should start with uppercase |
| `src/components/document/index.ts` | component | Components should start with uppercase |
| `src/components/documents/index.ts` | component | Components should start with uppercase |
| `src/components/finance/index.ts` | component | Components should start with uppercase |
| `src/components/htb/developer/forms/index.ts` | component | Components should start with uppercase |
| `src/components/investor/index.ts` | component | Components should start with uppercase |
| `src/components/layout/_app.tsx` | component | Components should start with uppercase |
| `src/components/pages/developer/new-project/DeveloperNew-projectPage.tsx` | component | Components should start with uppercase |
| `src/components/pages/developments/index.tsx` | component | Components should start with uppercase |
| `src/components/pages/index.tsx` | component | Components should start with uppercase |
| `src/components/pages/kyc-verifcationpage/Kyc-verifcationPage.tsx` | component | Components should start with uppercase |
| `src/components/sales/index.ts` | component | Components should start with uppercase |
| `src/components/security/withCSRFProtection.tsx` | component | Components should start with uppercase |
| `src/components/timeline/index.ts` | component | Components should start with uppercase |
| `src/components/ui/accordion.tsx` | component | Components should start with uppercase |
| `src/components/ui/alert-dialog.tsx` | component | Components should start with uppercase |
| `src/components/ui/alert.tsx` | component | Components should start with uppercase |
| `src/components/ui/aspect-ratio.tsx` | component | Components should start with uppercase |
| `src/components/ui/avatar.tsx` | component | Components should start with uppercase |
| `src/components/ui/badge.tsx` | component | Components should start with uppercase |
| `src/components/ui/breadcrumb.tsx` | component | Components should start with uppercase |
| `src/components/ui/button.tsx` | component | Components should start with uppercase |
| `src/components/ui/calendar.tsx` | component | Components should start with uppercase |
| `src/components/ui/card.tsx` | component | Components should start with uppercase |
| `src/components/ui/carousel.tsx` | component | Components should start with uppercase |
| `src/components/ui/chart.tsx` | component | Components should start with uppercase |
| `src/components/ui/checkbox.tsx` | component | Components should start with uppercase |
| `src/components/ui/collapsible.tsx` | component | Components should start with uppercase |
| `src/components/ui/command.tsx` | component | Components should start with uppercase |
| `src/components/ui/context-menu.tsx` | component | Components should start with uppercase |
| `src/components/ui/dialog.tsx` | component | Components should start with uppercase |
| `src/components/ui/drawer.tsx` | component | Components should start with uppercase |
| `src/components/ui/dropdown-menu.tsx` | component | Components should start with uppercase |
| `src/components/ui/error-boundary.stories.tsx` | component | Components should start with uppercase |
| `src/components/ui/error-boundary.tsx` | component | Components should start with uppercase |
| `src/components/ui/form-field.stories.tsx` | component | Components should start with uppercase |
| `src/components/ui/form-field.tsx` | component | Components should start with uppercase |
| `src/components/ui/form.tsx` | component | Components should start with uppercase |
| `src/components/ui/hover-card.tsx` | component | Components should start with uppercase |
| `src/components/ui/input-otp.tsx` | component | Components should start with uppercase |
| `src/components/ui/input.tsx` | component | Components should start with uppercase |
| `src/components/ui/label.tsx` | component | Components should start with uppercase |
| `src/components/ui/loading-skeleton.stories.tsx` | component | Components should start with uppercase |
| `src/components/ui/loading-skeleton.tsx` | component | Components should start with uppercase |
| `src/components/ui/menubar.tsx` | component | Components should start with uppercase |
| `src/components/ui/navigation-menu.tsx` | component | Components should start with uppercase |
| `src/components/ui/pagination.tsx` | component | Components should start with uppercase |
| `src/components/ui/popover.tsx` | component | Components should start with uppercase |
| `src/components/ui/progress.tsx` | component | Components should start with uppercase |
| `src/components/ui/radio-group.tsx` | component | Components should start with uppercase |
| `src/components/ui/resizable.tsx` | component | Components should start with uppercase |
| `src/components/ui/scroll-area.tsx` | component | Components should start with uppercase |
| `src/components/ui/select.tsx` | component | Components should start with uppercase |
| `src/components/ui/separator.tsx` | component | Components should start with uppercase |
| `src/components/ui/sheet.tsx` | component | Components should start with uppercase |
| `src/components/ui/sidebar.tsx` | component | Components should start with uppercase |
| `src/components/ui/skeleton.tsx` | component | Components should start with uppercase |
| `src/components/ui/slider.tsx` | component | Components should start with uppercase |
| `src/components/ui/sonner.tsx` | component | Components should start with uppercase |
| `src/components/ui/spinner.tsx` | component | Components should start with uppercase |
| `src/components/ui/switch.tsx` | component | Components should start with uppercase |
| `src/components/ui/table.tsx` | component | Components should start with uppercase |
| `src/components/ui/tabs.tsx` | component | Components should start with uppercase |
| `src/components/ui/textarea.tsx` | component | Components should start with uppercase |
| `src/components/ui/toast.stories.tsx` | component | Components should start with uppercase |
| `src/components/ui/toast.tsx` | component | Components should start with uppercase |
| `src/components/ui/toaster.tsx` | component | Components should start with uppercase |
| `src/components/ui/toggle-group.tsx` | component | Components should start with uppercase |
| `src/components/ui/toggle.tsx` | component | Components should start with uppercase |
| `src/components/ui/tooltip.tsx` | component | Components should start with uppercase |
| `src/context/AuthContext.test.tsx` | context | Context files should end with "Context" |
| `src/hooks/api-hooks.ts` | hook | Hooks should start with "use" followed by uppercase |
| `src/hooks/use-amplify-data.ts` | hook | Hooks should start with "use" followed by uppercase |
| `src/hooks/use-mobile.tsx` | hook | Hooks should start with "use" followed by uppercase |
| `src/hooks/useAuth.tsx` | hook | Hooks should start with "use" followed by uppercase |
| `src/pages/_app.tsx` | component | Components should start with uppercase |
| `src/pages/_document.tsx` | component | Components should start with uppercase |
| `src/pages/admin/financial.tsx` | component | Components should start with uppercase |
| `src/pages/auth/login.tsx` | component | Components should start with uppercase |
| `src/pages/auth/register.tsx` | component | Components should start with uppercase |
| `src/pages/buyer/dashboard.tsx` | component | Components should start with uppercase |
| `src/utils/code-splitting.ts` | util | Utilities should start with lowercase |
| `src/utils/date-utils.ts` | util | Utilities should start with lowercase |
| `src/utils/graphql-helpers.ts` | util | Utilities should start with lowercase |
| `src/utils/performance/lazyLoad.tsx` | util | Utilities should start with lowercase |
| `src/utils/performance/monitor.tsx` | util | Utilities should start with lowercase |
| `src/utils/performance/optimizeComponent.tsx` | util | Utilities should start with lowercase |
| `src/utils/performance/react-cache-polyfill.ts` | util | Utilities should start with lowercase |
| `src/utils/performance/react-cache-polyfill.tsx` | util | Utilities should start with lowercase |
| `src/utils/performance/safeMemo.tsx` | util | Utilities should start with lowercase |
| `src/utils/performance/withMemo.tsx` | util | Utilities should start with lowercase |

## Import Patterns Usage

| Import Pattern | Count |
|---------------|-------|
| React | 247 |
| Next.js | 161 |
| React Hooks | 66 |
| Icons | 37 |
| Types | 21 |
| Components | 13 |
| Hooks | 3 |
| Services | 2 |

## Styling Approaches

| Styling Approach | Count |
|-----------------|-------|
| Tailwind CSS | 239 |
| Inline Styles | 61 |
| CSS Modules | 14 |

> **Warning**: Multiple styling approaches detected. Consider standardizing on a single approach.

## Large Files (>300 lines)

| File | Line Count |
|------|------------|
| `src/components/pages/developments/DevelopmentsPage.tsx` | 1746 |
| `src/lib/ModelLoaderComponent.tsx` | 1615 |
| `src/components/finance/ROICalculator.tsx` | 1604 |
| `src/components/finance/ScenarioComparison.tsx` | 1539 |
| `src/utils/performance/monitor.tsx` | 1491 |
| `src/lib/security/validation.ts` | 1404 |
| `src/components/pages/solicitor/SolicitorPage.tsx` | 1337 |
| `src/components/HomePage.tsx` | 1189 |
| `src/lib/security/enhancedAnalytics.ts` | 1162 |
| `src/lib/security/errorHandling.ts` | 1146 |
| `src/lib/security/index.ts` | 1127 |
| `src/lib/security/securityAnalyticsClient.ts` | 1080 |
| `src/lib/db/index.ts` | 1070 |
| `src/lib/security/performanceCorrelation.ts` | 1064 |
| `src/types/core/project.ts` | 1063 |
| `src/lib/security/analytics.ts` | 1048 |
| `src/utils/performance/dataCache.ts` | 1047 |
| `src/types/core/analytics.ts` | 939 |
| `src/components/sales/SalesProgressTracker.tsx` | 902 |
| `src/components/admin/AdminFinancialDashboard.tsx` | 847 |
| `src/types/core/marketing.ts` | 845 |
| `src/lib/data-service.ts` | 842 |
| `src/components/investor/InvestorMode.tsx` | 838 |
| `src/components/admin/EnhancedSecurityDashboard.tsx` | 831 |
| `src/components/development/DevelopmentDetail.tsx` | 814 |
| `src/components/ui/sidebar.tsx` | 772 |
| `src/components/htb/HelpToBuyClaimUpload.tsx` | 759 |
| `src/components/dashboard/ProjectOverview.tsx` | 748 |
| `src/types/core/investor.ts` | 746 |
| `src/components/finance/ProfitabilityAnalysis.tsx` | 745 |
| `src/app/api/projects/[id]/timeline/route.ts` | 735 |
| `src/lib/security/useSecurityMonitor.ts` | 720 |
| `src/components/pages/developer/new-project/DeveloperNew-projectPage.tsx` | 714 |
| `src/tests/dashboard/TestDashboard.tsx` | 714 |
| `src/components/auth/UserRegistration.tsx` | 699 |
| `src/lib/security/sessionFingerprint.ts` | 692 |
| `src/services/supplychain/SupplyChainService.ts` | 683 |
| `src/components/property/PurchaseFlow.tsx` | 667 |
| `src/components/admin/PerformanceDashboard.tsx` | 659 |
| `src/utils/performance/apiBatcher.ts` | 647 |
| `src/components/timeline/ProjectTimeline.tsx` | 642 |
| `src/utils/performance/index.ts` | 639 |
| `src/hooks/api-hooks.ts` | 629 |
| `src/services/data-service/mock.ts` | 629 |
| `src/services/htbServiceMock.ts` | 628 |
| `src/utils/performance/lazyLoad.tsx` | 628 |
| `src/utils/performance/safeCache.ts` | 627 |
| `src/components/pages/kyc-verifcationpage/Kyc-verifcationPage.tsx` | 626 |
| `src/lib/api.ts` | 619 |
| `src/components/features/FeatureFlagAdmin.tsx` | 616 |
| `src/lib/amplify/api.ts` | 607 |
| `src/app/properties/search/page.tsx` | 606 |
| `src/components/3d/RoomVisualizer.old.tsx` | 606 |
| `src/components/documents/DocumentGenerator.tsx` | 602 |
| `src/app/buyer/htb/buyer/HTBStatusViewer.tsx` | 593 |
| `src/components/document/DocumentComplianceTracker.tsx` | 591 |
| `src/lib/auth.ts` | 587 |
| `src/lib/security/apiProtection.ts` | 583 |
| `src/components/developer/FinancialDashboard.tsx` | 581 |
| `src/components/pages/developer/DeveloperPage.tsx` | 579 |
| `src/types/core/development.ts` | 577 |
| `src/components/property/PropertyReservation.tsx` | 569 |
| `src/lib/security/securityPerformanceIntegration.ts` | 567 |
| `src/components/buyer/PurchaseDetail.tsx` | 566 |
| `src/utils/finance/calculations.ts` | 565 |
| `src/lib/services/sales.ts` | 559 |
| `src/components/buyer/BuyerFinancialDashboard.tsx` | 554 |
| `src/utils/performance/safeMemo.tsx` | 553 |
| `src/services/documentService.ts` | 552 |
| `src/components/admin/AdminDocumentReview.tsx` | 550 |
| `src/app/dashboard/@main/security/page.tsx` | 544 |
| `src/lib/security/mfa/index.ts` | 540 |
| `src/types/core/financial.ts` | 530 |
| `src/components/developer/ProfessionalAppointments.tsx` | 527 |
| `src/app/buyer/htb/buyer/HTBClaimProcess.tsx` | 525 |
| `src/components/developer/DocumentGeneration.tsx` | 525 |
| `src/components/security/MFASetup.tsx` | 523 |
| `src/lib/amplify-data.ts` | 521 |
| `src/lib/db/mappers.ts` | 513 |
| `src/components/pages/Page.tsx` | 507 |
| `src/components/security/mfa/MFASetup.tsx` | 502 |
| `src/tests/security/runTests.ts` | 493 |
| `src/app/projects/[slug]/units/[id]/page.tsx` | 492 |
| `src/app/projects/propprojects/units/unit11/[slug]/units/page.tsx` | 492 |
| `src/types/common/components.ts` | 489 |
| `src/types/core/sales.ts` | 488 |
| `src/lib/security/auditLogger.ts` | 483 |
| `src/components/developer/MicrosoftIntegration.tsx` | 482 |
| `src/components/security/EnhancedSecurityDashboard.tsx` | 472 |
| `src/components/security/SecurityMonitoringDashboard.tsx` | 465 |
| `src/types/common/security-performance.ts` | 464 |
| `src/tests/security/TestRunnerUI.tsx` | 463 |
| `src/services/contract/ContractService.ts` | 462 |
| `src/lib/security/lazySecurityFeatures.ts` | 453 |
| `src/types/core/document.ts` | 453 |
| `src/components/security/SecurityDashboard.tsx` | 446 |
| `src/lib/cache/dataCache.ts` | 444 |
| `src/lib/security/rateLimit.ts` | 442 |
| `src/types/common/configuration.ts` | 440 |
| `src/components/finance/FinancialDashboard.tsx` | 437 |
| `src/services/mockDataService.ts` | 434 |
| `src/lib/features/featureFlags.ts` | 430 |
| `src/components/developer/DeveloperDashboard.tsx` | 422 |
| `src/components/property/PropertyDetail.tsx` | 419 |
| `src/components/htb/developer/HTBClaimsDashboard.tsx` | 416 |
| `src/app/buyer/htb/buyer/developer/HTBClaimsDashboard.tsx` | 415 |
| `src/components/document/DocumentUploadDialog.tsx` | 414 |
| `src/types/finance/investment-analysis.ts` | 413 |
| `src/lib/services/htb.ts` | 411 |
| `src/components/pages/test-api/TestapiPage.tsx` | 409 |
| `src/services/customization/CustomizationService.ts` | 409 |
| `src/components/pages/index.tsx` | 408 |
| `src/types/finance/development-finance.ts` | 408 |
| `src/components/htb/developer/HTBClaimProcessor.tsx` | 407 |
| `src/components/admin/FeatureFlagManager.tsx` | 406 |
| `src/components/security/OptimizedSecurityDashboard.tsx` | 405 |
| `src/tests/security/testUtils.ts` | 400 |
| `src/components/developer/project/fitzgerald-gardens/sales/page.tsx` | 395 |
| `src/components/buyer/BuyerDashboardContent.tsx` | 394 |
| `src/app/api/projects/[id]/sales/route.ts` | 387 |
| `src/types/common/user.ts` | 387 |
| `src/data/mock-models.ts` | 386 |
| `src/lib/security/securityAnalyticsServer.ts` | 386 |
| `src/components/pages/buyer/htb/BuyerHtbPage.tsx` | 383 |
| `src/lib/security/mfa.ts` | 382 |
| `src/components/security/SecuritySetupWizard.tsx` | 381 |
| `src/app/buyer/customization/page.tsx` | 379 |
| `src/app/prop/dashboard/page.tsx` | 377 |
| `src/components/performance/PerformanceMonitor.tsx` | 371 |
| `src/services/propertyService.ts` | 371 |
| `src/app/api/documents/route.ts` | 368 |
| `src/hooks/usePerformanceMonitor.ts` | 368 |
| `src/components/ui/chart.tsx` | 366 |
| `src/lib/monitoring/apiPerformance.ts` | 366 |
| `src/app/developer/finance/page.tsx` | 365 |
| `src/app/api/units/route.ts` | 363 |
| `src/components/buyer/CustomizationPageContent.tsx` | 362 |
| `src/app/dashboard/security/SecurityDashboardClient.tsx` | 361 |
| `src/tests/security/amplifyV6SecurityIntegrationTest.ts` | 361 |
| `src/types/finance/dashboard.ts` | 358 |
| `src/lib/security/cachedSecurityApi.ts` | 357 |
| `src/app/api/sales/route.ts` | 346 |
| `src/lib/amplify/auth.ts` | 344 |
| `src/lib/security/amplify-integration.ts` | 343 |
| `src/components/pages/properties/PropertiesPage.tsx` | 338 |
| `src/lib/api-client.ts` | 337 |
| `src/lib/security/urlSafetyCheck.ts` | 336 |
| `src/types/core/unit.ts` | 334 |
| `src/context/CustomizationContext.tsx` | 333 |
| `src/components/developer/project/fitzgerald-gardens/units/page.tsx` | 331 |
| `src/types/finance/cash-flow.ts` | 331 |
| `src/app/developer/projects/page.tsx` | 324 |
| `src/lib/analytics.ts` | 324 |
| `src/components/developer/project/wizard/ScheduleOfAccommodation.tsx` | 323 |
| `src/components/finance/FinancialMetricCard.tsx` | 322 |
| `src/types/project.ts` | 322 |
| `src/components/navigation/ConsistentNavigation.tsx` | 318 |
| `src/lib/mongodb.ts` | 317 |
| `src/components/performance/VirtualizedList.tsx` | 316 |
| `src/components/security/TrustedDevices.tsx` | 308 |
| `src/lib/security/authLogger.ts` | 304 |
| `src/app/api/customization/route.ts` | 303 |
| `src/types/core/professional.ts` | 303 |

> **Note**: Large files may be candidates for refactoring into smaller, more focused components or modules.

## Circular Dependencies

No circular dependencies found.

## Recommendations

- Standardize on a single styling approach. Currently using: Tailwind CSS, Inline Styles, CSS Modules
- Consider adding the following recommended folders: components, pages, hooks, services, utils, contexts, types, styles, assets, api
- Review potential duplications in: User Authentication, API Calls, Data Hooks, Form Components, Property Components, Project Components, Navigation Components, List/Grid Views, Modals/Dialogs
- Consider refactoring large files (>300 lines) into smaller, more focused components or modules
