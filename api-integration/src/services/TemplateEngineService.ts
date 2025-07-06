/**
 * Template Engine Service
 * Advanced template system for dynamic document generation
 * 
 * @fileoverview Handles template creation, customization and rendering for project documentation
 * @version 1.0.0
 */

import { 
  DocumentTemplate, 
  TemplateSection, 
  TemplateVariable, 
  TemplateFormatting,
  ProjectBibleData 
} from '@/types/projectBible';
import { fitzgeraldGardensConfig } from '@/data/fitzgerald-gardens-config';

// =============================================================================
// TEMPLATE ENGINE INTERFACES
// =============================================================================

export interface TemplateComponent {
  id: string;
  name: string;
  type: 'text' | 'table' | 'chart' | 'image' | 'list' | 'section-break' | 'page-break';
  properties: ComponentProperties;
  styling: ComponentStyling;
  dataBinding?: DataBinding;
  conditions?: TemplateCondition[];
}

export interface ComponentProperties {
  content?: string;
  placeholder?: string;
  required?: boolean;
  repeatable?: boolean;
  maxItems?: number;
  validation?: ValidationRule[];
}

export interface ComponentStyling {
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | 'lighter';
  color?: string;
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  border?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  width?: string;
  height?: string;
}

export interface DataBinding {
  source: string;
  field?: string;
  format?: string;
  transform?: string;
  aggregation?: 'sum' | 'average' | 'count' | 'min' | 'max';
  filter?: FilterCondition[];
}

export interface FilterCondition {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'startsWith' | 'endsWith';
  value: any;
}

export interface TemplateCondition {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'exists' | 'empty';
  value: any;
  action: 'show' | 'hide' | 'required' | 'disabled';
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

export interface TemplateRenderOptions {
  format: 'html' | 'markdown' | 'json';
  includeMetadata: boolean;
  variables: Record<string, any>;
  showPlaceholders: boolean;
  validationMode: boolean;
}

export interface TemplateRenderResult {
  success: boolean;
  content: string;
  metadata: RenderMetadata;
  errors: TemplateError[];
  warnings: TemplateWarning[];
}

export interface RenderMetadata {
  templateId: string;
  renderedAt: Date;
  dataBindings: number;
  componentsRendered: number;
  totalSize: number;
  renderTime: number;
}

export interface TemplateError {
  componentId: string;
  type: 'data-binding' | 'validation' | 'rendering' | 'missing-data';
  message: string;
  severity: 'error' | 'warning';
}

export interface TemplateWarning extends TemplateError {
  suggestion?: string;
}

// =============================================================================
// TEMPLATE ENGINE SERVICE
// =============================================================================

export class TemplateEngineService {
  private static instance: TemplateEngineService;
  private templates: Map<string, DocumentTemplate> = new Map();
  private customComponents: Map<string, TemplateComponent> = new Map();
  private renderCache: Map<string, TemplateRenderResult> = new Map();

  private constructor() {
    this.initializeDefaultTemplates();
    this.initializeCustomComponents();
  }

  public static getInstance(): TemplateEngineService {
    if (!TemplateEngineService.instance) {
      TemplateEngineService.instance = new TemplateEngineService();
    }
    return TemplateEngineService.instance;
  }

  // =============================================================================
  // TEMPLATE MANAGEMENT
  // =============================================================================

  private initializeDefaultTemplates(): void {
    const defaultTemplates: DocumentTemplate[] = [
      {
        templateId: 'executive-summary',
        name: 'Executive Summary',
        description: 'Professional executive summary template',
        sections: [
          {
            sectionId: 'header',
            name: 'Document Header',
            order: 1,
            required: true,
            dataSource: 'project.metadata',
            format: 'text'
          },
          {
            sectionId: 'project-overview',
            name: 'Project Overview',
            order: 2,
            required: true,
            dataSource: 'project.summary',
            format: 'text'
          },
          {
            sectionId: 'financial-summary',
            name: 'Financial Summary',
            order: 3,
            required: true,
            dataSource: 'project.financials',
            format: 'table'
          },
          {
            sectionId: 'key-metrics',
            name: 'Key Performance Metrics',
            order: 4,
            required: true,
            dataSource: 'project.kpis',
            format: 'chart'
          }
        ],
        variables: [
          {
            variableId: 'project-name',
            name: 'Project Name',
            dataType: 'string',
            source: 'project.name',
            defaultValue: 'Fitzgerald Gardens'
          },
          {
            variableId: 'report-date',
            name: 'Report Date',
            dataType: 'date',
            source: 'system.currentDate'
          },
          {
            variableId: 'total-investment',
            name: 'Total Investment',
            dataType: 'number',
            source: 'project.totalInvestment'
          }
        ],
        formatting: {
          pageSize: 'A4',
          orientation: 'portrait',
          margins: { top: 25, right: 25, bottom: 25, left: 25 },
          fonts: { 
            heading: 'Inter Bold', 
            body: 'Inter Regular', 
            caption: 'Inter Light' 
          },
          colors: { 
            primary: '#2563eb', 
            secondary: '#64748b', 
            accent: '#10b981' 
          },
          logo: '/images/fitzgerald-logo.png'
        }
      },
      {
        templateId: 'soa-detailed',
        name: 'Detailed Schedule of Accommodations',
        description: 'Comprehensive SOA with unit specifications',
        sections: [
          {
            sectionId: 'soa-summary',
            name: 'SOA Summary',
            order: 1,
            required: true,
            dataSource: 'project.soa.summary',
            format: 'table'
          },
          {
            sectionId: 'unit-schedules',
            name: 'Unit Schedules',
            order: 2,
            required: true,
            dataSource: 'project.soa.units',
            format: 'table'
          },
          {
            sectionId: 'common-areas',
            name: 'Common Areas',
            order: 3,
            required: true,
            dataSource: 'project.soa.commonAreas',
            format: 'table'
          },
          {
            sectionId: 'compliance',
            name: 'Compliance Checklist',
            order: 4,
            required: true,
            dataSource: 'project.soa.compliance',
            format: 'table'
          }
        ],
        variables: [
          {
            variableId: 'total-units',
            name: 'Total Units',
            dataType: 'number',
            source: 'project.totalUnits'
          },
          {
            variableId: 'total-area',
            name: 'Total Area',
            dataType: 'number',
            source: 'project.totalArea'
          }
        ],
        formatting: {
          pageSize: 'A4',
          orientation: 'portrait',
          margins: { top: 20, right: 20, bottom: 20, left: 20 },
          fonts: { 
            heading: 'Inter Bold', 
            body: 'Inter Regular', 
            caption: 'Inter Light' 
          },
          colors: { 
            primary: '#1f2937', 
            secondary: '#6b7280', 
            accent: '#3b82f6' 
          }
        }
      },
      {
        templateId: 'financial-analysis',
        name: 'Financial Analysis Report',
        description: 'Comprehensive financial analysis with charts and projections',
        sections: [
          {
            sectionId: 'financial-overview',
            name: 'Financial Overview',
            order: 1,
            required: true,
            dataSource: 'project.financials.overview',
            format: 'text'
          },
          {
            sectionId: 'investment-breakdown',
            name: 'Investment Breakdown',
            order: 2,
            required: true,
            dataSource: 'project.financials.investment',
            format: 'chart'
          },
          {
            sectionId: 'cash-flow',
            name: 'Cash Flow Analysis',
            order: 3,
            required: true,
            dataSource: 'project.financials.cashFlow',
            format: 'chart'
          },
          {
            sectionId: 'roi-projections',
            name: 'ROI Projections',
            order: 4,
            required: true,
            dataSource: 'project.financials.roi',
            format: 'table'
          }
        ],
        variables: [
          {
            variableId: 'roi-percentage',
            name: 'ROI Percentage',
            dataType: 'number',
            source: 'project.roi'
          },
          {
            variableId: 'break-even-date',
            name: 'Break Even Date',
            dataType: 'date',
            source: 'project.breakEvenDate'
          }
        ],
        formatting: {
          pageSize: 'A4',
          orientation: 'landscape',
          margins: { top: 20, right: 20, bottom: 20, left: 20 },
          fonts: { 
            heading: 'Inter Bold', 
            body: 'Inter Regular', 
            caption: 'Inter Light' 
          },
          colors: { 
            primary: '#059669', 
            secondary: '#6b7280', 
            accent: '#dc2626' 
          }
        }
      }
    ];

    defaultTemplates.forEach(template => {
      this.templates.set(template.templateId, template);
    });
  }

  private initializeCustomComponents(): void {
    const customComponents: TemplateComponent[] = [
      {
        id: 'project-header',
        name: 'Project Header',
        type: 'text',
        properties: {
          content: '{{projectName}} - {{reportType}}',
          required: true
        },
        styling: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#1f2937',
          textAlign: 'center',
          margin: '0 0 20px 0'
        },
        dataBinding: {
          source: 'project.metadata',
          field: 'name'
        }
      },
      {
        id: 'financial-kpi-grid',
        name: 'Financial KPI Grid',
        type: 'table',
        properties: {
          repeatable: true
        },
        styling: {
          border: '1px solid #e5e7eb',
          width: '100%'
        },
        dataBinding: {
          source: 'project.financials.kpis',
          format: 'grid'
        }
      },
      {
        id: 'unit-breakdown-chart',
        name: 'Unit Breakdown Chart',
        type: 'chart',
        properties: {},
        styling: {
          height: '300px',
          width: '100%'
        },
        dataBinding: {
          source: 'project.units',
          aggregation: 'count',
          format: 'pie-chart'
        }
      },
      {
        id: 'milestone-timeline',
        name: 'Project Milestone Timeline',
        type: 'chart',
        properties: {},
        styling: {
          height: '200px',
          width: '100%'
        },
        dataBinding: {
          source: 'project.milestones',
          format: 'timeline'
        }
      },
      {
        id: 'team-organogram',
        name: 'Team Organization Chart',
        type: 'image',
        properties: {},
        styling: {
          width: '100%',
          height: 'auto'
        },
        dataBinding: {
          source: 'project.team',
          format: 'organogram'
        }
      }
    ];

    customComponents.forEach(component => {
      this.customComponents.set(component.id, component);
    });
  }

  // =============================================================================
  // TEMPLATE CREATION AND CUSTOMIZATION
  // =============================================================================

  public createTemplate(
    name: string, 
    description: string, 
    baseTemplateId?: string
  ): DocumentTemplate {
    const templateId = `custom-${Date.now()}`;
    
    const baseTemplate = baseTemplateId ? this.templates.get(baseTemplateId) : null;
    
    const newTemplate: DocumentTemplate = {
      templateId,
      name,
      description,
      sections: baseTemplate ? [...baseTemplate.sections] : [],
      variables: baseTemplate ? [...baseTemplate.variables] : [],
      formatting: baseTemplate ? { ...baseTemplate.formatting } : {
        pageSize: 'A4',
        orientation: 'portrait',
        margins: { top: 25, right: 25, bottom: 25, left: 25 },
        fonts: { 
          heading: 'Inter Bold', 
          body: 'Inter Regular', 
          caption: 'Inter Light' 
        },
        colors: { 
          primary: '#2563eb', 
          secondary: '#64748b', 
          accent: '#10b981' 
        }
      }
    };

    this.templates.set(templateId, newTemplate);
    return newTemplate;
  }

  public updateTemplate(templateId: string, updates: Partial<DocumentTemplate>): boolean {
    const template = this.templates.get(templateId);
    if (!template) return false;

    const updatedTemplate = { ...template, ...updates };
    this.templates.set(templateId, updatedTemplate);
    
    // Clear cache for this template
    this.clearTemplateCache(templateId);
    
    return true;
  }

  public addTemplateSection(
    templateId: string, 
    section: TemplateSection
  ): boolean {
    const template = this.templates.get(templateId);
    if (!template) return false;

    template.sections.push(section);
    template.sections.sort((a, b) => a.order - b.order);
    
    this.clearTemplateCache(templateId);
    return true;
  }

  public removeTemplateSection(templateId: string, sectionId: string): boolean {
    const template = this.templates.get(templateId);
    if (!template) return false;

    template.sections = template.sections.filter(s => s.sectionId !== sectionId);
    this.clearTemplateCache(templateId);
    return true;
  }

  public addTemplateVariable(
    templateId: string, 
    variable: TemplateVariable
  ): boolean {
    const template = this.templates.get(templateId);
    if (!template) return false;

    template.variables.push(variable);
    this.clearTemplateCache(templateId);
    return true;
  }

  // =============================================================================
  // TEMPLATE RENDERING
  // =============================================================================

  public async renderTemplate(
    templateId: string,
    data: ProjectBibleData,
    options: TemplateRenderOptions = {
      format: 'html',
      includeMetadata: false,
      variables: {},
      showPlaceholders: false,
      validationMode: false
    }
  ): Promise<TemplateRenderResult> {
    const startTime = Date.now();
    const template = this.templates.get(templateId);
    
    if (!template) {
      return {
        success: false,
        content: '',
        metadata: this.createEmptyMetadata(templateId, startTime),
        errors: [{
          componentId: 'template',
          type: 'missing-data',
          message: `Template ${templateId} not found`,
          severity: 'error'
        }],
        warnings: []
      };
    }

    try {
      const renderContext = this.createRenderContext(template, data, options.variables);
      const renderedSections: string[] = [];
      const errors: TemplateError[] = [];
      const warnings: TemplateWarning[] = [];

      // Render each section
      for (const section of template.sections) {
        try {
          const sectionResult = await this.renderSection(section, renderContext, options);
          renderedSections.push(sectionResult.content);
          errors.push(...sectionResult.errors);
          warnings.push(...sectionResult.warnings);
        } catch (error) {
          errors.push({
            componentId: section.sectionId,
            type: 'rendering',
            message: `Failed to render section: ${error.message}`,
            severity: 'error'
          });
        }
      }

      const content = this.combineRenderedSections(renderedSections, template, options);
      const renderTime = Date.now() - startTime;

      const result: TemplateRenderResult = {
        success: errors.filter(e => e.severity === 'error').length === 0,
        content,
        metadata: {
          templateId,
          renderedAt: new Date(),
          dataBindings: this.countDataBindings(template),
          componentsRendered: template.sections.length,
          totalSize: content.length,
          renderTime
        },
        errors,
        warnings
      };

      // Cache successful renders
      if (result.success) {
        this.cacheRenderResult(templateId, result);
      }

      return result;

    } catch (error) {
      return {
        success: false,
        content: '',
        metadata: this.createEmptyMetadata(templateId, startTime),
        errors: [{
          componentId: 'template',
          type: 'rendering',
          message: `Template rendering failed: ${error.message}`,
          severity: 'error'
        }],
        warnings: []
      };
    }
  }

  private createRenderContext(
    template: DocumentTemplate,
    data: ProjectBibleData,
    customVariables: Record<string, any>
  ): RenderContext {
    const variables = { ...customVariables };
    
    // Resolve template variables
    template.variables.forEach(variable => {
      if (!variables[variable.variableId]) {
        variables[variable.variableId] = this.resolveVariableValue(variable, data);
      }
    });

    return {
      template,
      data,
      variables,
      components: this.customComponents
    };
  }

  private resolveVariableValue(variable: TemplateVariable, data: ProjectBibleData): any {
    const sourceParts = variable.source.split('.');
    let value: any = data;

    for (const part of sourceParts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return variable.defaultValue;
      }
    }

    return value !== undefined ? value : variable.defaultValue;
  }

  private async renderSection(
    section: TemplateSection,
    context: RenderContext,
    options: TemplateRenderOptions
  ): Promise<SectionRenderResult> {
    const errors: TemplateError[] = [];
    const warnings: TemplateWarning[] = [];

    try {
      const sectionData = this.extractSectionData(section, context.data);
      
      if (!sectionData && section.required) {
        errors.push({
          componentId: section.sectionId,
          type: 'missing-data',
          message: `Required data not found for section: ${section.name}`,
          severity: 'error'
        });
      }

      let content = '';
      
      switch (section.format) {
        case 'text':
          content = this.renderTextSection(section, sectionData, context);
          break;
        case 'table':
          content = this.renderTableSection(section, sectionData, context);
          break;
        case 'chart':
          content = this.renderChartSection(section, sectionData, context);
          break;
        case 'image':
          content = this.renderImageSection(section, sectionData, context);
          break;
        default:
          content = this.renderGenericSection(section, sectionData, context);
      }

      // Apply section-level styling
      if (options.format === 'html') {
        content = this.applyHtmlStyling(content, section, context.template.formatting);
      }

      return {
        content,
        errors,
        warnings
      };

    } catch (error) {
      errors.push({
        componentId: section.sectionId,
        type: 'rendering',
        message: `Section rendering failed: ${error.message}`,
        severity: 'error'
      });

      return {
        content: options.showPlaceholders ? `[ERROR: ${section.name}]` : '',
        errors,
        warnings
      };
    }
  }

  private extractSectionData(section: TemplateSection, data: ProjectBibleData): any {
    const sourceParts = section.dataSource.split('.');
    let sectionData: any = data;

    for (const part of sourceParts) {
      if (sectionData && typeof sectionData === 'object' && part in sectionData) {
        sectionData = sectionData[part];
      } else {
        return null;
      }
    }

    return sectionData;
  }

  private renderTextSection(
    section: TemplateSection,
    data: any,
    context: RenderContext
  ): string {
    if (!data) return '';

    let content = '';
    
    if (typeof data === 'string') {
      content = data;
    } else if (typeof data === 'object') {
      // Handle object data for text sections
      if (data.content) {
        content = data.content;
      } else if (data.description) {
        content = data.description;
      } else {
        content = JSON.stringify(data, null, 2);
      }
    }

    // Replace variables in content
    content = this.replaceVariables(content, context.variables);
    
    return content;
  }

  private renderTableSection(
    section: TemplateSection,
    data: any,
    context: RenderContext
  ): string {
    if (!data) return '';

    if (Array.isArray(data)) {
      return this.renderDataTable(data, section.sectionId);
    } else if (typeof data === 'object') {
      return this.renderObjectTable(data, section.sectionId);
    }

    return '';
  }

  private renderChartSection(
    section: TemplateSection,
    data: any,
    context: RenderContext
  ): string {
    if (!data) return '';

    // For HTML format, we'll include chart placeholders
    // In a real implementation, this would generate actual chart HTML/SVG
    const chartId = `chart-${section.sectionId}`;
    
    return `<div id="${chartId}" class="chart-placeholder" data-chart-type="auto" data-chart-data='${JSON.stringify(data)}'>
      [Chart: ${section.name}]
    </div>`;
  }

  private renderImageSection(
    section: TemplateSection,
    data: any,
    context: RenderContext
  ): string {
    if (!data) return '';

    if (typeof data === 'string' && data.startsWith('http')) {
      return `<img src="${data}" alt="${section.name}" style="max-width: 100%; height: auto;" />`;
    }

    return `<div class="image-placeholder">[Image: ${section.name}]</div>`;
  }

  private renderGenericSection(
    section: TemplateSection,
    data: any,
    context: RenderContext
  ): string {
    if (!data) return '';
    
    return `<div class="generic-section">
      <h3>${section.name}</h3>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    </div>`;
  }

  private renderDataTable(data: any[], tableId: string): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const headerRow = headers.map(h => `<th>${h}</th>`).join('');
    const bodyRows = data.map(row => 
      `<tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>`
    ).join('');

    return `<table id="${tableId}" class="data-table">
      <thead><tr>${headerRow}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>`;
  }

  private renderObjectTable(data: object, tableId: string): string {
    const rows = Object.entries(data).map(([key, value]) => 
      `<tr><td><strong>${key}</strong></td><td>${value}</td></tr>`
    ).join('');

    return `<table id="${tableId}" class="object-table">
      <tbody>${rows}</tbody>
    </table>`;
  }

  private replaceVariables(content: string, variables: Record<string, any>): string {
    return content.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      return variables[varName] !== undefined ? String(variables[varName]) : match;
    });
  }

  private applyHtmlStyling(
    content: string,
    section: TemplateSection,
    formatting: TemplateFormatting
  ): string {
    const sectionClass = `section-${section.sectionId}`;
    return `<div class="${sectionClass}">${content}</div>`;
  }

  private combineRenderedSections(
    sections: string[],
    template: DocumentTemplate,
    options: TemplateRenderOptions
  ): string {
    if (options.format === 'html') {
      const styles = this.generateCSS(template.formatting);
      const header = this.generateDocumentHeader(template);
      const body = sections.join('\n\n');
      
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${template.name}</title>
  <style>${styles}</style>
</head>
<body>
  ${header}
  <div class="content">
    ${body}
  </div>
</body>
</html>`;
    } else if (options.format === 'markdown') {
      return sections.join('\n\n---\n\n');
    } else {
      return sections.join('\n\n');
    }
  }

  private generateCSS(formatting: TemplateFormatting): string {
    return `
      body {
        font-family: ${formatting.fonts.body};
        margin: ${formatting.margins.top}mm ${formatting.margins.right}mm ${formatting.margins.bottom}mm ${formatting.margins.left}mm;
        color: ${formatting.colors.primary};
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-family: ${formatting.fonts.heading};
        color: ${formatting.colors.primary};
      }
      
      .data-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      
      .data-table th,
      .data-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      
      .data-table th {
        background-color: ${formatting.colors.secondary}20;
        font-weight: bold;
      }
      
      .chart-placeholder {
        background-color: #f8f9fa;
        border: 2px dashed #dee2e6;
        padding: 40px;
        text-align: center;
        margin: 20px 0;
        color: #6c757d;
      }
      
      .image-placeholder {
        background-color: #f8f9fa;
        border: 1px solid #dee2e6;
        padding: 20px;
        text-align: center;
        margin: 20px 0;
        color: #6c757d;
      }
    `;
  }

  private generateDocumentHeader(template: DocumentTemplate): string {
    return `<div class="document-header">
      <h1>${template.name}</h1>
      <p class="document-description">${template.description}</p>
    </div>`;
  }

  private countDataBindings(template: DocumentTemplate): number {
    return template.sections.reduce((count, section) => {
      return count + (section.dataSource ? 1 : 0);
    }, 0);
  }

  private createEmptyMetadata(templateId: string, startTime: number): RenderMetadata {
    return {
      templateId,
      renderedAt: new Date(),
      dataBindings: 0,
      componentsRendered: 0,
      totalSize: 0,
      renderTime: Date.now() - startTime
    };
  }

  private cacheRenderResult(templateId: string, result: TemplateRenderResult): void {
    const cacheKey = `${templateId}-${Date.now()}`;
    this.renderCache.set(cacheKey, result);
    
    // Limit cache size
    if (this.renderCache.size > 100) {
      const oldestKey = this.renderCache.keys().next().value;
      this.renderCache.delete(oldestKey);
    }
  }

  private clearTemplateCache(templateId: string): void {
    const keysToDelete = Array.from(this.renderCache.keys())
      .filter(key => key.startsWith(templateId));
    
    keysToDelete.forEach(key => this.renderCache.delete(key));
  }

  // =============================================================================
  // PUBLIC API METHODS
  // =============================================================================

  public getTemplate(templateId: string): DocumentTemplate | undefined {
    return this.templates.get(templateId);
  }

  public getAllTemplates(): DocumentTemplate[] {
    return Array.from(this.templates.values());
  }

  public getCustomComponents(): TemplateComponent[] {
    return Array.from(this.customComponents.values());
  }

  public addCustomComponent(component: TemplateComponent): boolean {
    this.customComponents.set(component.id, component);
    return true;
  }

  public validateTemplate(templateId: string): TemplateValidationResult {
    const template = this.templates.get(templateId);
    
    if (!template) {
      return {
        valid: false,
        errors: ['Template not found'],
        warnings: []
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate sections
    if (template.sections.length === 0) {
      errors.push('Template must have at least one section');
    }

    // Check for duplicate section orders
    const orders = template.sections.map(s => s.order);
    const duplicateOrders = orders.filter((order, index) => orders.indexOf(order) !== index);
    if (duplicateOrders.length > 0) {
      errors.push(`Duplicate section orders found: ${duplicateOrders.join(', ')}`);
    }

    // Validate data sources
    template.sections.forEach(section => {
      if (!section.dataSource) {
        warnings.push(`Section '${section.name}' has no data source`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  public deleteTemplate(templateId: string): boolean {
    const deleted = this.templates.delete(templateId);
    if (deleted) {
      this.clearTemplateCache(templateId);
    }
    return deleted;
  }
}

// =============================================================================
// ADDITIONAL INTERFACES
// =============================================================================

interface RenderContext {
  template: DocumentTemplate;
  data: ProjectBibleData;
  variables: Record<string, any>;
  components: Map<string, TemplateComponent>;
}

interface SectionRenderResult {
  content: string;
  errors: TemplateError[];
  warnings: TemplateWarning[];
}

interface TemplateValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// Export singleton instance
export const templateEngineService = TemplateEngineService.getInstance();