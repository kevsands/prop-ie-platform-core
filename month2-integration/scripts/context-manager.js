const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class ContextManager {
    constructor() {
        this.projectRoot = path.resolve(__dirname, '..');
        this.contextPath = path.join(this.projectRoot, '.ai-context.json');
        this.loadContext();
    }

    loadContext() {
        try {
            this.context = JSON.parse(fs.readFileSync(this.contextPath, 'utf8'));
        } catch (error) {
            this.context = {
                lastUpdated: new Date().toISOString(),
                conversationHistory: [],
                currentFocus: {
                    phase: 'Phase 1',
                    component: null,
                    task: null
                },
                technicalDebt: [],
                decisions: [],
                dependencies: {}
            };
            this.saveContext();
        }
    }

    saveContext() {
        fs.writeFileSync(this.contextPath, JSON.stringify(this.context, null, 2));
    }

    addToHistory(message, response) {
        const entry = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            message,
            response,
            context: {
                phase: this.context.currentFocus.phase,
                component: this.context.currentFocus.component,
                task: this.context.currentFocus.task
            }
        };
        this.context.conversationHistory.push(entry);
        this.saveContext();
    }

    updateFocus(phase, component, task) {
        this.context.currentFocus = { phase, component, task };
        this.saveContext();
    }

    addTechnicalDebt(description, priority, component) {
        const debt = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            description,
            priority,
            component,
            status: 'open'
        };
        this.context.technicalDebt.push(debt);
        this.saveContext();
    }

    addDecision(decision, rationale, impact) {
        const entry = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            decision,
            rationale,
            impact
        };
        this.context.decisions.push(entry);
        this.saveContext();
    }

    addDependency(component, dependencies) {
        this.context.dependencies[component] = dependencies;
        this.saveContext();
    }

    getRelevantContext(message) {
        // Simple keyword-based context retrieval
        const keywords = this.extractKeywords(message);
        const relevantHistory = this.context.conversationHistory.filter(entry => 
            keywords.some(keyword => 
                entry.message.toLowerCase().includes(keyword) || 
                entry.response.toLowerCase().includes(keyword)
            )
        );

        return {
            currentFocus: this.context.currentFocus,
            relevantHistory: relevantHistory.slice(-5), // Last 5 relevant entries
            technicalDebt: this.context.technicalDebt.filter(debt => 
                keywords.some(keyword => 
                    debt.description.toLowerCase().includes(keyword) ||
                    debt.component.toLowerCase().includes(keyword)
                )
            ),
            decisions: this.context.decisions.filter(decision => 
                keywords.some(keyword => 
                    decision.decision.toLowerCase().includes(keyword) ||
                    decision.impact.toLowerCase().includes(keyword)
                )
            )
        };
    }

    extractKeywords(message) {
        // Simple keyword extraction
        const words = message.toLowerCase().split(/\s+/);
        return words.filter(word => word.length > 3); // Filter out short words
    }

    generateContextSummary() {
        return {
            timestamp: new Date().toISOString(),
            currentFocus: this.context.currentFocus,
            recentHistory: this.context.conversationHistory.slice(-5),
            openTechnicalDebt: this.context.technicalDebt.filter(debt => debt.status === 'open'),
            recentDecisions: this.context.decisions.slice(-5),
            dependencies: this.context.dependencies
        };
    }
}

// CLI interface
if (require.main === module) {
    const manager = new ContextManager();
    const command = process.argv[2];
    const args = process.argv.slice(3);

    switch (command) {
        case 'add-history':
            manager.addToHistory(args[0], args[1]);
            break;
        case 'update-focus':
            manager.updateFocus(args[0], args[1], args[2]);
            break;
        case 'add-debt':
            manager.addTechnicalDebt(args[0], args[1], args[2]);
            break;
        case 'add-decision':
            manager.addDecision(args[0], args[1], args[2]);
            break;
        case 'add-dependency':
            manager.addDependency(args[0], JSON.parse(args[1]));
            break;
        case 'get-context':
            console.log(JSON.stringify(manager.getRelevantContext(args[0]), null, 2));
            break;
        case 'generate-summary':
            console.log(JSON.stringify(manager.generateContextSummary(), null, 2));
            break;
        default:
            console.log('Unknown command');
    }
}

module.exports = ContextManager; 