/**
 * Metrics collection utility
 * In a production environment, this would send metrics to a monitoring service
 */
export class MetricsCollector {
  private metrics: Record<string, any[]> = {
    queries: [],
    mutations: [],
    pageLoads: [],
    interactions: []
  };

  /**
   * Record metrics for GraphQL queries
   */
  public recordQueryMetrics(data: {
    operation: string;
    duration: number;
    success: boolean;
    cacheHit?: boolean;
    error?: Error;
  }): void {
    this.metrics.queries.push({
      ...data,
      timestamp: new Date().toISOString()
    });

    // In development, just log to console
    if (process.env.NODE_ENV === 'development') {
      console.debug('Query metrics:', data);
    }

    // In production, would send to metrics service
    // Example: send to API endpoint or analytics service
  }

  /**
   * Record metrics for GraphQL mutations
   */
  public recordMutationMetrics(data: {
    operation: string;
    duration: number;
    success: boolean;
    error?: Error;
  }): void {
    this.metrics.mutations.push({
      ...data,
      timestamp: new Date().toISOString()
    });

    // In development, just log to console
    if (process.env.NODE_ENV === 'development') {
      console.debug('Mutation metrics:', data);
    }

    // In production, would send to metrics service
  }

  /**
   * Record page load metrics
   */
  public recordPageLoad(data: {
    path: string;
    duration: number;
    components: string[];
  }): void {
    this.metrics.pageLoads.push({
      ...data,
      timestamp: new Date().toISOString()
    });

    // In production, would send to metrics service
  }

  /**
   * Record user interaction metrics
   */
  public recordInteraction(data: {
    type: string;
    component: string;
    duration?: number;
  }): void {
    this.metrics.interactions.push({
      ...data,
      timestamp: new Date().toISOString()
    });

    // In production, would send to metrics service
  }

  /**
   * Get collected metrics (for debugging)
   */
  public getMetrics(): Record<string, any[]> {
    return this.metrics;
  }
}

// Export a default instance for backwards compatibility
export default new MetricsCollector();