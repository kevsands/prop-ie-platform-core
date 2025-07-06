const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DocumentationManager {
    constructor() {
        this.projectRoot = path.resolve(__dirname, '..');
        this.docsPath = path.join(this.projectRoot, 'docs');
        this.loadConfigurations();
    }

    loadConfigurations() {
        try {
            this.config = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'docs-config.json'), 'utf8'));
        } catch (error) {
            this.config = {
                sections: [
                    'architecture',
                    'api',
                    'components',
                    'deployment',
                    'development',
                    'testing',
                    'security'
                ],
                templates: {
                    component: this.getComponentTemplate(),
                    api: this.getApiTemplate(),
                    architecture: this.getArchitectureTemplate()
                }
            };
            this.saveConfigurations();
        }
    }

    saveConfigurations() {
        fs.writeFileSync(
            path.join(this.projectRoot, 'docs-config.json'),
            JSON.stringify(this.config, null, 2)
        );
    }

    getComponentTemplate() {
        return `# Component Name

## Overview
Brief description of the component's purpose and functionality.

## Props
| Name | Type | Required | Description |
|------|------|----------|-------------|
| prop1 | type | Yes/No | Description |

## Usage
\`\`\`tsx
import { ComponentName } from './ComponentName';

<ComponentName prop1="value" />
\`\`\`

## Examples
Description of example usage.

## Dependencies
- Dependency 1
- Dependency 2

## Notes
Additional information and considerations.`;
    }

    getApiTemplate() {
        return `# API Endpoint

## Overview
Description of the API endpoint's purpose.

## Endpoint
\`\`\`
METHOD /path
\`\`\`

## Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| param1 | type | Yes/No | Description |

## Request Body
\`\`\`json
{
  "field1": "type",
  "field2": "type"
}
\`\`\`

## Response
\`\`\`json
{
  "field1": "type",
  "field2": "type"
}
\`\`\`

## Error Codes
| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## Examples
Example requests and responses.`;
    }

    getArchitectureTemplate() {
        return `# Architecture Component

## Overview
Description of the architectural component.

## Diagram
[Insert architecture diagram]

## Components
- Component 1
- Component 2

## Data Flow
Description of data flow between components.

## Dependencies
- Dependency 1
- Dependency 2

## Configuration
Configuration options and settings.

## Security
Security considerations and measures.

## Performance
Performance characteristics and optimizations.`;
    }

    createDocumentation(section, name, content) {
        const sectionPath = path.join(this.docsPath, section);
        if (!fs.existsSync(sectionPath)) {
            fs.mkdirSync(sectionPath, { recursive: true });
        }

        const filePath = path.join(sectionPath, `${name}.md`);
        fs.writeFileSync(filePath, content);
    }

    updateDocumentation(section, name, content) {
        const filePath = path.join(this.docsPath, section, `${name}.md`);
        if (fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, content);
        } else {
            this.createDocumentation(section, name, content);
        }
    }

    generateComponentDocs(componentPath) {
        try {
            const content = fs.readFileSync(componentPath, 'utf8');
            const componentName = path.basename(componentPath, '.tsx');
            const docs = this.parseComponent(content);
            this.createDocumentation('components', componentName, docs);
        } catch (error) {
            console.error('Error generating component docs:', error);
        }
    }

    parseComponent(content) {
        // Implementation to parse component and generate documentation
        return this.getComponentTemplate(); // Placeholder
    }

    generateApiDocs(apiPath) {
        try {
            const content = fs.readFileSync(apiPath, 'utf8');
            const apiName = path.basename(apiPath, '.ts');
            const docs = this.parseApi(content);
            this.createDocumentation('api', apiName, docs);
        } catch (error) {
            console.error('Error generating API docs:', error);
        }
    }

    parseApi(content) {
        // Implementation to parse API and generate documentation
        return this.getApiTemplate(); // Placeholder
    }

    generateArchitectureDocs(architecturePath) {
        try {
            const content = fs.readFileSync(architecturePath, 'utf8');
            const architectureName = path.basename(architecturePath, '.md');
            const docs = this.parseArchitecture(content);
            this.createDocumentation('architecture', architectureName, docs);
        } catch (error) {
            console.error('Error generating architecture docs:', error);
        }
    }

    parseArchitecture(content) {
        // Implementation to parse architecture and generate documentation
        return this.getArchitectureTemplate(); // Placeholder
    }

    generateDocumentationReport() {
        const report = {
            timestamp: new Date().toISOString(),
            sections: this.config.sections,
            stats: this.getDocumentationStats(),
            missingDocs: this.findMissingDocumentation()
        };

        const reportPath = path.join(this.projectRoot, 'reports', `documentation-report-${new Date().toISOString().split('T')[0]}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        return report;
    }

    getDocumentationStats() {
        const stats = {};
        this.config.sections.forEach(section => {
            const sectionPath = path.join(this.docsPath, section);
            if (fs.existsSync(sectionPath)) {
                stats[section] = fs.readdirSync(sectionPath).length;
            } else {
                stats[section] = 0;
            }
        });
        return stats;
    }

    findMissingDocumentation() {
        const missing = {};
        this.config.sections.forEach(section => {
            const sectionPath = path.join(this.docsPath, section);
            if (!fs.existsSync(sectionPath)) {
                missing[section] = 'Section directory missing';
            }
        });
        return missing;
    }
}

// CLI interface
if (require.main === module) {
    const manager = new DocumentationManager();
    const command = process.argv[2];
    const args = process.argv.slice(3);

    switch (command) {
        case 'create-doc':
            manager.createDocumentation(args[0], args[1], args[2]);
            break;
        case 'update-doc':
            manager.updateDocumentation(args[0], args[1], args[2]);
            break;
        case 'generate-component-docs':
            manager.generateComponentDocs(args[0]);
            break;
        case 'generate-api-docs':
            manager.generateApiDocs(args[0]);
            break;
        case 'generate-architecture-docs':
            manager.generateArchitectureDocs(args[0]);
            break;
        case 'generate-report':
            console.log(JSON.stringify(manager.generateDocumentationReport(), null, 2));
            break;
        default:
            console.log('Unknown command');
    }
}

module.exports = DocumentationManager; 