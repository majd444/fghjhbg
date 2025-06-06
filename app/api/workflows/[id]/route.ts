import { NextRequest, NextResponse } from "next/server"
import { queryWorkflows, updateWorkflow } from "@/lib/sevalla-db-workflow"

// GET /api/workflows/:id - Get a specific workflow by ID
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const workflowId = params.id
    
    // Query our mock database for the specific workflow
    const workflows = await queryWorkflows<any>({ id: workflowId });
    
    if (!workflows.length) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 })
    }
    
    return NextResponse.json(workflows[0])
  } catch (error) {
    console.error("Error fetching workflow:", error)
    return NextResponse.json({ error: "Failed to fetch workflow" }, { status: 500 })
  }
}

// PUT /api/workflows/:id - Update a specific workflow by ID
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const workflowId = params.id
    const data = await req.json()
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }
    
    // Update the workflow in our mock database
    const updatedWorkflow = await updateWorkflow<{id: string}>(workflowId, {
      name: data.name,
      description: data.description || "",
      components: data.components || [],
      connections: data.connections || {},
      conversationTexts: data.conversationTexts || null,
      selectedToolIds: data.selectedToolIds || null,
      chatbotName: data.chatbotName || "AI Assistant",
      systemPrompt: data.systemPrompt || "You are a helpful AI assistant.",
      topColor: data.topColor || "#1f2937",
      accentColor: data.accentColor || "#3B82F6",
      backgroundColor: data.backgroundColor || "#F3F4F6",
      temperature: data.temperature || 0.7,
      model: data.model || "gpt-4",
      maxTokens: data.maxTokens || 2000,
      extraConfig: data.extraConfig || {}
    })
    
    if (!updatedWorkflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, workflowId: updatedWorkflow.id })
  } catch (error) {
    console.error("Error updating workflow:", error)
    return NextResponse.json({ error: "Failed to update workflow" }, { status: 500 })
  }
}

// PATCH /api/workflows/:id - Update specific fields of a workflow
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const workflowId = params.id
    const data = await req.json()
    
    // Get current workflow data
    const workflows = await queryWorkflows<any>({ id: workflowId })
    
    if (!workflows.length) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 })
    }
    
    // Build update object with only the fields that are provided
    const updateObj: Record<string, any> = {}
    
    if (data.topColor !== undefined) {
      updateObj.topColor = data.topColor
    }
    
    if (data.accentColor !== undefined) {
      updateObj.accentColor = data.accentColor
    }
    
    if (data.backgroundColor !== undefined) {
      updateObj.backgroundColor = data.backgroundColor
    }
    
    // If no fields to update, return success
    if (Object.keys(updateObj).length === 0) {
      return NextResponse.json({ success: true, workflowId })
    }
    
    // Execute update
    const updatedWorkflow = await updateWorkflow<{id: string}>(workflowId, updateObj)
    
    if (!updatedWorkflow) {
      return NextResponse.json({ error: "Failed to update workflow" }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, workflowId: updatedWorkflow.id })
  } catch (error) {
    console.error("Error patching workflow:", error)
    return NextResponse.json({ error: "Failed to update workflow" }, { status: 500 })
  }
}

// DELETE /api/workflows/:id - Delete a specific workflow by ID
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const workflowId = params.id
    
    // Delete the workflow from our mock database
    // Since we removed the deleteWorkflow import, let's use updateWorkflow with a flag
    const workflows = await queryWorkflows<any>({ id: workflowId })
    
    if (!workflows.length) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 })
    }
    
    // In a real implementation, we would use deleteWorkflow here
    // For now, let's mark it as deleted using an updateWorkflow call
    await updateWorkflow(workflowId, { deleted: true })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting workflow:", error)
    return NextResponse.json({ error: "Failed to delete workflow" }, { status: 500 })
  }
}
