# React Component Analysis Report

## General Statistics

- Total components analyzed: 185
- Functional components: 79
- Class components: 2
- Page components: 132

## Hook Usage

| Hook | Usage Count |
|------|-------------|
| useState | 489 |
| useEffect | 114 |
| useRef | 67 |
| useRouter | 35 |
| useMemo | 33 |
| useAuth | 32 |
| useHTB | 16 |
| useCallback | 15 |
| useQuery | 12 |
| useSearchParams | 10 |
| usePathname | 10 |
| useParams | 9 |
| useForm | 6 |
| useCustomization | 5 |
| useContext | 5 |
| usePerformance | 4 |
| useCarousel | 4 |
| useFormField | 4 |
| useSidebar | 4 |
| usePerformanceMonitor | 3 |
| useToast | 3 |
| useInvestorMode | 3 |
| useGLTF | 2 |
| useFrame | 2 |
| useDashboardData | 2 |
| useDevelopments | 2 |
| useTheme | 2 |
| useChart | 2 |
| useSession | 2 |
| usePropertyDetails | 2 |
| usePermissions | 2 |
| useProgress | 1 |
| useTexture | 1 |
| usePropertyData | 1 |
| useId | 1 |
| useFieldArray | 1 |
| useDocuments | 1 |
| useOrganisation | 1 |
| useDeleteDevelopment | 1 |
| useClientSecurity | 1 |
| useSecurityContext | 1 |
| useSecurityMonitor | 1 |
| useFeatureFlag | 1 |
| useCSRFToken | 1 |
| useEmblaCarousel | 1 |
| useFormContext | 1 |
| useIsMobile | 1 |
| useSecurityFeatures | 1 |
| useSecuritySettings | 1 |
| useMobile | 1 |
| useProjectProperties | 1 |
| useProjects | 1 |
| useDocumentTemplates | 1 |
| useFeaturedProperties | 1 |
| useSearchProperties | 1 |

## State Management

| Approach | Usage Count |
|----------|-------------|
| useState | 489 |
| context | 5 |

## Rendering Patterns

| Pattern | Usage Count |
|---------|-------------|
| ConditionalRendering | 904 |
| FragmentUsage | 84 |
| ListRendering | 0 |
| PortalUsage | 0 |

## Component Design Patterns

| Pattern | Usage Count |
|---------|-------------|
| Hoc | 0 |
| Render Props | 0 |
| Compound Components | 0 |
| Custom Hooks | 0 |

## Component Details

### RoomVisualizer (functional)

- File: `src/components/3d/RoomVisualizer.old.tsx`
- Hooks: useProgress, useRef, useState, useMemo, useTexture, useGLTF, useEffect, useFrame, useCustomization, useCallback
- Props: roomType, room, selectedOptions, option, position, rotation, scale, targetPosition, minDistance, maxDistance, minPolarAngle, maxPolarAngle, enabled, room, showPerformanceStats, height
- State Variables: modelError, error, isLoading, cameraTarget, error
- Effect Dependencies: gltf, selectedOptions, textures, gltf, room
- Rendering Patterns: Conditional Rendering

### Room (functional)

- File: `src/components/3d/RoomVisualizer.tsx`
- Hooks: useRef, useState, useFrame
- Props: roomType
- State Variables: color
- Effect Dependencies: None
- Rendering Patterns: None

### AmplifyDataFetcher (functional)

- File: `src/components/AmplifyDataFetcher.tsx`
- Hooks: useState, useEffect
- Props: operationType, graphqlOperation, restOperation, children, loadingComponent, onError, skip, initialData
- State Variables: data, loading, error
- Effect Dependencies: operationType, skip
- Rendering Patterns: Fragment Usage

### AmplifyProvider (functional)

- File: `src/components/AmplifyProvider.tsx`
- Hooks: useEffect
- Props: children
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: Fragment Usage

### ClientProviders (functional)

- File: `src/components/ClientProviders.tsx`
- Hooks: None
- Props: children, includeAll, include
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: Fragment Usage

### ErrorBoundary (class)

- File: `src/components/ErrorBoundary.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### HomePage (functional)

- File: `src/components/HomePage.tsx`
- Hooks: useContext, useState, useEffect, useRouter, usePropertyData
- Props: children
- State Variables: properties, developments, activeTab, isLoading
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### QueryClientWrapper (functional)

- File: `src/components/QueryClientWrapper.tsx`
- Hooks: None
- Props: children
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### AboutPageClient (functional)

- File: `src/components/about/AboutPageClient.tsx`
- Hooks: useEffect
- Props: data
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### FeatureFlagEditor (functional)

- File: `src/components/admin/FeatureFlagManager.tsx`
- Hooks: useState, useEffect
- Props: flag, onSave, onCancel
- State Variables: featureFlags, isLoading, error, editingFlag, searchTerm, filter, editedFlag
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### PerformanceDashboard (functional)

- File: `src/components/admin/PerformanceDashboard.tsx`
- Hooks: useState, usePerformanceMonitor, useMemo
- Props: autoRefresh, refreshInterval, defaultMinimized, position, showPositionControls
- State Variables: minimized, activeTab, dashboardPosition, componentFilter
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### AuthErrorBoundary (class)

- File: `src/components/auth/AuthErrorBoundary.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### BuyerDashboardContent (functional)

- File: `src/components/buyer/BuyerDashboardContent.tsx`
- Hooks: useAuth
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### CustomizationPageContent (functional)

- File: `src/components/buyer/CustomizationPageContent.tsx`
- Hooks: useState, useCustomization, useRouter
- Props: None
- State Variables: activeRoom, activeCategory
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### DocumentManager (functional)

- File: `src/components/buyer/DocumentManager.tsx`
- Hooks: useAuth, useState, useEffect
- Props: None
- State Variables: documents, isLoading, searchTerm, filterType
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### ContactPageClient (functional)

- File: `src/components/contact/ContactPageClient.tsx`
- Hooks: useEffect
- Props: data
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### BuyerDashboard (functional)

- File: `src/components/dashboard/BuyerDashboard.tsx`
- Hooks: None
- Props: user
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### DeveloperDashboard (functional)

- File: `src/components/dashboard/DeveloperDashboard.tsx`
- Hooks: None
- Props: user
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### DashboardPage (functional)

- File: `src/components/dashboard/index.tsx`
- Hooks: useAuth, useDashboardData
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### DeveloperDashboard (functional)

- File: `src/components/developer/DeveloperDashboard.tsx`
- Hooks: useDevelopments, useState, useEffect
- Props: None
- State Variables: projectMetrics
- Effect Dependencies: developments
- Rendering Patterns: Conditional Rendering

### DeveloperHeader (functional)

- File: `src/components/developer/DeveloperHeader.tsx`
- Hooks: useState
- Props: onMenuClick
- State Variables: notifications
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### DeveloperSidebar (functional)

- File: `src/components/developer/DeveloperSidebar.tsx`
- Hooks: usePathname, useState, useEffect
- Props: isOpen, onClose
- State Variables: activeNavItem, expandedItems
- Effect Dependencies: pathname
- Rendering Patterns: Conditional Rendering, Fragment Usage

### DeveloperThemeProvider (functional)

- File: `src/components/developer/DeveloperThemeProvider.tsx`
- Hooks: None
- Props: children, defaultTheme
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### DeveloperThemeToggle (functional)

- File: `src/components/developer/DeveloperThemeToggle.tsx`
- Hooks: useTheme
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### FitzgeraldGardensHub (page)

- File: `src/components/developer/project/fitzgerald-gardens/page.tsx`
- Hooks: useState
- Props: None
- State Variables: projectStats, salesVelocity
- Effect Dependencies: None
- Rendering Patterns: None

### FitzgeraldGardensSales (page)

- File: `src/components/developer/project/fitzgerald-gardens/sales/page.tsx`
- Hooks: useState, useEffect
- Props: None
- State Variables: sales, filteredSales, filters
- Effect Dependencies: filters, sales
- Rendering Patterns: Conditional Rendering, Fragment Usage

### FitzgeraldGardensUnits (page)

- File: `src/components/developer/project/fitzgerald-gardens/units/page.tsx`
- Hooks: useState, useEffect
- Props: None
- State Variables: units, filteredUnits, filters
- Effect Dependencies: filters, units
- Rendering Patterns: None

### Page (page)

- File: `src/components/developer/properties/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### DevelopmentDetailPage (functional)

- File: `src/components/development/DevelopmentDetail.tsx`
- Hooks: useParams, useRouter, useState, useEffect
- Props: None
- State Variables: activeTab
- Effect Dependencies: developmentId, development, router
- Rendering Patterns: Conditional Rendering, Fragment Usage

### DocumentCategoryProgress (functional)

- File: `src/components/document/DocumentCategoryProgress.tsx`
- Hooks: None
- Props: category, stats, onClick, isSelected, className
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: Fragment Usage

### DocumentComplianceTracker (functional)

- File: `src/components/document/DocumentComplianceTracker.tsx`
- Hooks: useState, useDocuments, useMemo
- Props: projectId, onUploadDocument, onViewDocument, className
- State Variables: categoryFilter, statusFilter, searchQuery, activeTab
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering, Fragment Usage

### DocumentFilterBar (functional)

- File: `src/components/document/DocumentFilterBar.tsx`
- Hooks: useState
- Props: onCategoryChange, onStatusChange, onSearchChange, categoryFilter, statusFilter, searchQuery, className
- State Variables: expanded
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### DocumentListItem (functional)

- File: `src/components/document/DocumentListItem.tsx`
- Hooks: None
- Props: document, onUpload, onView, isCompact, className
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering, Fragment Usage

### DocumentTimeline (functional)

- File: `src/components/document/DocumentTimeline.tsx`
- Hooks: useMemo
- Props: documents, onViewDocument, onUploadDocument, className
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### DocumentUploadDialog (functional)

- File: `src/components/document/DocumentUploadDialog.tsx`
- Hooks: useState, useRef, useCallback
- Props: open, onOpenChange, documentId, projectId, initialData, onUploadComplete
- State Variables: documentName, category, description, deadline, required, file, dragActive, isUploading, uploadProgress, uploadError
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering, Fragment Usage

### DocumentGenerator (functional)

- File: `src/components/documents/DocumentGenerator.tsx`
- Hooks: useRouter, useParams, useToast, useAuth, useOrganisation, useState, useEffect
- Props: template, mode, onSave
- State Variables: template, showVariablesPanel, isSaving, errors
- Effect Dependencies: isAuthenticated, accessToken, router
- Rendering Patterns: Conditional Rendering

### VariablesPanel (functional)

- File: `src/components/documents/VariablesPanel.tsx`
- Hooks: None
- Props: fields, onInsert
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### DevelopmentList (functional)

- File: `src/components/examples/DevelopmentList.tsx`
- Hooks: useRouter, useState, useDevelopments, useDeleteDevelopment
- Props: None
- State Variables: search, status, page
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering, Fragment Usage

### EnvironmentFlag (functional)

- File: `src/components/features/FeatureFlag.tsx`
- Hooks: useState, useEffect
- Props: name, fallback, children, environments, children, fallback
- State Variables: enabled, error
- Effect Dependencies: name
- Rendering Patterns: Fragment Usage

### FeatureFlagAdmin (functional)

- File: `src/components/features/FeatureFlagAdmin.tsx`
- Hooks: useState, useEffect
- Props: None
- State Variables: featureFlags, loading, activeTab, searchQuery, selectedFlag, showEditDialog
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### generateTrendLine (functional)

- File: `src/components/finance/FinancialMetricCard.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### ProfitabilityAnalysis (functional)

- File: `src/components/finance/ProfitabilityAnalysis.tsx`
- Hooks: useState, useMemo
- Props: projectId, initialPeriod, className
- State Variables: period, expandedCategories
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering, Fragment Usage

### ROICalculator (functional)

- File: `src/components/finance/ROICalculator.tsx`
- Hooks: useState, useMemo
- Props: projectId, className
- State Variables: activeProject, newOption, customParams, newOptionDialogOpen, selectedOptionIds, activeOptionId, activeTab
- Effect Dependencies: None
- Rendering Patterns: None

### ScenarioComparison (functional)

- File: `src/components/finance/ScenarioComparison.tsx`
- Hooks: useState, useMemo
- Props: projectId, className
- State Variables: scenarios, activeTab, selectedScenarioIds, activeScenarioId, sensitivityParam, newScenarioOpen, newScenario
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### HTBWrapper (functional)

- File: `src/components/htb/HTBWrapper.tsx`
- Hooks: useHTB
- Props: children
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### ClaimDetails (functional)

- File: `src/components/htb/developer/ClaimDetails.tsx`
- Hooks: None
- Props: claim
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### ClaimDocuments (functional)

- File: `src/components/htb/developer/ClaimDocuments.tsx`
- Hooks: None
- Props: documents
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering, Fragment Usage

### ClaimNotes (functional)

- File: `src/components/htb/developer/ClaimNotes.tsx`
- Hooks: None
- Props: notes
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### ClaimTabs (functional)

- File: `src/components/htb/developer/ClaimTabs.tsx`
- Hooks: None
- Props: activeTab, onTabChange
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### HTBClaimProcessor (functional)

- File: `src/components/htb/developer/HTBClaimProcessor.tsx`
- Hooks: useRouter, useHTB, useState, useEffect
- Props: claimId
- State Variables: activeTab, actionError, actionSuccess
- Effect Dependencies: claimId, fetchClaimById
- Rendering Patterns: Conditional Rendering

### AccessCodeForm (functional)

- File: `src/components/htb/developer/forms/AccessCodeForm.tsx`
- Hooks: useHTB, useState
- Props: claimId, onSuccess, onError
- State Variables: formData
- Effect Dependencies: None
- Rendering Patterns: None

### AddNoteForm (functional)

- File: `src/components/htb/developer/forms/AddNoteForm.tsx`
- Hooks: useHTB, useState
- Props: claimId, onSuccess, onError
- State Variables: formData
- Effect Dependencies: None
- Rendering Patterns: None

### ClaimCodeForm (functional)

- File: `src/components/htb/developer/forms/ClaimCodeForm.tsx`
- Hooks: useHTB, useRef, useState
- Props: claimId, onSuccess, onError
- State Variables: formData
- Effect Dependencies: None
- Rendering Patterns: None

### CompleteClaimForm (functional)

- File: `src/components/htb/developer/forms/CompleteClaimForm.tsx`
- Hooks: useHTB, useRef, useState
- Props: claimId, onSuccess, onError
- State Variables: formData
- Effect Dependencies: None
- Rendering Patterns: None

### DepositAppliedForm (functional)

- File: `src/components/htb/developer/forms/DepositAppliedForm.tsx`
- Hooks: useHTB, useRef, useState
- Props: claimId, onSuccess, onError
- State Variables: formData
- Effect Dependencies: None
- Rendering Patterns: None

### DocumentUploadForm (functional)

- File: `src/components/htb/developer/forms/DocumentUploadForm.tsx`
- Hooks: useHTB, useRef, useState
- Props: claimId, onSuccess, onError
- State Variables: formData
- Effect Dependencies: None
- Rendering Patterns: None

### FundsReceivedForm (functional)

- File: `src/components/htb/developer/forms/FundsReceivedForm.tsx`
- Hooks: useHTB, useRef, useState, useEffect
- Props: claimId, initialAmount, onSuccess, onError
- State Variables: formData
- Effect Dependencies: initialAmount
- Rendering Patterns: None

### RequestFundsForm (functional)

- File: `src/components/htb/developer/forms/RequestFundsForm.tsx`
- Hooks: useHTB, useRef, useState
- Props: claimId, onSuccess, onError
- State Variables: formData
- Effect Dependencies: None
- Rendering Patterns: None

### Header (functional)

- File: `src/components/layout/Header.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### Layout (functional)

- File: `src/components/layout/Layout.tsx`
- Hooks: None
- Props: children, showNavigation, showFooter
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### MainNavigation (functional)

- File: `src/components/layout/MainNavigation.jsx`
- Hooks: usePathname, useState, useEffect
- Props: theme, isTransparent
- State Variables: isScrolled, isMenuOpen
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### App (functional)

- File: `src/components/layout/_app.tsx`
- Hooks: None
- Props: Component, pageProps
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### NavigationErrorHandler (functional)

- File: `src/components/navigation/NavigationErrorBoundary.tsx`
- Hooks: usePathname, useSearchParams, useState, useEffect
- Props: children, fallback, children
- State Variables: hasError
- Effect Dependencies: pathname, searchParams
- Rendering Patterns: Fragment Usage

### Home (page)

- File: `src/components/pages/Page.tsx`
- Hooks: useRouter, useState
- Props: None
- State Variables: activeTab, isMenuOpen
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### AdminDocumentsPage (page)

- File: `src/components/pages/admin/documents/AdminDocumentsPage.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### BuyerDocumentsPage (page)

- File: `src/components/pages/buyer/documents/BuyerDocumentsPage.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### HTBClaim (page)

- File: `src/components/pages/buyer/htb/BuyerHtbPage.tsx`
- Hooks: useState, useHTB, useRouter
- Props: None
- State Variables: propertyId, firstName, lastName, email, phone, ppsNumber, propertyAddress, claimAmount, isFirstTimeBuyer, isLoading, error, success
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### HTBStatus (page)

- File: `src/components/pages/buyer/htb/status/BuyerHtbStatusPage.tsx`
- Hooks: useHTB, useState, useEffect
- Props: None
- State Variables: loading, statusDetails
- Effect Dependencies: htbClaim, claimStatus
- Rendering Patterns: Conditional Rendering

### DeveloperDashboard (page)

- File: `src/components/pages/developer/DeveloperPage.tsx`
- Hooks: useState, useEffect
- Props: None
- State Variables: activeTab, contractors, properties, salesData
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### DevelopmentSiteMap (page)

- File: `src/components/pages/developments/DevelopmentSiteMap.tsx`
- Hooks: useState
- Props: development
- State Variables: selectedUnit, hoveredUnit
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### FitzgeraldGardensPage (page)

- File: `src/components/pages/developments/DevelopmentsPage.tsx`
- Hooks: useState, useEffect
- Props: None
- State Variables: activeTab, isLoading, selectedHouseType
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### DevelopmentsPage (page)

- File: `src/components/pages/developments/index.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### HomePage (page)

- File: `src/components/pages/index.tsx`
- Hooks: useRouter, useState, useCallback, useEffect
- Props: None
- State Variables: activeTab, isMenuOpen, isLoading, featuredDevelopments, featuredProperties
- Effect Dependencies: fetchData
- Rendering Patterns: Conditional Rendering

### KYCVerificationPage (page)

- File: `src/components/pages/kyc-verifcationpage/Kyc-verifcationPage.tsx`
- Hooks: useRouter, useState
- Props: None
- State Variables: step, formData, errors, isLoading
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### Login (page)

- File: `src/components/pages/login/LoginPage.tsx`
- Hooks: useState, useAuth, useRouter
- Props: None
- State Variables: email, password, error, isLoading
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### PropertiesPage (page)

- File: `src/components/pages/properties/PropertiesPage.tsx`
- Hooks: useRouter, useState, useEffect
- Props: None
- State Variables: selectedDevelopment, selectedBedrooms, selectedStatus, filteredProperties
- Effect Dependencies: selectedDevelopment, selectedBedrooms, selectedStatus
- Rendering Patterns: Conditional Rendering

### Register (page)

- File: `src/components/pages/register/RegisterPage.tsx`
- Hooks: useState, useAuth, useRouter
- Props: None
- State Variables: name, email, password, confirmPassword, role, error, isLoading
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### SolicitorDashboard (page)

- File: `src/components/pages/solicitor/SolicitorPage.tsx`
- Hooks: useAuth, useState, useEffect
- Props: None
- State Variables: activeTab, transactionType, transactions, documents, notifications
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering, Fragment Usage

### TestApiPage (page)

- File: `src/components/pages/test-api/TestapiPage.tsx`
- Hooks: useState, useAuth, useEffect
- Props: None
- State Variables: properties, loading
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### VirtualizedGrid (functional)

- File: `src/components/performance/VirtualizedList.tsx`
- Hooks: useRef, useState, useMemo, useEffect
- Props: items, renderItem, itemHeight, className, height, width, overscan, items, renderItem, itemHeight, columns, gap, className, height, overscan
- State Variables: scrollTop, scrollTop, containerWidth
- Effect Dependencies: None
- Rendering Patterns: None

### AppSecurityProvider (functional)

- File: `src/components/security/AppSecurityProvider.tsx`
- Hooks: None
- Props: children
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### CSRFToken (functional)

- File: `src/components/security/CSRFToken.tsx`
- Hooks: useState, useEffect
- Props: fieldName, tokenExpiry, onTokenGenerated
- State Variables: token
- Effect Dependencies: tokenExpiry
- Rendering Patterns: None

### SecurityBanner (functional)

- File: `src/components/security/ClientSecurityProvider.tsx`
- Hooks: useClientSecurity, useContext, useSecurityContext
- Props: children, options, renderBlockedView, show
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering, Fragment Usage

### MFAChallenge (functional)

- File: `src/components/security/MFAChallenge.tsx`
- Hooks: useState
- Props: onComplete, onCancel, title, description
- State Variables: tab, loading, error, totpCode, smsCode, recoveryCode
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### MFASetup (functional)

- File: `src/components/security/MFASetup.tsx`
- Hooks: useAuth, useState, useEffect
- Props: onComplete, onCancel
- State Variables: tab, step, loading, error, mfaStatus, totpSetupData, verificationCode, phoneNumber, smsVerificationCode, preferences
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering, Fragment Usage

### SafeLink (functional)

- File: `src/components/security/SafeLink.tsx`
- Hooks: useCallback
- Props: href, children, className, openInNewTab, onUnsafeLink, confirmExternal, allowRelative, onlyAllowTrustedDomains, ...props
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### SecurityAlerts (functional)

- File: `src/components/security/SecurityAlerts.tsx`
- Hooks: useAuth, useState, useEffect
- Props: None
- State Variables: alerts, loading, showMFASetup, showMFAChallenge, mfaStatus, sessionValid
- Effect Dependencies: user
- Rendering Patterns: Conditional Rendering, Fragment Usage

### SecurityDashboard (functional)

- File: `src/components/security/SecurityDashboard.tsx`
- Hooks: useState, useEffect
- Props: None
- State Variables: activeTab, featureFlags, loading
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### SecurityMetricsSkeleton (functional)

- File: `src/components/security/SecurityMetricsSkeleton.tsx`
- Hooks: None
- Props: showCharts, showTimeline, columns, rows
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### SecurityMonitor (functional)

- File: `src/components/security/SecurityMonitor.tsx`
- Hooks: useState, useSecurityMonitor, useEffect
- Props: enableRedirectProtection, enableXSSDetection, enableCSPReporting, enableFormProtection, enableInlineScriptChecking, reportViolationsToBackend, reportEndpoint, blockOnCriticalViolations, onViolation, showSecurityBanner, analyticsEnabled
- State Variables: showBanner, latestViolation
- Effect Dependencies: violations, onViolation, showSecurityBanner, analyticsEnabled
- Rendering Patterns: None

### SecuritySetupWizard (functional)

- File: `src/components/security/SecuritySetupWizard.tsx`
- Hooks: useState
- Props: onComplete, initialStep
- State Variables: activeStep, completed, isRegistering
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### MFASetup (functional)

- File: `src/components/security/mfa/MFASetup.tsx`
- Hooks: useState, useAuth, useFeatureFlag, useEffect
- Props: onSetupComplete, onCancel
- State Variables: step, mfaStatus, isLoading, error, qrCode, secretKey, verificationCode, phoneNumber, recoveryCodes
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### ProtectedComponent (functional)

- File: `src/components/security/withCSRFProtection.tsx`
- Hooks: useState, usePathname, useSearchParams, useCSRFToken, useEffect
- Props: None
- State Variables: isVerified, isLoading, error
- Effect Dependencies: pathname, searchParams
- Rendering Patterns: Fragment Usage

### LoadingSpinner (functional)

- File: `src/components/ui/LoadingSpinner.tsx`
- Hooks: None
- Props: size, color, className
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### NotificationCenter (functional)

- File: `src/components/ui/NotificationCenter.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### Badge (functional)

- File: `src/components/ui/badge.tsx`
- Hooks: None
- Props: className, variant, ...props
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### Calendar (functional)

- File: `src/components/ui/calendar.tsx`
- Hooks: None
- Props: className, classNames, showOutsideDays, ...props
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### withErrorBoundary (functional)

- File: `src/components/ui/error-boundary.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering, Fragment Usage

### FormFieldComponent (functional)

- File: `src/components/ui/form-field.tsx`
- Hooks: None
- Props: form, name, label, description, placeholder, type, autoComplete, className, options, rows, disabled
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### Skeleton (functional)

- File: `src/components/ui/skeleton.tsx`
- Hooks: None
- Props: className, ...props
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### Toaster (functional)

- File: `src/components/ui/toaster.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### ClientLayout (page)

- File: `src/app/ClientLayout.tsx`
- Hooks: usePathname
- Props: children
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### AboutPage (page)

- File: `src/app/about/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### Page (page)

- File: `src/app/admin/documents/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### SecurityMonitoringPage (page)

- File: `src/app/admin/security/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### SecurityTestPage (page)

- File: `src/app/admin/security/test/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### CustomizationLayout (page)

- File: `src/app/buyer/customization/layout.tsx`
- Hooks: None
- Props: children
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### getCategoryIcon (page)

- File: `src/app/buyer/customization/page.tsx`
- Hooks: useState, useCustomization, useRouter, useQuery, useCallback
- Props: None
- State Variables: activeRoom, activeCategory, viewMode
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering, Fragment Usage

### Page (page)

- File: `src/app/buyer/documents/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### HTBContextProvider (page)

- File: `src/app/buyer/htb/HTBContextProvider.tsx`
- Hooks: None
- Props: children
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### HTBErrorBoundary (page)

- File: `src/app/buyer/htb/HTBErrorBoundary.tsx`
- Hooks: None
- Props: None
- State Variables: hasError
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### ErrorEventHandler (page)

- File: `src/app/buyer/htb/HTBErrorWrapper.tsx`
- Hooks: useState, useEffect
- Props: children, onError
- State Variables: hasError
- Effect Dependencies: onError
- Rendering Patterns: Fragment Usage

### HTBClaimProcessorWrapper (page)

- File: `src/app/buyer/htb/buyer/developer/HTBClaimProcessor.tsx`
- Hooks: useRouter
- Props: params
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### NewHTBClaimPage (page)

- File: `src/app/buyer/htb/new/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### Page (page)

- File: `src/app/buyer/htb/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### Page (page)

- File: `src/app/buyer/htb/status/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### BuyerDashboardPage (page)

- File: `src/app/buyer/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### ContactPage (page)

- File: `src/app/contact/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### DashboardOverview (page)

- File: `src/app/dashboard/@main/page.tsx`
- Hooks: useAuth, useState, useEffect
- Props: None
- State Variables: stats, loading
- Effect Dependencies: None
- Rendering Patterns: None

### UserProfile (page)

- File: `src/app/dashboard/@main/profile/page.tsx`
- Hooks: useAuth, useState
- Props: None
- State Variables: isEditing, formData
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### SecuritySettings (page)

- File: `src/app/dashboard/@main/security/page.tsx`
- Hooks: useAuth, useState, useSecurityFeatures, useSecuritySettings
- Props: None
- State Variables: activeTab, showMFASetup, showChangePassword, passwordFormData, passwordError, passwordSuccess
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering, Fragment Usage

### DashboardSidebar (page)

- File: `src/app/dashboard/@sidebar/default.tsx`
- Hooks: usePathname, useAuth
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### DashboardLayout (page)

- File: `src/app/dashboard/layout.tsx`
- Hooks: None
- Props: sidebar, main, children
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### EnhancedSecurityDashboardPage (page)

- File: `src/app/dashboard/security/EnhancedSecurityDashboardPage.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### SecurityDashboardClient (page)

- File: `src/app/dashboard/security/SecurityDashboardClient.tsx`
- Hooks: useState, useCallback, useEffect
- Props: initialMetrics, initialEvents, initialAnomalies, initialThreats, securityScore, securityStatus
- State Variables: score, status, metrics, events, anomalies, threats, lastRefreshed, isRefreshing, alertCount
- Effect Dependencies: isRefreshing, status
- Rendering Patterns: Conditional Rendering, Fragment Usage

### SecurityDashboardLayout (page)

- File: `src/app/dashboard/security/layout.tsx`
- Hooks: None
- Props: children
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### SecurityDashboardPage (page)

- File: `src/app/dashboard/security/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### TestingDashboardPage (page)

- File: `src/app/dev/testing-dashboard/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### DocumentsPage (page)

- File: `src/app/developer/documents/page.tsx`
- Hooks: useState
- Props: None
- State Variables: uploadDialogOpen, selectedDocumentId
- Effect Dependencies: None
- Rendering Patterns: None

### HTBClaimProcessorPage (page)

- File: `src/app/developer/htb/claims/[claimId]/page.tsx`
- Hooks: None
- Props: params
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### DeveloperHTBClaimsPage (page)

- File: `src/app/developer/htb/claims/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### DeveloperLayout (page)

- File: `src/app/developer/layout.tsx`
- Hooks: useState, usePathname, useMobile, useEffect
- Props: children
- State Variables: sidebarOpen
- Effect Dependencies: pathname, isMobile, isMobile
- Rendering Patterns: None

### DeveloperPropertiesPage (page)

- File: `src/app/developer/new-project/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### Page (page)

- File: `src/app/developer/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### UserRegistration (page)

- File: `src/app/developer/properties/page.tsx`
- Hooks: useState
- Props: None
- State Variables: formData
- Effect Dependencies: None
- Rendering Patterns: None

### Page (page)

- File: `src/app/developments/[id]/page.tsx`
- Hooks: None
- Props: params, params
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### DevelopmentsPage (page)

- File: `src/app/developments/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### DevelopmentsPage (page)

- File: `src/app/examples/developments/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### KycVerification (page)

- File: `src/app/kyc-verifcationpage/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### RootLayout (page)

- File: `src/app/layout/Layout.jsx`
- Hooks: None
- Props: children
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### RootLayout (page)

- File: `src/app/layout.tsx`
- Hooks: None
- Props: children
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### LoginPage (page)

- File: `src/app/login/page.tsx`
- Hooks: useRouter, useSearchParams, useAuth
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### Home (page)

- File: `src/app/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### ProjectPage (page)

- File: `src/app/projects/[slug]/page.tsx`
- Hooks: useProjectProperties
- Props: params
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### PropertyDetailPage (page)

- File: `src/app/projects/[slug]/units/[id]/page.tsx`
- Hooks: useSession, usePropertyDetails, useState
- Props: params
- State Variables: activeImage, showContactForm
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### PropertyDetailPage (page)

- File: `src/app/projects/propprojects/units/unit11/[slug]/units/page.tsx`
- Hooks: useSession, usePropertyDetails, useState
- Props: params
- State Variables: activeImage, showContactForm
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### DashboardPage (page)

- File: `src/app/prop/dashboard/page.tsx`
- Hooks: useState, useEffect, useParams, useDashboardData
- Props: None
- State Variables: state
- Effect Dependencies: orgSlug
- Rendering Patterns: Conditional Rendering

### ProjectsPage (page)

- File: `src/app/prop/projects/page.tsx`
- Hooks: useParams, useRouter, useState, useProjects, usePermissions
- Props: None
- State Variables: viewMode, searchQuery, filterStatus
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### DocumentTemplatesPage (page)

- File: `src/app/prop/templates/page.tsx`
- Hooks: useParams, useState, useDocumentTemplates, usePermissions
- Props: None
- State Variables: searchQuery, filterCategory
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### PropertyDetailPage (page)

- File: `src/app/properties/[id]/page.tsx`
- Hooks: useParams, useState, useEffect, useCallback
- Props: None
- State Variables: property, isLoading, error, selectedImageIndex
- Effect Dependencies: propertyId
- Rendering Patterns: Conditional Rendering

### Loading (page)

- File: `src/app/properties/loading.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### PropertiesPage (page)

- File: `src/app/properties/page.tsx`
- Hooks: useFeaturedProperties
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### PropertySearchPage (page)

- File: `src/app/properties/search/page.tsx`
- Hooks: useRouter, useSearchParams, useState, useSearchProperties, useEffect
- Props: None
- State Variables: searchQuery, propertyType, minPrice, maxPrice, minBedrooms, minArea, status, sortBy, sortOrder, page, viewMode, showMobileFilters, expandedFilters
- Effect Dependencies: searchQuery, propertyType, minPrice, maxPrice, minBedrooms, minArea, status, sortBy, sortOrder, page, router
- Rendering Patterns: Conditional Rendering, Fragment Usage

### PropertySearchPage (page)

- File: `src/app/property/page.tsx`
- Hooks: useRouter, useSearchParams, usePathname, useState, useEffect
- Props: None
- State Variables: properties, loading, error, totalProperties, totalPages
- Effect Dependencies: location, minPrice, maxPrice, bedrooms, type, sort, page
- Rendering Patterns: Conditional Rendering, Fragment Usage

### RegisterPage (page)

- File: `src/app/register/page.tsx`
- Hooks: useRouter, useAuth
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### Page (page)

- File: `src/app/solicitor/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### Page (page)

- File: `src/app/testapi/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### TrustedDevicesPage (page)

- File: `src/app/user/security/devices/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### SecurityDashboardPage (page)

- File: `src/app/user/security/page.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### SecuritySetupPage (page)

- File: `src/app/user/security/setup/page.tsx`
- Hooks: useRouter, useState
- Props: None
- State Variables: setupComplete
- Effect Dependencies: None
- Rendering Patterns: Conditional Rendering

### App (page)

- File: `src/pages/_app.tsx`
- Hooks: useEffect
- Props: Component, pageProps
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

### Document (page)

- File: `src/pages/_document.tsx`
- Hooks: None
- Props: None
- State Variables: None
- Effect Dependencies: None
- Rendering Patterns: None

## Potentially Similar Components

### AccessCodeForm & AddNoteForm

- Similarity Score: 1.00
- Reasons:
  - Similar hooks (useHTB, useState)
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/AccessCodeForm.tsx`
  - `src/components/htb/developer/forms/AddNoteForm.tsx`

### ClaimCodeForm & CompleteClaimForm

- Similarity Score: 1.00
- Reasons:
  - Similar hooks (useHTB, useRef, useState)
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/ClaimCodeForm.tsx`
  - `src/components/htb/developer/forms/CompleteClaimForm.tsx`

### ClaimCodeForm & DepositAppliedForm

- Similarity Score: 1.00
- Reasons:
  - Similar hooks (useHTB, useRef, useState)
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/ClaimCodeForm.tsx`
  - `src/components/htb/developer/forms/DepositAppliedForm.tsx`

### ClaimCodeForm & DocumentUploadForm

- Similarity Score: 1.00
- Reasons:
  - Similar hooks (useHTB, useRef, useState)
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/ClaimCodeForm.tsx`
  - `src/components/htb/developer/forms/DocumentUploadForm.tsx`

### ClaimCodeForm & FundsReceivedForm

- Similarity Score: 1.00
- Reasons:
  - Similar hooks (useHTB, useRef, useState)
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/ClaimCodeForm.tsx`
  - `src/components/htb/developer/forms/FundsReceivedForm.tsx`

### ClaimCodeForm & RequestFundsForm

- Similarity Score: 1.00
- Reasons:
  - Similar hooks (useHTB, useRef, useState)
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/ClaimCodeForm.tsx`
  - `src/components/htb/developer/forms/RequestFundsForm.tsx`

### CompleteClaimForm & DepositAppliedForm

- Similarity Score: 1.00
- Reasons:
  - Similar hooks (useHTB, useRef, useState)
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/CompleteClaimForm.tsx`
  - `src/components/htb/developer/forms/DepositAppliedForm.tsx`

### CompleteClaimForm & DocumentUploadForm

- Similarity Score: 1.00
- Reasons:
  - Similar hooks (useHTB, useRef, useState)
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/CompleteClaimForm.tsx`
  - `src/components/htb/developer/forms/DocumentUploadForm.tsx`

### CompleteClaimForm & FundsReceivedForm

- Similarity Score: 1.00
- Reasons:
  - Similar hooks (useHTB, useRef, useState)
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/CompleteClaimForm.tsx`
  - `src/components/htb/developer/forms/FundsReceivedForm.tsx`

### CompleteClaimForm & RequestFundsForm

- Similarity Score: 1.00
- Reasons:
  - Similar hooks (useHTB, useRef, useState)
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/CompleteClaimForm.tsx`
  - `src/components/htb/developer/forms/RequestFundsForm.tsx`

### DepositAppliedForm & DocumentUploadForm

- Similarity Score: 1.00
- Reasons:
  - Similar hooks (useHTB, useRef, useState)
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/DepositAppliedForm.tsx`
  - `src/components/htb/developer/forms/DocumentUploadForm.tsx`

### DepositAppliedForm & FundsReceivedForm

- Similarity Score: 1.00
- Reasons:
  - Similar hooks (useHTB, useRef, useState)
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/DepositAppliedForm.tsx`
  - `src/components/htb/developer/forms/FundsReceivedForm.tsx`

### DepositAppliedForm & RequestFundsForm

- Similarity Score: 1.00
- Reasons:
  - Similar hooks (useHTB, useRef, useState)
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/DepositAppliedForm.tsx`
  - `src/components/htb/developer/forms/RequestFundsForm.tsx`

### DocumentUploadForm & FundsReceivedForm

- Similarity Score: 1.00
- Reasons:
  - Similar hooks (useHTB, useRef, useState)
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/DocumentUploadForm.tsx`
  - `src/components/htb/developer/forms/FundsReceivedForm.tsx`

### DocumentUploadForm & RequestFundsForm

- Similarity Score: 1.00
- Reasons:
  - Similar hooks (useHTB, useRef, useState)
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/DocumentUploadForm.tsx`
  - `src/components/htb/developer/forms/RequestFundsForm.tsx`

### FundsReceivedForm & RequestFundsForm

- Similarity Score: 1.00
- Reasons:
  - Similar hooks (useHTB, useRef, useState)
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/FundsReceivedForm.tsx`
  - `src/components/htb/developer/forms/RequestFundsForm.tsx`

### PropertyDetailPage & PropertyDetailPage

- Similarity Score: 1.00
- Reasons:
  - Similar hooks (useSession, usePropertyDetails, useState)
  - Similar props (params)
  - Similar rendering patterns
  - Similar state variables (activeImage, showContactForm)
- Files:
  - `src/app/projects/[slug]/units/[id]/page.tsx`
  - `src/app/projects/propprojects/units/unit11/[slug]/units/page.tsx`

### AboutPageClient & ContactPageClient

- Similarity Score: 0.80
- Reasons:
  - Similar hooks (useEffect)
  - Similar props (data)
  - Similar rendering patterns
- Files:
  - `src/components/about/AboutPageClient.tsx`
  - `src/components/contact/ContactPageClient.tsx`

### AccessCodeForm & ClaimCodeForm

- Similarity Score: 0.70
- Reasons:
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/AccessCodeForm.tsx`
  - `src/components/htb/developer/forms/ClaimCodeForm.tsx`

### AccessCodeForm & CompleteClaimForm

- Similarity Score: 0.70
- Reasons:
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/AccessCodeForm.tsx`
  - `src/components/htb/developer/forms/CompleteClaimForm.tsx`

### AccessCodeForm & DepositAppliedForm

- Similarity Score: 0.70
- Reasons:
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/AccessCodeForm.tsx`
  - `src/components/htb/developer/forms/DepositAppliedForm.tsx`

### AccessCodeForm & DocumentUploadForm

- Similarity Score: 0.70
- Reasons:
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/AccessCodeForm.tsx`
  - `src/components/htb/developer/forms/DocumentUploadForm.tsx`

### AccessCodeForm & FundsReceivedForm

- Similarity Score: 0.70
- Reasons:
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/AccessCodeForm.tsx`
  - `src/components/htb/developer/forms/FundsReceivedForm.tsx`

### AccessCodeForm & RequestFundsForm

- Similarity Score: 0.70
- Reasons:
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/AccessCodeForm.tsx`
  - `src/components/htb/developer/forms/RequestFundsForm.tsx`

### AddNoteForm & ClaimCodeForm

- Similarity Score: 0.70
- Reasons:
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/AddNoteForm.tsx`
  - `src/components/htb/developer/forms/ClaimCodeForm.tsx`

### AddNoteForm & CompleteClaimForm

- Similarity Score: 0.70
- Reasons:
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/AddNoteForm.tsx`
  - `src/components/htb/developer/forms/CompleteClaimForm.tsx`

### AddNoteForm & DepositAppliedForm

- Similarity Score: 0.70
- Reasons:
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/AddNoteForm.tsx`
  - `src/components/htb/developer/forms/DepositAppliedForm.tsx`

### AddNoteForm & DocumentUploadForm

- Similarity Score: 0.70
- Reasons:
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/AddNoteForm.tsx`
  - `src/components/htb/developer/forms/DocumentUploadForm.tsx`

### AddNoteForm & FundsReceivedForm

- Similarity Score: 0.70
- Reasons:
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/AddNoteForm.tsx`
  - `src/components/htb/developer/forms/FundsReceivedForm.tsx`

### AddNoteForm & RequestFundsForm

- Similarity Score: 0.70
- Reasons:
  - Similar props (claimId, onSuccess, onError)
  - Similar rendering patterns
  - Similar state variables (formData)
- Files:
  - `src/components/htb/developer/forms/AddNoteForm.tsx`
  - `src/components/htb/developer/forms/RequestFundsForm.tsx`

### ROICalculator & ScenarioComparison

- Similarity Score: 0.60
- Reasons:
  - Similar hooks (useState, useMemo)
  - Similar props (projectId, className)
- Files:
  - `src/components/finance/ROICalculator.tsx`
  - `src/components/finance/ScenarioComparison.tsx`

### AmplifyDataFetcher & EnvironmentFlag

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useState, useEffect)
  - Similar rendering patterns
- Files:
  - `src/components/AmplifyDataFetcher.tsx`
  - `src/components/features/FeatureFlag.tsx`

### HomePage & QueryClientWrapper

- Similarity Score: 0.50
- Reasons:
  - Similar props (children)
  - Similar rendering patterns
- Files:
  - `src/components/HomePage.tsx`
  - `src/components/QueryClientWrapper.tsx`

### FeatureFlagEditor & FeatureFlagAdmin

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useState, useEffect)
  - Similar rendering patterns
- Files:
  - `src/components/admin/FeatureFlagManager.tsx`
  - `src/components/features/FeatureFlagAdmin.tsx`

### FeatureFlagEditor & SecurityDashboard

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useState, useEffect)
  - Similar rendering patterns
- Files:
  - `src/components/admin/FeatureFlagManager.tsx`
  - `src/components/security/SecurityDashboard.tsx`

### DocumentManager & MFASetup

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useAuth, useState, useEffect)
  - Similar rendering patterns
- Files:
  - `src/components/buyer/DocumentManager.tsx`
  - `src/components/security/mfa/MFASetup.tsx`

### BuyerDashboard & DeveloperDashboard

- Similarity Score: 0.50
- Reasons:
  - Similar props (user)
  - Similar rendering patterns
- Files:
  - `src/components/dashboard/BuyerDashboard.tsx`
  - `src/components/dashboard/DeveloperDashboard.tsx`

### DeveloperHeader & DocumentFilterBar

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useState)
  - Similar rendering patterns
- Files:
  - `src/components/developer/DeveloperHeader.tsx`
  - `src/components/document/DocumentFilterBar.tsx`

### DeveloperHeader & MFAChallenge

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useState)
  - Similar rendering patterns
- Files:
  - `src/components/developer/DeveloperHeader.tsx`
  - `src/components/security/MFAChallenge.tsx`

### DeveloperHeader & SecuritySetupWizard

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useState)
  - Similar rendering patterns
- Files:
  - `src/components/developer/DeveloperHeader.tsx`
  - `src/components/security/SecuritySetupWizard.tsx`

### FitzgeraldGardensHub & DocumentsPage

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useState)
  - Similar rendering patterns
- Files:
  - `src/components/developer/project/fitzgerald-gardens/page.tsx`
  - `src/app/developer/documents/page.tsx`

### FitzgeraldGardensHub & UserRegistration

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useState)
  - Similar rendering patterns
- Files:
  - `src/components/developer/project/fitzgerald-gardens/page.tsx`
  - `src/app/developer/properties/page.tsx`

### DocumentFilterBar & MFAChallenge

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useState)
  - Similar rendering patterns
- Files:
  - `src/components/document/DocumentFilterBar.tsx`
  - `src/components/security/MFAChallenge.tsx`

### DocumentFilterBar & SecuritySetupWizard

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useState)
  - Similar rendering patterns
- Files:
  - `src/components/document/DocumentFilterBar.tsx`
  - `src/components/security/SecuritySetupWizard.tsx`

### FeatureFlagAdmin & SecurityDashboard

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useState, useEffect)
  - Similar rendering patterns
- Files:
  - `src/components/features/FeatureFlagAdmin.tsx`
  - `src/components/security/SecurityDashboard.tsx`

### HTBWrapper & AppSecurityProvider

- Similarity Score: 0.50
- Reasons:
  - Similar props (children)
  - Similar rendering patterns
- Files:
  - `src/components/htb/HTBWrapper.tsx`
  - `src/components/security/AppSecurityProvider.tsx`

### FundsReceivedForm & VirtualizedGrid

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useRef, useState, useEffect)
  - Similar rendering patterns
- Files:
  - `src/components/htb/developer/forms/FundsReceivedForm.tsx`
  - `src/components/performance/VirtualizedList.tsx`

### NavigationErrorHandler & ProtectedComponent

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (usePathname, useSearchParams, useState, useEffect)
  - Similar rendering patterns
- Files:
  - `src/components/navigation/NavigationErrorBoundary.tsx`
  - `src/components/security/withCSRFProtection.tsx`

### Home & KYCVerificationPage

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useRouter, useState)
  - Similar rendering patterns
- Files:
  - `src/components/pages/Page.tsx`
  - `src/components/pages/kyc-verifcationpage/Kyc-verifcationPage.tsx`

### Home & SecuritySetupPage

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useRouter, useState)
  - Similar rendering patterns
- Files:
  - `src/components/pages/Page.tsx`
  - `src/app/user/security/setup/page.tsx`

### DeveloperDashboard & FitzgeraldGardensPage

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useState, useEffect)
  - Similar rendering patterns
- Files:
  - `src/components/pages/developer/DeveloperPage.tsx`
  - `src/components/pages/developments/DevelopmentsPage.tsx`

### HomePage & PropertiesPage

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useRouter, useState, useEffect)
  - Similar rendering patterns
- Files:
  - `src/components/pages/index.tsx`
  - `src/components/pages/properties/PropertiesPage.tsx`

### HomePage & PropertyDetailPage

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useState, useCallback, useEffect)
  - Similar rendering patterns
- Files:
  - `src/components/pages/index.tsx`
  - `src/app/properties/[id]/page.tsx`

### KYCVerificationPage & SecuritySetupPage

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useRouter, useState)
  - Similar rendering patterns
- Files:
  - `src/components/pages/kyc-verifcationpage/Kyc-verifcationPage.tsx`
  - `src/app/user/security/setup/page.tsx`

### Login & Register

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useState, useAuth, useRouter)
  - Similar rendering patterns
- Files:
  - `src/components/pages/login/LoginPage.tsx`
  - `src/components/pages/register/RegisterPage.tsx`

### MFAChallenge & SecuritySetupWizard

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useState)
  - Similar rendering patterns
- Files:
  - `src/components/security/MFAChallenge.tsx`
  - `src/components/security/SecuritySetupWizard.tsx`

### MFASetup & SecurityAlerts

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useAuth, useState, useEffect)
  - Similar rendering patterns
- Files:
  - `src/components/security/MFASetup.tsx`
  - `src/components/security/SecurityAlerts.tsx`

### CustomizationLayout & HTBContextProvider

- Similarity Score: 0.50
- Reasons:
  - Similar props (children)
  - Similar rendering patterns
- Files:
  - `src/app/buyer/customization/layout.tsx`
  - `src/app/buyer/htb/HTBContextProvider.tsx`

### CustomizationLayout & SecurityDashboardLayout

- Similarity Score: 0.50
- Reasons:
  - Similar props (children)
  - Similar rendering patterns
- Files:
  - `src/app/buyer/customization/layout.tsx`
  - `src/app/dashboard/security/layout.tsx`

### CustomizationLayout & DeveloperLayout

- Similarity Score: 0.50
- Reasons:
  - Similar props (children)
  - Similar rendering patterns
- Files:
  - `src/app/buyer/customization/layout.tsx`
  - `src/app/developer/layout.tsx`

### CustomizationLayout & RootLayout

- Similarity Score: 0.50
- Reasons:
  - Similar props (children)
  - Similar rendering patterns
- Files:
  - `src/app/buyer/customization/layout.tsx`
  - `src/app/layout/Layout.jsx`

### CustomizationLayout & RootLayout

- Similarity Score: 0.50
- Reasons:
  - Similar props (children)
  - Similar rendering patterns
- Files:
  - `src/app/buyer/customization/layout.tsx`
  - `src/app/layout.tsx`

### HTBContextProvider & SecurityDashboardLayout

- Similarity Score: 0.50
- Reasons:
  - Similar props (children)
  - Similar rendering patterns
- Files:
  - `src/app/buyer/htb/HTBContextProvider.tsx`
  - `src/app/dashboard/security/layout.tsx`

### HTBContextProvider & DeveloperLayout

- Similarity Score: 0.50
- Reasons:
  - Similar props (children)
  - Similar rendering patterns
- Files:
  - `src/app/buyer/htb/HTBContextProvider.tsx`
  - `src/app/developer/layout.tsx`

### HTBContextProvider & RootLayout

- Similarity Score: 0.50
- Reasons:
  - Similar props (children)
  - Similar rendering patterns
- Files:
  - `src/app/buyer/htb/HTBContextProvider.tsx`
  - `src/app/layout/Layout.jsx`

### HTBContextProvider & RootLayout

- Similarity Score: 0.50
- Reasons:
  - Similar props (children)
  - Similar rendering patterns
- Files:
  - `src/app/buyer/htb/HTBContextProvider.tsx`
  - `src/app/layout.tsx`

### HTBClaimProcessorWrapper & HTBClaimProcessorPage

- Similarity Score: 0.50
- Reasons:
  - Similar props (params)
  - Similar rendering patterns
- Files:
  - `src/app/buyer/htb/buyer/developer/HTBClaimProcessor.tsx`
  - `src/app/developer/htb/claims/[claimId]/page.tsx`

### HTBClaimProcessorWrapper & ProjectPage

- Similarity Score: 0.50
- Reasons:
  - Similar props (params)
  - Similar rendering patterns
- Files:
  - `src/app/buyer/htb/buyer/developer/HTBClaimProcessor.tsx`
  - `src/app/projects/[slug]/page.tsx`

### SecurityDashboardLayout & DeveloperLayout

- Similarity Score: 0.50
- Reasons:
  - Similar props (children)
  - Similar rendering patterns
- Files:
  - `src/app/dashboard/security/layout.tsx`
  - `src/app/developer/layout.tsx`

### SecurityDashboardLayout & RootLayout

- Similarity Score: 0.50
- Reasons:
  - Similar props (children)
  - Similar rendering patterns
- Files:
  - `src/app/dashboard/security/layout.tsx`
  - `src/app/layout/Layout.jsx`

### SecurityDashboardLayout & RootLayout

- Similarity Score: 0.50
- Reasons:
  - Similar props (children)
  - Similar rendering patterns
- Files:
  - `src/app/dashboard/security/layout.tsx`
  - `src/app/layout.tsx`

### DocumentsPage & UserRegistration

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useState)
  - Similar rendering patterns
- Files:
  - `src/app/developer/documents/page.tsx`
  - `src/app/developer/properties/page.tsx`

### HTBClaimProcessorPage & ProjectPage

- Similarity Score: 0.50
- Reasons:
  - Similar props (params)
  - Similar rendering patterns
- Files:
  - `src/app/developer/htb/claims/[claimId]/page.tsx`
  - `src/app/projects/[slug]/page.tsx`

### DeveloperLayout & RootLayout

- Similarity Score: 0.50
- Reasons:
  - Similar props (children)
  - Similar rendering patterns
- Files:
  - `src/app/developer/layout.tsx`
  - `src/app/layout/Layout.jsx`

### DeveloperLayout & RootLayout

- Similarity Score: 0.50
- Reasons:
  - Similar props (children)
  - Similar rendering patterns
- Files:
  - `src/app/developer/layout.tsx`
  - `src/app/layout.tsx`

### Page & ProjectPage

- Similarity Score: 0.50
- Reasons:
  - Similar props (params, params)
  - Similar rendering patterns
- Files:
  - `src/app/developments/[id]/page.tsx`
  - `src/app/projects/[slug]/page.tsx`

### RootLayout & RootLayout

- Similarity Score: 0.50
- Reasons:
  - Similar props (children)
  - Similar rendering patterns
- Files:
  - `src/app/layout/Layout.jsx`
  - `src/app/layout.tsx`

### DashboardPage & PropertyDetailPage

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useState, useEffect, useParams)
  - Similar rendering patterns
- Files:
  - `src/app/prop/dashboard/page.tsx`
  - `src/app/properties/[id]/page.tsx`

### PropertySearchPage & PropertySearchPage

- Similarity Score: 0.50
- Reasons:
  - Similar hooks (useRouter, useSearchParams, useState, useEffect)
  - Similar rendering patterns
- Files:
  - `src/app/properties/search/page.tsx`
  - `src/app/property/page.tsx`

## Potential Issues

### Large Components

The following components may be too large and could benefit from being broken down:

- **RoomVisualizer** (functional)
  - 10 hooks, 5 state variables, 16 props
  - File: `src/components/3d/RoomVisualizer.old.tsx`

- **VirtualizedGrid** (functional)
  - 4 hooks, 3 state variables, 15 props
  - File: `src/components/performance/VirtualizedList.tsx`

- **DocumentUploadDialog** (functional)
  - 3 hooks, 10 state variables, 6 props
  - File: `src/components/document/DocumentUploadDialog.tsx`

- **SecurityDashboardClient** (page)
  - 3 hooks, 9 state variables, 6 props
  - File: `src/app/dashboard/security/SecurityDashboardClient.tsx`

- **PropertySearchPage** (page)
  - 5 hooks, 13 state variables, 0 props
  - File: `src/app/properties/search/page.tsx`

- **SecurityMonitor** (functional)
  - 3 hooks, 2 state variables, 11 props
  - File: `src/components/security/SecurityMonitor.tsx`

- **HTBClaim** (page)
  - 3 hooks, 12 state variables, 0 props
  - File: `src/components/pages/buyer/htb/BuyerHtbPage.tsx`

- **MFASetup** (functional)
  - 3 hooks, 10 state variables, 2 props
  - File: `src/components/security/MFASetup.tsx`

- **MFASetup** (functional)
  - 4 hooks, 9 state variables, 2 props
  - File: `src/components/security/mfa/MFASetup.tsx`

- **DocumentGenerator** (functional)
  - 7 hooks, 4 state variables, 3 props
  - File: `src/components/documents/DocumentGenerator.tsx`

### Component Organization

The following page components have many props and might need to be restructured:

- **SecurityDashboardClient** (6 props)
  - File: `src/app/dashboard/security/SecurityDashboardClient.tsx`

### Components with useEffect and no dependencies

The following components use useEffect without specified dependencies, which might lead to unnecessary renders:

- **AmplifyProvider**
  - File: `src/components/AmplifyProvider.tsx`

- **HomePage**
  - File: `src/components/HomePage.tsx`

- **AboutPageClient**
  - File: `src/components/about/AboutPageClient.tsx`

- **FeatureFlagEditor**
  - File: `src/components/admin/FeatureFlagManager.tsx`

- **DocumentManager**
  - File: `src/components/buyer/DocumentManager.tsx`

- **ContactPageClient**
  - File: `src/components/contact/ContactPageClient.tsx`

- **FeatureFlagAdmin**
  - File: `src/components/features/FeatureFlagAdmin.tsx`

- **MainNavigation**
  - File: `src/components/layout/MainNavigation.jsx`

- **DeveloperDashboard**
  - File: `src/components/pages/developer/DeveloperPage.tsx`

- **FitzgeraldGardensPage**
  - File: `src/components/pages/developments/DevelopmentsPage.tsx`

- **SolicitorDashboard**
  - File: `src/components/pages/solicitor/SolicitorPage.tsx`

- **TestApiPage**
  - File: `src/components/pages/test-api/TestapiPage.tsx`

- **VirtualizedGrid**
  - File: `src/components/performance/VirtualizedList.tsx`

- **MFASetup**
  - File: `src/components/security/MFASetup.tsx`

- **SecurityDashboard**
  - File: `src/components/security/SecurityDashboard.tsx`

- **MFASetup**
  - File: `src/components/security/mfa/MFASetup.tsx`

- **DashboardOverview**
  - File: `src/app/dashboard/@main/page.tsx`

- **App**
  - File: `src/pages/_app.tsx`

## Recommendations

- Consider migrating remaining class components (2) to functional components with hooks.
- Consider standardizing state management. Currently using multiple approaches: useState, context
- Refactor large components into smaller, more focused components.
- Review useEffect hooks without dependency arrays.
- Review similar components for potential consolidation.
