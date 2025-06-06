import { NextRequest, NextResponse } from "next/server"
import { queryWorkflows, createWorkflow, updateWorkflow } from "@/lib/sevalla-db-workflow"

// GET /api/workflows - List all workflows
export async function GET(req: NextRequest) {
  try {
    // Get user ID from query parameter or session (this should be properly authenticated)
    const url = new URL(req.url)
    const userId = url.searchParams.get("userId") || "default-user"
    
    // Query workflows from our mock database
    const workflows = await queryWorkflows({ userId });
    
    return NextResponse.json({ workflows })
  } catch (error) {
    console.error("Error fetching workflows:", error)
    return NextResponse.json({ error: "Failed to fetch workflows" }, { status: 500 })
  }
}

// POST /api/workflows - Create a new workflow
export async function POST(req: NextRequest) {
  try {
    const { 
      name, 
      description, 
      components, 
      connections, 
      conversationTexts, 
      selectedToolIds, 
      userId = "default-user", 
      // Chatbot configuration
      chatbotName = "AI Assistant",
      systemPrompt = "You are a helpful AI assistant.",
      // Style configuration
      topColor = "#1f2937",
      accentColor = "#3B82F6",
      backgroundColor = "#F3F4F6",
      // Fine tuning configuration
      temperature = 0.7,
      model = "gpt-4",
      maxTokens = 2000,
      extraConfig = {}
    } = await req.json()
    
    // Validate required fields
    if (!name || !components || !connections) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    // Create workflow in our mock database
    const workflow = await createWorkflow<{
      id: string;
      name: string;
      description?: string;
    }>({
      name,
      description,
      components,
      connections,
      conversationTexts,
      selectedToolIds,
      userId,
      chatbotName,
      systemPrompt,
      topColor,
      accentColor,
      backgroundColor,
      temperature,
      model,
      maxTokens,
      extraConfig
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Workflow created successfully", 
      workflowId: workflow.id
    })
  } catch (error) {
    console.error("Error creating workflow:", error)
    return NextResponse.json({ error: "Failed to create workflow" }, { status: 500 })
  }
}

// PUT /api/workflows/:id - Update an existing workflow
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const workflowId = params.id
    const { name, description, components, connections, conversationTexts, selectedToolIds, userId = "default-user" } = await req.json()
    
    // Validate required fields
    if (!name || !components || !connections) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    // Update workflow in our mock database
    const updatedWorkflow = await updateWorkflow(workflowId, {
      name,
      description,
      components,
      connections,
      conversationTexts,
      selectedToolIds,
      userId
    });
    
    if (!updatedWorkflow) {
      return NextResponse.json({ error: "Workflow not found or you do not have permission to update it" }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Workflow updated successfully" 
    })
  } catch (error) {
    console.error("Error updating workflow:", error)
    return NextResponse.json({ error: "Failed to update workflow" }, { status: 500 })
  }
}
