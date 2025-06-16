'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  FileText, 
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  DollarSign,
  Building,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface ExcelToolsHubProps {
  projectId?: string;
  context: string;
  selectedData?: any;
}

export function ExcelToolsHub({ projectId, context, selectedData }: ExcelToolsHubProps) {
  const [isExportingsetIsExporting] = useState(false);
  const [exportProgresssetExportProgress] = useState(0);

  // Available Excel templates based on context
  const getAvailableTemplates = () => {
    const baseTemplates = [
      {
        id: 'financial-summary',
        name: 'Financial Summary',
        description: 'Complete project financial overview',
        icon: DollarSign,
        sheets: ['Revenue', 'Costs', 'Cash Flow', 'Projections'],
        size: '2.3 MB'
      },
      {
        id: 'boq-export',
        name: 'Bills of Quantities',
        description: 'Detailed BOQ with variations',
        icon: Building,
        sheets: ['BOQ Items', 'Variations', 'Approvals', 'Summary'],
        size: '1.8 MB'
      }
    ];

    if (context === 'financial') {
      return [
        ...baseTemplates,
        {
          id: 'development-appraisal',
          name: 'Development Appraisal',
          description: 'Fitzgerald Gardens model template',
          icon: TrendingUp,
          sheets: ['Inputs', 'Scenarios', 'Cash Flows', 'Returns'],
          size: '4.1 MB'
        },
        {
          id: 'cash-flow',
          name: 'Cash Flow Analysis',
          description: '36-month detailed projections',
          icon: BarChart3,
          sheets: ['Monthly CF', 'Quarterly', 'Annual', 'Variance'],
          size: '1.5 MB'
        }
      ];
    }

    if (context === 'construction') {
      return [
        ...baseTemplates,
        {
          id: 'contractor-schedule',
          name: 'Contractor Schedule',
          description: 'Work packages and timelines',
          icon: Users,
          sheets: ['Schedule', 'Milestones', 'Payments', 'Resources'],
          size: '2.1 MB'
        },
        {
          id: 'progress-tracking',
          name: 'Progress Tracking',
          description: '15-phase progress monitoring',
          icon: Clock,
          sheets: ['Phase Progress', 'S-Curve', 'Delays', 'Forecasts'],
          size: '1.9 MB'
        }
      ];
    }

    return baseTemplates;
  };

  const templates = getAvailableTemplates();

  // Recent export history
  const recentExports = [
    {
      id: '1',
      name: 'Fitzgerald_Gardens_Financial_Summary.xlsx',
      type: 'Financial Summary',
      date: '2 hours ago',
      status: 'completed',
      size: '2.3 MB'
    },
    {
      id: '2',
      name: 'BOQ_Export_Phase_1-5.xlsx',
      type: 'Bills of Quantities',
      date: '1 day ago',
      status: 'completed',
      size: '1.8 MB'
    },
    {
      id: '3',
      name: 'Development_Appraisal_v2.xlsx',
      type: 'Development Appraisal',
      date: '3 days ago',
      status: 'completed',
      size: '4.1 MB'
    }
  ];

  const handleExport = async (templateId: string) => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev>= 100) {
          clearInterval(interval);
          setIsExporting(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="space-y-4">
      {/* Quick Export Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Quick Export
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExport('current-data')}
              disabled={isExporting}
            >
              <Download className="h-4 w-4 mr-1" />
              Current Data
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-1" />
              Import Data
            </Button>
          </div>
          
          {isExporting && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Exporting...</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Excel Templates */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Excel Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {templates.map((template) => {
            const IconComponent = template.icon;
            return (
              <div key={template.id} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <div className="bg-green-100 p-1.5 rounded">
                      <IconComponent className="h-3 w-3 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{template.name}</p>
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.sheets.slice(0).map((sheet) => (
                          <Badge key={sheet} variant="secondary" className="text-xs px-1 py-0">
                            {sheet}
                          </Badge>
                        ))}
                        {template.sheets.length> 2 && (
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            +{template.sheets.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{template.size}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-1 h-6 px-2 text-xs"
                      onClick={() => handleExport(template.id)}
                      disabled={isExporting}
                    >
                      Export
                    </Button>
                  </div>
                </div>
                
                {template !== templates[templates.length - 1] && <Separator />}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Exports */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Recent Exports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentExports.map((export_item) => (
            <div key={export_item.id} className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 p-1.5 rounded">
                    <FileText className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{export_item.name}</p>
                    <p className="text-xs text-muted-foreground">{export_item.type}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{export_item.date}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{export_item.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <Button variant="ghost" size="sm" className="h-6 px-1">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {export_item !== recentExports[recentExports.length - 1] && <Separator />}
            </div>
          ))}
          
          <Button variant="outline" size="sm" className="w-full">
            View All Exports
          </Button>
        </CardContent>
      </Card>

      {/* Import Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Import Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Upload className="h-4 w-4 mr-2" />
              Import BOQ Data
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Import Financial Model
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Import Progress Data
            </Button>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 p-2 rounded">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-amber-800">Import Guidelines</p>
                <p className="text-xs text-amber-700">Ensure Excel files follow the template format for accurate data mapping.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}