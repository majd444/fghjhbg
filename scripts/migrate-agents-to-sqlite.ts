/**
 * Migration script to transfer agents from the mock in-memory database to SQLite
 */
import { query } from '../lib/sevalla-db';
import { agentDb, Agent } from '../lib/database/agent-db';

async function migrateAgents() {
  console.log('Starting agent migration to SQLite database...');
  
  try {
    // Get all agents from the mock database
    const mockAgents = await query<Agent>('agents', {});
    console.log(`Found ${mockAgents.length} agents in mock database`);
    
    // Migrate each agent to the SQLite database
    for (const mockAgent of mockAgents) {
      console.log(`Migrating agent: ${mockAgent.name} (ID: ${mockAgent.id})`);
      
      try {
        // Create the agent in SQLite
        const newAgent = await agentDb.create({
          name: mockAgent.name,
          description: mockAgent.description,
          userId: mockAgent.userId,
          status: mockAgent.status as 'online' | 'offline' | 'busy',
          is_active: Boolean(mockAgent.is_active),
          chatbot_name: mockAgent.chatbot_name,
          system_prompt: mockAgent.system_prompt,
          top_color: mockAgent.top_color,
          accent_color: mockAgent.accent_color,
          background_color: mockAgent.background_color,
          avatar_url: mockAgent.avatar_url,
          workflow_id: mockAgent.workflow_id
        });
        
        console.log(`Successfully migrated agent: ${newAgent.name} (New ID: ${newAgent.id})`);
      } catch (error) {
        console.error(`Failed to migrate agent ${mockAgent.name}:`, error);
      }
    }
    
    console.log('Agent migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateAgents();
