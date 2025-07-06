declare module 'aws-amplify/api' {
    export { API } from 'aws-amplify';
  }
  
  declare module 'aws-amplify' {
    export const API: {
      graphql(options: any): Promise<GraphQLResult<any> | GraphqlSubscriptionResult<any>>;
    };
    
    export interface GraphQLResult<T> {
      data?: T;
      errors?: any[];
    }
    
    export interface GraphqlSubscriptionResult<T> {
      data?: T;
      errors?: any[];
    }
  }