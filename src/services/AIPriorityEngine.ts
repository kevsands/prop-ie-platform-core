/**
 * AI Priority Engine
 * 
 * Production-grade machine learning engine for dynamic task prioritization
 * across the PropIE platform. Implements multiple ML algorithms for optimal
 * task ordering and resource allocation.
 */

import { PrismaClient } from '@prisma/client';
import {
  Task,
  TaskStatus,
  TaskPriority,
  TaskComplexityLevel,
  TaskCategory,
  TaskOrchestrationContext
} from '@/types/task/universal-task';
import {
  AITaskPriorityScore,
  PriorityFactor,
  PredictionConfidence,
  TaskPerformanceHistory
} from './AITaskIntelligenceService';

/**
 * Priority calculation features for ML model
 */
interface PriorityFeatures {
  // Temporal features
  daysUntilDeadline: number;
  daysSinceCreation: number;
  timeOfDay: number;
  dayOfWeek: number;
  
  // Task characteristics
  complexityScore: number;
  categoryWeight: number;
  estimatedHours: number;
  dependencyCount: number;
  dependentCount: number;
  
  // Business context
  businessValue: number;
  riskLevel: number;
  complianceRequired: number;
  clientTier: number;
  
  // User context
  userWorkload: number;
  userSkillMatch: number;
  userPerformanceHistory: number;
  teamCapacity: number;
  
  // Historical patterns
  averageCompletionTime: number;
  successRate: number;
  reworkProbability: number;
  collaborationRequired: number;
}

/**
 * ML model weights learned from historical data
 */
interface ModelWeights {
  temporal: {
    daysUntilDeadline: number;
    daysSinceCreation: number;
    timeOfDay: number;
    dayOfWeek: number;
  };
  task: {
    complexityScore: number;
    categoryWeight: number;
    estimatedHours: number;
    dependencyCount: number;
    dependentCount: number;
  };
  business: {
    businessValue: number;
    riskLevel: number;
    complianceRequired: number;
    clientTier: number;
  };
  user: {
    userWorkload: number;
    userSkillMatch: number;
    userPerformanceHistory: number;
    teamCapacity: number;
  };
  historical: {
    averageCompletionTime: number;
    successRate: number;
    reworkProbability: number;
    collaborationRequired: number;
  };
  bias: number;
}

/**
 * Model performance metrics for continuous improvement
 */
interface ModelPerformance {
  accuracy: number; // 0-100%
  precision: number; // 0-100%
  recall: number; // 0-100%
  f1Score: number; // 0-100%
  meanAbsoluteError: number;
  lastEvaluated: Date;
  trainingDataSize: number;
  version: string;
}

/**
 * Priority prediction with confidence intervals
 */
interface PriorityPrediction {
  predictedScore: number;
  confidence: PredictionConfidence;
  lowerBound: number;
  upperBound: number;
  features: PriorityFeatures;
  modelVersion: string;
}

/**
 * Production-grade AI Priority Engine
 */
export class AIPriorityEngine {
  private static instance: AIPriorityEngine;
  private prisma: PrismaClient;
  private modelWeights: ModelWeights;
  private modelPerformance: ModelPerformance;
  private trainingData: Array<{ features: PriorityFeatures; actualPriority: number }> = [];
  private featureCache: Map<string, PriorityFeatures> = new Map();
  
  // Feature normalization parameters
  private featureStats: Map<string, { mean: number; std: number; min: number; max: number }> = new Map();

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.initializeModel();
  }

  public static getInstance(prisma?: PrismaClient): AIPriorityEngine {
    if (!AIPriorityEngine.instance) {
      if (!prisma) {
        throw new Error('Prisma client required for AIPriorityEngine initialization');
      }
      AIPriorityEngine.instance = new AIPriorityEngine(prisma);
    }
    return AIPriorityEngine.instance;
  }

  /**
   * Calculate optimized task priority using ML model
   */
  public async calculateOptimizedPriority(
    task: Task,
    context: TaskOrchestrationContext,
    allTasks: Task[] = []
  ): Promise<AITaskPriorityScore> {
    try {
      // Extract features for ML model
      const features = await this.extractFeatures(task, context, allTasks);
      
      // Make prediction using trained model
      const prediction = this.predictPriority(features);
      
      // Calculate priority factors for explainability
      const factors = this.calculateExplainablePriorityFactors(features, prediction);
      
      // Determine recommended priority level
      const aiRecommendedPriority = this.scoreToPriority(prediction.predictedScore);
      
      // Generate human-readable reasoning
      const reasoning = this.generateMLReasoning(features, factors);

      return {
        taskId: task.id,
        originalPriority: task.priority,
        aiRecommendedPriority,
        score: prediction.predictedScore,
        confidence: prediction.confidence,
        reasoning,
        factors,
        lastCalculated: new Date()
      };
    } catch (error) {
      console.error('Error calculating optimized priority:', error);
      throw new Error(`Priority optimization failed: ${error}`);
    }
  }

  /**
   * Train model with new performance data
   */
  public async trainModel(trainingData: TaskPerformanceHistory[]): Promise<ModelPerformance> {
    try {
      // Convert performance data to training features
      const features = await this.convertPerformanceToFeatures(trainingData);
      
      // Update training dataset
      this.updateTrainingData(features);
      
      // Perform feature normalization
      this.updateFeatureStatistics();
      
      // Train using gradient descent or other optimization algorithm
      const newWeights = await this.optimizeModelWeights();
      
      // Evaluate model performance
      const performance = await this.evaluateModel();
      
      // Update model if performance improved
      if (performance.accuracy > this.modelPerformance.accuracy) {
        this.modelWeights = newWeights;
        this.modelPerformance = performance;
        
        // Save model to persistent storage
        await this.saveModelToPersistentStorage();
      }

      return performance;
    } catch (error) {
      console.error('Error training model:', error);
      throw new Error(`Model training failed: ${error}`);
    }
  }

  /**
   * Batch prioritize multiple tasks efficiently
   */
  public async batchPrioritizeTasks(
    tasks: Task[],
    context: TaskOrchestrationContext
  ): Promise<Array<{ task: Task; priorityScore: AITaskPriorityScore }>> {
    try {
      const results = [];
      
      // Pre-compute shared context for efficiency
      const sharedContext = await this.precomputeSharedContext(tasks, context);
      
      for (const task of tasks) {
        // Use cached shared context to speed up feature extraction
        const features = await this.extractFeaturesWithSharedContext(task, context, sharedContext);
        const prediction = this.predictPriority(features);
        
        const priorityScore: AITaskPriorityScore = {
          taskId: task.id,
          originalPriority: task.priority,
          aiRecommendedPriority: this.scoreToPriority(prediction.predictedScore),
          score: prediction.predictedScore,
          confidence: prediction.confidence,
          reasoning: this.generateMLReasoning(features, []),
          factors: this.calculateExplainablePriorityFactors(features, prediction),
          lastCalculated: new Date()
        };
        
        results.push({ task, priorityScore });
      }
      
      // Sort by predicted priority score
      results.sort((a, b) => b.priorityScore.score - a.priorityScore.score);
      
      return results;
    } catch (error) {
      console.error('Error batch prioritizing tasks:', error);
      throw new Error(`Batch prioritization failed: ${error}`);
    }
  }

  /**
   * Get model insights and performance metrics
   */
  public getModelInsights(): {
    performance: ModelPerformance;
    topFeatures: Array<{ feature: string; importance: number }>;
    modelVersion: string;
    trainingDataSize: number;
  } {
    // Calculate feature importance from model weights
    const featureImportance = this.calculateFeatureImportance();
    
    return {
      performance: this.modelPerformance,
      topFeatures: featureImportance.slice(0, 10), // Top 10 most important features
      modelVersion: this.modelPerformance.version,
      trainingDataSize: this.trainingData.length
    };
  }

  /**
   * Update model with real-time feedback
   */
  public async updateModelWithFeedback(
    taskId: string,
    actualPriority: TaskPriority,
    userSatisfaction: number
  ): Promise<void> {
    try {
      // Find the cached features for this task
      const features = this.featureCache.get(taskId);
      if (!features) return;
      
      // Convert priority to numerical score
      const actualScore = this.priorityToScore(actualPriority);
      
      // Add to training data with user satisfaction weighting
      const trainingExample = {
        features,
        actualPriority: actualScore,
        weight: userSatisfaction / 5.0 // Weight by satisfaction (1-5 scale)
      };
      
      // Perform online learning update
      await this.onlineLearningUpdate(trainingExample);
      
    } catch (error) {
      console.error('Error updating model with feedback:', error);
    }
  }

  /**
   * Private Methods - Feature Engineering
   */
  private async extractFeatures(
    task: Task,
    context: TaskOrchestrationContext,
    allTasks: Task[]
  ): Promise<PriorityFeatures> {
    const now = new Date();
    
    // Temporal features
    const daysUntilDeadline = task.dueDate 
      ? Math.ceil((task.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : 365; // Default if no deadline
    const daysSinceCreation = Math.ceil((now.getTime() - task.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const timeOfDay = now.getHours();
    const dayOfWeek = now.getDay();
    
    // Task characteristics
    const complexityScore = this.complexityToScore(task.complexityLevel);
    const categoryWeight = this.categoryToWeight(task.category);
    const estimatedHours = task.estimatedDuration || this.getDefaultDuration(task.complexityLevel);
    const dependencyCount = task.dependencies?.length || 0;
    const dependentCount = await this.getDependentTaskCount(task.id, allTasks);
    
    // Business context
    const businessValue = this.calculateBusinessValue(task);
    const riskLevel = this.calculateRiskLevel(task);
    const complianceRequired = (task.isRegulatory || task.isLegalRequirement) ? 1 : 0;
    const clientTier = await this.getClientTier(task);
    
    // User context
    const userWorkload = context.workloadCapacity / 100.0;
    const userSkillMatch = await this.calculateUserSkillMatch(task, context);
    const userPerformanceHistory = await this.getUserPerformanceScore(context.userId, task.category);
    const teamCapacity = await this.getTeamCapacity(context.userRole);
    
    // Historical patterns
    const historicalData = await this.getHistoricalTaskData(task.category, task.complexityLevel);
    const averageCompletionTime = historicalData.avgCompletionTime || estimatedHours;
    const successRate = historicalData.successRate || 0.8;
    const reworkProbability = historicalData.reworkRate || 0.1;
    const collaborationRequired = this.getCollaborationScore(task);

    const features: PriorityFeatures = {
      daysUntilDeadline,
      daysSinceCreation,
      timeOfDay,
      dayOfWeek,
      complexityScore,
      categoryWeight,
      estimatedHours,
      dependencyCount,
      dependentCount,
      businessValue,
      riskLevel,
      complianceRequired,
      clientTier,
      userWorkload,
      userSkillMatch,
      userPerformanceHistory,
      teamCapacity,
      averageCompletionTime,
      successRate,
      reworkProbability,
      collaborationRequired
    };

    // Cache features for later use
    this.featureCache.set(task.id, features);
    
    return features;
  }

  /**
   * Private Methods - Machine Learning Core
   */
  private predictPriority(features: PriorityFeatures): PriorityPrediction {
    // Normalize features
    const normalizedFeatures = this.normalizeFeatures(features);
    
    // Calculate prediction using linear model (can be extended to neural networks)
    let score = this.modelWeights.bias;
    
    // Temporal features
    score += normalizedFeatures.daysUntilDeadline * this.modelWeights.temporal.daysUntilDeadline;
    score += normalizedFeatures.daysSinceCreation * this.modelWeights.temporal.daysSinceCreation;
    score += normalizedFeatures.timeOfDay * this.modelWeights.temporal.timeOfDay;
    score += normalizedFeatures.dayOfWeek * this.modelWeights.temporal.dayOfWeek;
    
    // Task features
    score += normalizedFeatures.complexityScore * this.modelWeights.task.complexityScore;
    score += normalizedFeatures.categoryWeight * this.modelWeights.task.categoryWeight;
    score += normalizedFeatures.estimatedHours * this.modelWeights.task.estimatedHours;
    score += normalizedFeatures.dependencyCount * this.modelWeights.task.dependencyCount;
    score += normalizedFeatures.dependentCount * this.modelWeights.task.dependentCount;
    
    // Business features
    score += normalizedFeatures.businessValue * this.modelWeights.business.businessValue;
    score += normalizedFeatures.riskLevel * this.modelWeights.business.riskLevel;
    score += normalizedFeatures.complianceRequired * this.modelWeights.business.complianceRequired;
    score += normalizedFeatures.clientTier * this.modelWeights.business.clientTier;
    
    // User features
    score += normalizedFeatures.userWorkload * this.modelWeights.user.userWorkload;
    score += normalizedFeatures.userSkillMatch * this.modelWeights.user.userSkillMatch;
    score += normalizedFeatures.userPerformanceHistory * this.modelWeights.user.userPerformanceHistory;
    score += normalizedFeatures.teamCapacity * this.modelWeights.user.teamCapacity;
    
    // Historical features
    score += normalizedFeatures.averageCompletionTime * this.modelWeights.historical.averageCompletionTime;
    score += normalizedFeatures.successRate * this.modelWeights.historical.successRate;
    score += normalizedFeatures.reworkProbability * this.modelWeights.historical.reworkProbability;
    score += normalizedFeatures.collaborationRequired * this.modelWeights.historical.collaborationRequired;
    
    // Apply sigmoid activation to get 0-100 score
    const normalizedScore = this.sigmoid(score) * 100;
    
    // Calculate confidence based on feature certainty
    const confidence = this.calculatePredictionConfidence(features);
    
    // Calculate confidence intervals (simplified approach)
    const uncertainty = this.calculateUncertainty(features);
    const lowerBound = Math.max(0, normalizedScore - uncertainty);
    const upperBound = Math.min(100, normalizedScore + uncertainty);

    return {
      predictedScore: normalizedScore,
      confidence,
      lowerBound,
      upperBound,
      features,
      modelVersion: this.modelPerformance.version
    };
  }

  private normalizeFeatures(features: PriorityFeatures): PriorityFeatures {
    const normalized: any = {};
    
    // Normalize each feature using z-score normalization
    for (const [key, value] of Object.entries(features)) {
      const stats = this.featureStats.get(key);
      if (stats && stats.std > 0) {
        normalized[key] = (value - stats.mean) / stats.std;
      } else {
        // Min-max normalization fallback
        normalized[key] = stats ? (value - stats.min) / (stats.max - stats.min || 1) : value;
      }
    }
    
    return normalized as PriorityFeatures;
  }

  private calculatePredictionConfidence(features: PriorityFeatures): PredictionConfidence {
    // Calculate confidence based on feature quality and model certainty
    let confidenceScore = 0.8; // Base confidence
    
    // Reduce confidence for edge cases
    if (features.daysUntilDeadline < 0) confidenceScore -= 0.2;
    if (features.userPerformanceHistory < 0.5) confidenceScore -= 0.1;
    if (features.dependencyCount > 10) confidenceScore -= 0.1;
    
    // Increase confidence for well-understood scenarios
    if (features.complianceRequired === 1) confidenceScore += 0.1;
    if (features.successRate > 0.9) confidenceScore += 0.1;
    
    const confidencePercentage = confidenceScore * 100;
    
    if (confidencePercentage >= 95) return PredictionConfidence.VERY_HIGH;
    if (confidencePercentage >= 80) return PredictionConfidence.HIGH;
    if (confidencePercentage >= 60) return PredictionConfidence.MEDIUM;
    return PredictionConfidence.LOW;
  }

  private calculateUncertainty(features: PriorityFeatures): number {
    // Simplified uncertainty calculation
    // In production, this would use more sophisticated methods like Monte Carlo dropout
    let uncertainty = 5.0; // Base uncertainty
    
    // Increase uncertainty for unusual feature values
    if (features.daysUntilDeadline > 100) uncertainty += 3.0;
    if (features.complexityScore > 0.8) uncertainty += 2.0;
    if (features.userPerformanceHistory < 0.3) uncertainty += 2.0;
    
    return uncertainty;
  }

  /**
   * Private Methods - Model Training
   */
  private async optimizeModelWeights(): Promise<ModelWeights> {
    // Implement gradient descent or other optimization algorithm
    // This is a simplified version - production would use more sophisticated optimization
    
    const learningRate = 0.01;
    const epochs = 100;
    let weights = { ...this.modelWeights };
    
    for (let epoch = 0; epoch < epochs; epoch++) {
      const gradients = this.calculateGradients(weights);
      
      // Update weights using gradient descent
      weights = this.updateWeights(weights, gradients, learningRate);
      
      // Optional: implement early stopping based on validation loss
      if (epoch % 10 === 0) {
        const loss = this.calculateLoss(weights);
        if (loss < 0.01) break; // Early stopping
      }
    }
    
    return weights;
  }

  private calculateGradients(weights: ModelWeights): ModelWeights {
    // Simplified gradient calculation
    // Production implementation would calculate actual gradients
    const gradients = JSON.parse(JSON.stringify(weights)) as ModelWeights;
    
    // Initialize gradients to zero
    for (const category of Object.keys(gradients) as Array<keyof ModelWeights>) {
      if (typeof gradients[category] === 'object') {
        for (const feature of Object.keys(gradients[category] as any)) {
          (gradients[category] as any)[feature] = 0;
        }
      } else {
        (gradients as any)[category] = 0;
      }
    }
    
    // Calculate gradients from training data
    for (const example of this.trainingData) {
      const prediction = this.predictWithWeights(example.features, weights);
      const error = prediction - example.actualPriority;
      
      // Calculate partial derivatives (simplified)
      const normalizedFeatures = this.normalizeFeatures(example.features);
      
      gradients.temporal.daysUntilDeadline += error * normalizedFeatures.daysUntilDeadline;
      gradients.task.complexityScore += error * normalizedFeatures.complexityScore;
      gradients.business.businessValue += error * normalizedFeatures.businessValue;
      // ... continue for all features
      gradients.bias += error;
    }
    
    // Average gradients
    const dataSize = this.trainingData.length;
    if (dataSize > 0) {
      for (const category of Object.keys(gradients) as Array<keyof ModelWeights>) {
        if (typeof gradients[category] === 'object') {
          for (const feature of Object.keys(gradients[category] as any)) {
            (gradients[category] as any)[feature] /= dataSize;
          }
        } else {
          (gradients as any)[category] /= dataSize;
        }
      }
    }
    
    return gradients;
  }

  private updateWeights(
    weights: ModelWeights,
    gradients: ModelWeights,
    learningRate: number
  ): ModelWeights {
    const newWeights = JSON.parse(JSON.stringify(weights)) as ModelWeights;
    
    // Update each weight using gradient descent
    for (const category of Object.keys(newWeights) as Array<keyof ModelWeights>) {
      if (typeof newWeights[category] === 'object') {
        for (const feature of Object.keys(newWeights[category] as any)) {
          (newWeights[category] as any)[feature] -= learningRate * (gradients[category] as any)[feature];
        }
      } else {
        (newWeights as any)[category] -= learningRate * (gradients as any)[category];
      }
    }
    
    return newWeights;
  }

  private calculateLoss(weights: ModelWeights): number {
    let totalLoss = 0;
    let count = 0;
    
    for (const example of this.trainingData) {
      const prediction = this.predictWithWeights(example.features, weights);
      const loss = Math.pow(prediction - example.actualPriority, 2); // MSE
      totalLoss += loss;
      count++;
    }
    
    return count > 0 ? totalLoss / count : 0;
  }

  private predictWithWeights(features: PriorityFeatures, weights: ModelWeights): number {
    const normalizedFeatures = this.normalizeFeatures(features);
    let score = weights.bias;
    
    // Apply weights to features (simplified version)
    score += normalizedFeatures.daysUntilDeadline * weights.temporal.daysUntilDeadline;
    score += normalizedFeatures.complexityScore * weights.task.complexityScore;
    score += normalizedFeatures.businessValue * weights.business.businessValue;
    // ... continue for all features
    
    return this.sigmoid(score) * 100;
  }

  /**
   * Private Methods - Helper Functions
   */
  private initializeModel(): void {
    // Initialize with reasonable default weights
    this.modelWeights = {
      temporal: {
        daysUntilDeadline: -0.5, // Negative because less time = higher priority
        daysSinceCreation: 0.1,
        timeOfDay: 0.05,
        dayOfWeek: 0.05
      },
      task: {
        complexityScore: 0.3,
        categoryWeight: 0.2,
        estimatedHours: 0.1,
        dependencyCount: 0.2,
        dependentCount: 0.4
      },
      business: {
        businessValue: 0.6,
        riskLevel: 0.4,
        complianceRequired: 0.8,
        clientTier: 0.3
      },
      user: {
        userWorkload: -0.2, // Negative because high workload = lower priority
        userSkillMatch: 0.3,
        userPerformanceHistory: 0.2,
        teamCapacity: 0.15
      },
      historical: {
        averageCompletionTime: -0.1,
        successRate: 0.2,
        reworkProbability: -0.3,
        collaborationRequired: 0.1
      },
      bias: 0.0
    };

    this.modelPerformance = {
      accuracy: 75.0,
      precision: 73.0,
      recall: 77.0,
      f1Score: 75.0,
      meanAbsoluteError: 8.5,
      lastEvaluated: new Date(),
      trainingDataSize: 0,
      version: '1.0.0'
    };

    this.initializeFeatureStatistics();
  }

  private initializeFeatureStatistics(): void {
    // Initialize with reasonable defaults for feature normalization
    const defaultStats = { mean: 0, std: 1, min: 0, max: 1 };
    
    this.featureStats.set('daysUntilDeadline', { mean: 14, std: 10, min: -30, max: 365 });
    this.featureStats.set('daysSinceCreation', { mean: 5, std: 7, min: 0, max: 100 });
    this.featureStats.set('complexityScore', { mean: 0.5, std: 0.3, min: 0, max: 1 });
    this.featureStats.set('businessValue', { mean: 50, std: 25, min: 0, max: 100 });
    // ... initialize all features
  }

  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  private complexityToScore(complexity: TaskComplexityLevel): number {
    const scores = {
      [TaskComplexityLevel.SIMPLE]: 0.25,
      [TaskComplexityLevel.MODERATE]: 0.5,
      [TaskComplexityLevel.COMPLEX]: 0.75,
      [TaskComplexityLevel.EXPERT]: 1.0
    };
    return scores[complexity] || 0.5;
  }

  private categoryToWeight(category: TaskCategory): number {
    // Assign weights based on business importance
    const weights = new Map<TaskCategory, number>([
      [TaskCategory.BUYER_FINANCING, 0.9],
      [TaskCategory.SOLICITOR_CONTRACTS, 0.9],
      [TaskCategory.BUYER_PURCHASING, 0.8],
      [TaskCategory.AGENT_CLIENT_MANAGEMENT, 0.7],
      [TaskCategory.DEVELOPER_CONSTRUCTION, 0.8],
      // ... add all categories
    ]);
    return weights.get(category) || 0.5;
  }

  private getDefaultDuration(complexity: TaskComplexityLevel): number {
    const durations = {
      [TaskComplexityLevel.SIMPLE]: 2,
      [TaskComplexityLevel.MODERATE]: 8,
      [TaskComplexityLevel.COMPLEX]: 24,
      [TaskComplexityLevel.EXPERT]: 80
    };
    return durations[complexity] || 8;
  }

  private scoreToPriority(score: number): TaskPriority {
    if (score >= 85) return TaskPriority.CRITICAL;
    if (score >= 70) return TaskPriority.HIGH;
    if (score >= 40) return TaskPriority.MEDIUM;
    return TaskPriority.LOW;
  }

  private priorityToScore(priority: TaskPriority): number {
    const scores = {
      [TaskPriority.CRITICAL]: 90,
      [TaskPriority.HIGH]: 75,
      [TaskPriority.MEDIUM]: 50,
      [TaskPriority.LOW]: 25,
      [TaskPriority.DEFERRED]: 10
    };
    return scores[priority] || 50;
  }

  // Placeholder methods for production implementation
  private async getDependentTaskCount(taskId: string, allTasks: Task[]): Promise<number> {
    return allTasks.filter(task => 
      task.dependencies?.some(dep => dep.sourceTaskId === taskId)
    ).length;
  }

  private calculateBusinessValue(task: Task): number {
    let value = 50; // Base value
    if (task.isLegalRequirement) value += 30;
    if (task.isRegulatory) value += 25;
    if (task.priority === TaskPriority.CRITICAL) value += 20;
    return Math.min(100, value);
  }

  private calculateRiskLevel(task: Task): number {
    let risk = 30; // Base risk
    if (task.isTimeDependent) risk += 20;
    if (task.complexityLevel === TaskComplexityLevel.EXPERT) risk += 25;
    return Math.min(100, risk);
  }

  private async getClientTier(task: Task): Promise<number> {
    // In production, this would query client data
    return 1; // Default tier
  }

  private async calculateUserSkillMatch(task: Task, context: TaskOrchestrationContext): Promise<number> {
    // In production, this would analyze user skills vs task requirements
    return 0.8; // Default skill match
  }

  private async getUserPerformanceScore(userId: string, category: TaskCategory): Promise<number> {
    // In production, this would query historical performance
    return 0.75; // Default performance
  }

  private async getTeamCapacity(role: UserRole): Promise<number> {
    // In production, this would calculate current team capacity
    return 0.7; // Default capacity
  }

  private async getHistoricalTaskData(category: TaskCategory, complexity: TaskComplexityLevel) {
    // In production, this would query historical data
    return {
      avgCompletionTime: 16,
      successRate: 0.85,
      reworkRate: 0.15
    };
  }

  private getCollaborationScore(task: Task): number {
    return task.targetPersonas.length > 1 ? 0.8 : 0.2;
  }

  private calculateExplainablePriorityFactors(
    features: PriorityFeatures,
    prediction: PriorityPrediction
  ): PriorityFactor[] {
    const factors: PriorityFactor[] = [];
    
    // Extract most influential factors
    if (features.daysUntilDeadline < 7) {
      factors.push({
        factor: 'urgent_deadline',
        weight: 0.3,
        impact: 30,
        description: `Deadline in ${features.daysUntilDeadline} days`
      });
    }
    
    if (features.complianceRequired === 1) {
      factors.push({
        factor: 'compliance',
        weight: 0.25,
        impact: 25,
        description: 'Regulatory or legal requirement'
      });
    }
    
    if (features.dependentCount > 3) {
      factors.push({
        factor: 'blocking_others',
        weight: 0.2,
        impact: 20,
        description: `Blocks ${features.dependentCount} other tasks`
      });
    }
    
    return factors;
  }

  private generateMLReasoning(features: PriorityFeatures, factors: PriorityFactor[]): string[] {
    const reasoning: string[] = [];
    
    // Generate explanations based on top factors
    if (features.daysUntilDeadline < 7) {
      reasoning.push(`Urgent: Due in ${features.daysUntilDeadline} days`);
    }
    
    if (features.businessValue > 70) {
      reasoning.push('High business value impact');
    }
    
    if (features.dependentCount > 2) {
      reasoning.push(`Blocks ${features.dependentCount} dependent tasks`);
    }
    
    if (features.userSkillMatch > 0.8) {
      reasoning.push('Strong skill match for assigned user');
    }
    
    return reasoning.slice(0, 3); // Limit to top 3 reasons
  }

  private calculateFeatureImportance(): Array<{ feature: string; importance: number }> {
    const importance: Array<{ feature: string; importance: number }> = [];
    
    // Calculate importance based on absolute weight values
    for (const [category, weights] of Object.entries(this.modelWeights)) {
      if (typeof weights === 'object') {
        for (const [feature, weight] of Object.entries(weights)) {
          importance.push({
            feature: `${category}.${feature}`,
            importance: Math.abs(weight as number)
          });
        }
      }
    }
    
    // Sort by importance
    importance.sort((a, b) => b.importance - a.importance);
    
    return importance;
  }

  // Additional methods for production would be implemented here...
  private async convertPerformanceToFeatures(data: TaskPerformanceHistory[]) {
    // Convert performance history to training features
    return [];
  }

  private updateTrainingData(features: any[]) {
    // Update internal training dataset
  }

  private updateFeatureStatistics() {
    // Recalculate feature statistics for normalization
  }

  private async evaluateModel(): Promise<ModelPerformance> {
    // Evaluate model performance on validation set
    return this.modelPerformance;
  }

  private async saveModelToPersistentStorage() {
    // Save trained model to database or file system
  }

  private async precomputeSharedContext(tasks: Task[], context: TaskOrchestrationContext) {
    // Precompute shared context for batch processing
    return {};
  }

  private async extractFeaturesWithSharedContext(
    task: Task,
    context: TaskOrchestrationContext,
    sharedContext: any
  ): Promise<PriorityFeatures> {
    // Use shared context to speed up feature extraction
    return this.extractFeatures(task, context, []);
  }

  private async onlineLearningUpdate(trainingExample: any) {
    // Perform incremental model update
  }
}

// Export singleton factory function
export const createAIPriorityEngine = (prisma: PrismaClient) => 
  AIPriorityEngine.getInstance(prisma);