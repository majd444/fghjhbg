/**
 * Mock database implementation for workflows
 * This simulates a database that would store workflow information
 */

// Types for workflow entities
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  components: any[];
  connections: any;
  conversationTexts?: any[];
  selectedToolIds?: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  // Chatbot configuration
  chatbotName?: string;
  systemPrompt?: string;
  // Style configuration
  topColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  // Fine tuning
  temperature?: number;
  model?: string;
  maxTokens?: number;
  extraConfig?: any;
  // Track deletion status
  deleted?: boolean;
}

// Mock database for workflows
const workflowsDb: Workflow[] = [
  {
    id: '1',
    name: 'Sample Workflow',
    description: 'A sample workflow for demonstration',
    components: [],
    connections: {},
    userId: 'default-user',
    createdAt: new Date(),
    updatedAt: new Date(),
    chatbotName: 'AI Assistant',
    systemPrompt: 'You are a helpful AI assistant',
    topColor: '#1f2937',
    accentColor: '#3B82F6',
    backgroundColor: '#F3F4F6',
    temperature: 0.7,
    model: 'gpt-4',
    maxTokens: 2000,
    extraConfig: {}
  }
];

// Query function
export async function queryWorkflows<T>(filter: Record<string, any> = {}): Promise<T[]> {
  return workflowsDb.filter(workflow => {
    // Apply filters
    for (const [key, value] of Object.entries(filter)) {
      if (workflow[key as keyof Workflow] !== value) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()) as unknown as T[];
}

// Create function
export async function createWorkflow<T>(data: Partial<Workflow>): Promise<T> {
  const newWorkflow: Workflow = {
    id: String(workflowsDb.length + 1),
    name: data.name || 'Untitled Workflow',
    description: data.description || '',
    components: data.components || [],
    connections: data.connections || {},
    conversationTexts: data.conversationTexts,
    selectedToolIds: data.selectedToolIds,
    userId: data.userId || 'default-user',
    createdAt: new Date(),
    updatedAt: new Date(),
    chatbotName: data.chatbotName || 'AI Assistant',
    systemPrompt: data.systemPrompt || 'You are a helpful AI assistant',
    topColor: data.topColor || '#1f2937',
    accentColor: data.accentColor || '#3B82F6',
    backgroundColor: data.backgroundColor || '#F3F4F6',
    temperature: data.temperature || 0.7,
    model: data.model || 'gpt-4',
    maxTokens: data.maxTokens || 2000,
    extraConfig: data.extraConfig || {}
  };
  
  workflowsDb.push(newWorkflow);
  return newWorkflow as unknown as T;
}

// Update function
export async function updateWorkflow<T>(id: string, data: Partial<Workflow>): Promise<T | null> {
  const index = workflowsDb.findIndex(workflow => workflow.id === id);
  if (index === -1) {
    return null;
  }
  
  workflowsDb[index] = {
    ...workflowsDb[index],
    ...data,
    updatedAt: new Date()
  };
  
  return workflowsDb[index] as unknown as T;
}

// Delete function
export async function deleteWorkflow(id: string): Promise<boolean> {
  const index = workflowsDb.findIndex(workflow => workflow.id === id);
  if (index === -1) {
    return false;
  }
  
  workflowsDb.splice(index, 1);
  return true;
}
