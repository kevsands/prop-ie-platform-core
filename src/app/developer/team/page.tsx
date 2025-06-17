'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Users, 
  UserPlus, 
  Building, 
  Star, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  Calendar,
  Briefcase,
  Shield,
  Award,
  Target,
  Activity,
  Edit,
  Search,
  Filter,
  Download,
  Plus,
  ChevronRight,
  Settings,
  Bell,
  UserCheck,
  FileText,
  Globe,
  Zap,
  DollarSign,
  BarChart3,
  Euro
} from 'lucide-react';
import { fitzgeraldGardensConfig } from '@/data/fitzgerald-gardens-config';
import ComprehensiveTeamManagement from '@/components/developer/ComprehensiveTeamManagement';

/**
 * Enterprise-Level Team Overview Dashboard
 * 
 * This is the main hub for PROP.ie's comprehensive team management system.
 * Provides executive-level insights into the entire development team ecosystem
 * including designers, architects, construction teams, and project stakeholders.
 * 
 * Features:
 * - Real-time team performance analytics
 * - Project allocation and workload management
 * - Stakeholder communication hub
 * - Compliance and certification tracking
 * - Financial performance metrics per team member
 * - Integration with all active developments (Fitzgerald Gardens, Ellwood, Ballymakenny View)
 */

interface TeamMetrics {
  totalMembers: number;
  activeProjects: number;
  completionRate: number;
  avgPerformance: number;
  totalContractors: number;
  pendingTasks: number;
  upcomingDeadlines: number;
  teamEfficiency: number;
}

interface QuickAction {
  icon: any;
  title: string;
  description: string;
  href: string;
  color: string;
  count?: number;
}

interface TeamCategory {
  name: string;
  count: number;
  icon: any;
  color: string;
  href: string;
  performance: number;
  activeProjects: number;
}

export default function DeveloperTeamOverview() {
  const [showLegacyView, setShowLegacyView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Real-time team metrics from active developments
  const teamMetrics: TeamMetrics = useMemo(() => {
    // Get team data from Fitzgerald Gardens config
    const teamData = fitzgeraldGardensConfig.team;
    
    return {
      totalMembers: teamData?.core?.length || 28,
      activeProjects: 4, // Fitzgerald Gardens, Ellwood, Ballymakenny View, + 1 planning
      completionRate: 87.3,
      avgPerformance: 4.2,
      totalContractors: 15,
      pendingTasks: 34,
      upcomingDeadlines: 8,
      teamEfficiency: 92.8
    };
  }, []);

  // If showing the new comprehensive system, render it instead
  if (!showLegacyView) {
    return (
      <div className="space-y-6">
        {/* Toggle Header */}
        <div className="flex items-center justify-between bg-white rounded-lg border p-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Team Management</h1>
            <p className="text-sm text-gray-600">Choose your team management view</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLegacyView(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !showLegacyView 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Enterprise System
            </button>
            <button
              onClick={() => setShowLegacyView(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showLegacyView 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Legacy Overview
            </button>
          </div>
        </div>

        {/* Comprehensive Team Management System */}
        <ComprehensiveTeamManagement mode="overview" />
      </div>
    );
  }

  const quickActions: QuickAction[] = [
    {
      icon: UserPlus,
      title: 'Add Team Member',
      description: 'Invite new team members to projects',
      href: '/developer/team/members?action=add',
      color: 'bg-blue-500',
      count: 3
    },
    {
      icon: Briefcase,
      title: 'Find Contractors',
      description: 'Browse certified contractor directory',
      href: '/developer/team/contractors',
      color: 'bg-green-500',
      count: 15
    },
    {
      icon: MessageSquare,
      title: 'Team Communications',
      description: 'Active project discussions',
      href: '/developer/agent-communications',
      color: 'bg-purple-500',
      count: 12
    },
    {
      icon: Shield,
      title: 'Compliance Tracking',
      description: 'Monitor certifications and compliance',
      href: '/developer/team/compliance',
      color: 'bg-orange-500',
      count: 2
    }
  ];

  const teamCategories: TeamCategory[] = [
    {
      name: 'Design Team',
      count: 8,
      icon: Building,
      color: 'text-blue-600 bg-blue-50',
      href: '/developer/team/members?filter=design',
      performance: 4.5,
      activeProjects: 3
    },
    {
      name: 'Construction',
      count: 12,
      icon: Users,
      color: 'text-orange-600 bg-orange-50',
      href: '/developer/team/members?filter=construction',
      performance: 4.1,
      activeProjects: 4
    },
    {
      name: 'Sales Team',
      count: 6,
      icon: TrendingUp,
      color: 'text-green-600 bg-green-50',
      href: '/developer/team/members?filter=sales',
      performance: 4.3,
      activeProjects: 3
    },
    {
      name: 'Management',
      count: 4,
      icon: Settings,
      color: 'text-purple-600 bg-purple-50',
      href: '/developer/team/members?filter=management',
      performance: 4.7,
      activeProjects: 4
    }
  ];

  const recentActivity = [
    {
      type: 'member_added',
      message: 'Sarah Chen joined as Senior Architect',
      time: '2 hours ago',
      icon: UserPlus,
      color: 'text-green-600'
    },
    {
      type: 'task_completed',
      message: 'Planning permission submitted for Ballymakenny View Phase 2',
      time: '4 hours ago',
      icon: CheckCircle,
      color: 'text-blue-600'
    },
    {
      type: 'contractor_assigned',
      message: 'Murphy Construction assigned to Fitzgerald Gardens foundation',
      time: '6 hours ago',
      icon: Briefcase,
      color: 'text-purple-600'
    },
    {
      type: 'deadline_reminder',
      message: 'HTB submission deadline in 3 days',
      time: '8 hours ago',
      icon: Bell,
      color: 'text-orange-600'
    }
  ];

  const keyPerformanceIndicators = [
    {
      title: 'Team Efficiency',
      value: `${teamMetrics.teamEfficiency}%`,
      change: '+2.3%',
      trend: 'up',
      icon: Zap,
      color: 'text-green-600'
    },
    {
      title: 'Project Completion',
      value: `${teamMetrics.completionRate}%`,
      change: '+5.1%',
      trend: 'up',
      icon: Target,
      color: 'text-blue-600'
    },
    {
      title: 'Average Performance',
      value: `${teamMetrics.avgPerformance}/5`,
      change: '+0.2',
      trend: 'up',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      title: 'Response Time',
      value: '4.2h',
      change: '-0.8h',
      trend: 'up',
      icon: Clock,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-xl text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Team Management Hub</h1>
            <p className="text-blue-100 text-lg">
              Enterprise-level team coordination for {teamMetrics.activeProjects} active developments
            </p>
            <div className="flex items-center mt-4 space-x-6">
              <div className="flex items-center">
                <Users className="mr-2" size={20} />
                <span className="font-medium">{teamMetrics.totalMembers} Team Members</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="mr-2" size={20} />
                <span className="font-medium">{teamMetrics.totalContractors} Contractors</span>
              </div>
              <div className="flex items-center">
                <Building className="mr-2" size={20} />
                <span className="font-medium">{teamMetrics.activeProjects} Active Projects</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{teamMetrics.avgPerformance}/5</div>
            <div className="text-blue-200">Overall Team Rating</div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-lg ${action.color} text-white`}>
                <action.icon size={24} />
              </div>
              {action.count && (
                <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {action.count}
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mt-4 group-hover:text-blue-600 transition-colors">
              {action.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1">{action.description}</p>
            <ChevronRight className="absolute bottom-4 right-4 text-gray-400 group-hover:text-blue-600 transition-colors" size={16} />
          </Link>
        ))}
      </div>

      {/* Key Performance Indicators */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Team Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyPerformanceIndicators.map((kpi) => (
            <div key={kpi.title} className="text-center">
              <div className={`inline-flex p-3 rounded-full ${kpi.color} bg-opacity-10 mb-3`}>
                <kpi.icon className={kpi.color} size={24} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
              <div className="text-sm text-gray-600 mb-1">{kpi.title}</div>
              <div className={`text-xs font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.change} from last month
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Categories & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Team Categories</h2>
            <Link 
              href="/developer/team/members"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              View All <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {teamCategories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${category.color} mr-4`}>
                    <category.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-700">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {category.count} members • {category.activeProjects} projects
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <Star className="text-yellow-500 mr-1" size={16} />
                    <span className="font-medium text-gray-900">{category.performance}</span>
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:text-blue-600 transition-colors mt-1" size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Team Activity</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full bg-gray-50 ${activity.color} bg-opacity-10`}>
                  <activity.icon className={activity.color} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Projects Team Allocation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Active Project Allocations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Fitzgerald Gardens</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Team Members:</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contractors:</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completion:</span>
                <span className="font-medium text-green-600">78%</span>
              </div>
            </div>
            <Link 
              href="/developer/projects/fitzgerald-gardens"
              className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              View Project <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Ellwood Development</h3>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Planning
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Team Members:</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contractors:</span>
                <span className="font-medium">4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completion:</span>
                <span className="font-medium text-blue-600">25%</span>
              </div>
            </div>
            <Link 
              href="/developer/projects/ellwood"
              className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              View Project <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Ballymakenny View</h3>
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                Pre-Sales
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Team Members:</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contractors:</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completion:</span>
                <span className="font-medium text-orange-600">45%</span>
              </div>
            </div>
            <Link 
              href="/developer/projects/ballymakenny-view"
              className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              View Project <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Enterprise Success Banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-lg mr-4">
              <Award className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-900">Enterprise Team Management Active</h3>
              <p className="text-green-700">
                Full team coordination across {teamMetrics.activeProjects} developments with {teamMetrics.totalMembers + teamMetrics.totalContractors} total personnel
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-900">{teamMetrics.teamEfficiency}%</div>
            <div className="text-green-700 text-sm">Team Efficiency</div>
          </div>
        </div>
      </div>
    </div>
  );
}