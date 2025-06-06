// Global type declarations for the application

// Extend the Window interface
interface Window {
  __WORKFLOW_STATE?: any;
  __WORKFLOW_COMPONENTS?: any;
  _WORKFLOW_BACKUP?: {
    components: string[];
    connections: any[];
    timestamp: string;
  };
}

export {};
