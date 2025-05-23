/**
 * Simple logger utility
 */
export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  public debug(message: string, data?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${this.context}] ${message}`, data ? data : '');
    }
  }

  public info(message: string, data?: any): void {
    console.info(`[${this.context}] ${message}`, data ? data : '');
  }

  public warn(message: string, data?: any): void {
    console.warn(`[${this.context}] ${message}`, data ? data : '');
  }

  public error(message: string, data?: any): void {
    console.error(`[${this.context}] ${message}`, data ? data : '');
  }
}

// Export a default instance for backwards compatibility
export default new Logger('Default');