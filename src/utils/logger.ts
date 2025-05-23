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

    }
  }

  public info(message: string, data?: any): void {

  }

  public warn(message: string, data?: any): void {

  }

  public error(message: string, data?: any): void {

  }
}

// Export a default instance for backwards compatibility
export default new Logger('Default');