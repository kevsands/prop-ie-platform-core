'use client';

import React, { useState, useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  Users, 
  MapPin, 
  Calendar, 
  Euro, 
  Settings, 
  BarChart3,
  Eye,
  Edit3,
  Zap,
  Target,
  Camera,
  CreditCard,
  Receipt,
  UserCheck,
  Briefcase,
  Globe,
  Activity,
  ArrowUpRight,
  Cpu,
  Home
} from 'lucide-react';

interface ProjectLayoutProps {
  children: React.ReactNode;
}

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  const params = useParams();
  const pathname = usePathname();
  const projectSlug = params.projectSlug as string;
  
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Direct API call without the complex hook
  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/projects/${projectSlug}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setProject(result.data);
            console.log('✅ Layout: Project loaded successfully:', result.data.name);
          } else {
            setError('Failed to load project data');
          }
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Layout error loading project:', err);
        setError('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };

    if (projectSlug) {
      loadProject();
    }
  }, [projectSlug]);

  // Calculate metrics from project data
  const totalUnits = project?.units?.length || 0;
  const soldUnits = project?.units?.filter((u: any) => u.status === 'sold').length || 0;
  const reservedUnits = project?.units?.filter((u: any) => u.status === 'reserved').length || 0;
  const availableUnits = project?.units?.filter((u: any) => u.status === 'available').length || 0;

  // Navigation configuration for all project features
  const navigationSections = [
    {
      title: "Core Management",
      items: [
        { href: `/developer/projects/${projectSlug}`, label: 'Project Overview', icon: Home },
        { href: `/developer/projects/${projectSlug}/timeline`, label: 'Project Timeline', icon: Calendar },
        { href: `/developer/projects/${projectSlug}/unit-management`, label: 'Unit Management', icon: Building2 },
        { href: `/developer/projects/${projectSlug}/financial-overview`, label: 'Financial Overview', icon: Euro },
      ]
    },
    {
      title: "Analytics & Intelligence", 
      items: [
        { href: `/developer/projects/${projectSlug}/enterprise-analytics`, label: 'Enterprise Analytics Engine', icon: Cpu },
        { href: `/developer/projects/${projectSlug}/analytics`, label: 'Enhanced Analytics', icon: BarChart3 },
        { href: `/developer/projects/${projectSlug}/ai-market-intelligence`, label: 'AI Market Intelligence', icon: Zap },
        { href: `/developer/projects/${projectSlug}/investment-analysis`, label: 'Investment Analysis', icon: Briefcase },
        { href: `/developer/projects/${projectSlug}/financial-management`, label: 'Financial Management', icon: CreditCard },
        { href: `/developer/projects/${projectSlug}/ai-pricing-analytics`, label: 'AI Pricing Analytics', icon: Target },
      ]
    },
    {
      title: "Sales & Customers",
      items: [
        { href: `/developer/projects/${projectSlug}/buyer-journey-tracking`, label: 'Buyer Journey Tracking', icon: UserCheck },
        { href: `/developer/projects/${projectSlug}/enterprise-transactions`, label: 'Enterprise Transaction Manager', icon: Receipt },
        { href: `/developer/projects/${projectSlug}/live-transactions`, label: 'Live Transactions', icon: Activity },
        { href: `/developer/projects/${projectSlug}/marketing-display`, label: 'Marketing Display', icon: Globe },
      ]
    },
    {
      title: "Team & Operations",
      items: [
        { href: `/developer/projects/${projectSlug}/media-plans`, label: 'Media & Plans', icon: Camera },
        { href: `/developer/projects/${projectSlug}/interactive-site-plan`, label: 'Interactive Site Plan', icon: MapPin },
        { href: `/developer/projects/${projectSlug}/enterprise-team-manager`, label: 'Enterprise Team Manager', icon: UserCheck },
        { href: `/developer/projects/${projectSlug}/team-management`, label: 'Team Management', icon: Users },
        { href: `/developer/projects/${projectSlug}/enterprise-invoices`, label: 'Enterprise Invoice Manager', icon: CreditCard },
        { href: `/developer/projects/${projectSlug}/invoice-management`, label: 'Invoice Management', icon: Receipt },
      ]
    }
  ];

  // External links (keeping advanced analytics as external for now)
  const externalLinks = [
    {
      href: `/developer/projects/${projectSlug}/analytics/advanced`,
      label: 'Advanced Analytics Hub',
      icon: Activity
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project data...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Error loading project: {error || 'Project not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Building2 size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project?.name || 'Loading...'}</h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} />
                  <span>
                    {project?.location 
                      ? (typeof project.location === 'string' 
                         ? project.location 
                         : `${project.location.address || ''}, ${project.location.city || ''}, ${project.location.county || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ','))
                      : 'Loading location...'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-blue-600" />
                <span className="text-gray-600">Completion: {project?.timeline?.plannedCompletion ? new Date(project.timeline.plannedCompletion).toLocaleDateString() : 'TBA'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target size={16} className="text-green-600" />
                <span className="text-gray-600">{project?.timeline?.progressPercentage || 68}% Complete</span>
              </div>
              <div className="flex items-center gap-2">
                <Euro size={16} className="text-purple-600" />
                <span className="text-gray-600">Total Value: €{((project?.metrics?.projectedRevenue || 0) / 1000000).toFixed(1)}M</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Eye size={16} />
              View Public Listing
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Settings size={16} />
              Project Settings
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Project Progress</span>
            <span className="text-sm text-gray-600">{project?.timeline?.currentPhase || 'Phase 1'}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${project?.timeline?.progressPercentage || 68}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Units</p>
              <p className="text-2xl font-bold text-gray-900">{totalUnits}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 size={20} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Units Sold</p>
              <p className="text-2xl font-bold text-green-600">{soldUnits}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Target size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reserved</p>
              <p className="text-2xl font-bold text-amber-600">{reservedUnits}</p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Calendar size={20} className="text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-blue-600">{availableUnits}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Home size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area with Sidebar Navigation */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="flex min-h-[700px]">
          {/* Project Navigation Sidebar */}
          <div className="w-72 bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200 relative">
            {/* Sidebar Header */}
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <h3 className="text-lg font-bold">{project?.name || 'Loading...'}</h3>
              <p className="text-green-100 text-sm">Project Management Hub</p>
            </div>

            {/* Navigation Sections */}
            <nav className="p-4">
              <div className="space-y-6">
                {navigationSections.map((section, sectionIndex) => (
                  <div key={section.title}>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                      {section.title}
                    </h4>
                    <ul className="space-y-1">
                      {section.items.map((item) => {
                        const isActive = pathname === item.href;
                        const colorClass = sectionIndex === 0 ? 'green' : 
                                         sectionIndex === 1 ? 'blue' : 
                                         sectionIndex === 2 ? 'purple' : 'orange';
                        
                        // Get proper color classes based on section
                        const getActiveClasses = (sectionIndex: number) => {
                          switch (sectionIndex) {
                            case 0: return {
                              bg: 'bg-white text-green-700 shadow-md border border-green-100 transform scale-[1.02]',
                              icon: 'bg-green-100 text-green-600',
                              dot: 'bg-green-500'
                            };
                            case 1: return {
                              bg: 'bg-white text-blue-700 shadow-md border border-blue-100 transform scale-[1.02]',
                              icon: 'bg-blue-100 text-blue-600', 
                              dot: 'bg-blue-500'
                            };
                            case 2: return {
                              bg: 'bg-white text-purple-700 shadow-md border border-purple-100 transform scale-[1.02]',
                              icon: 'bg-purple-100 text-purple-600',
                              dot: 'bg-purple-500'
                            };
                            case 3: return {
                              bg: 'bg-white text-orange-700 shadow-md border border-orange-100 transform scale-[1.02]',
                              icon: 'bg-orange-100 text-orange-600',
                              dot: 'bg-orange-500'
                            };
                            default: return {
                              bg: 'bg-white text-gray-700 shadow-md border border-gray-100 transform scale-[1.02]',
                              icon: 'bg-gray-100 text-gray-600',
                              dot: 'bg-gray-500'
                            };
                          }
                        };

                        const activeClasses = getActiveClasses(sectionIndex);

                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isActive
                                  ? activeClasses.bg
                                  : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
                              }`}
                            >
                              <div className={`p-2 rounded-lg ${
                                isActive
                                  ? activeClasses.icon
                                  : 'bg-gray-200 text-gray-500'
                              }`}>
                                <item.icon size={16} />
                              </div>
                              <span className="flex-1 text-left">{item.label}</span>
                              {isActive && (
                                <div className={`w-2 h-2 ${activeClasses.dot} rounded-full animate-pulse`}></div>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}

                {/* External Links */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                    Advanced Features
                  </h4>
                  <ul className="space-y-1">
                    {externalLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-gray-600 hover:bg-white/60 hover:text-gray-900 group"
                        >
                          <div className="p-2 rounded-lg bg-gray-200 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600">
                            <link.icon size={16} />
                          </div>
                          <span className="flex-1 text-left">{link.label}</span>
                          <ArrowUpRight size={14} className="text-gray-400 group-hover:text-blue-600" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </nav>

            {/* Sidebar Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-500 text-center">
                <div className="font-medium">{project?.timeline?.progressPercentage || 68}% Complete</div>
                <div className="mt-1">Last updated: {new Date().toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 bg-white relative">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}