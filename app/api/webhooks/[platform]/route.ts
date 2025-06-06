/**
 * Webhook Handler for External Platform Integrations
 * 
 * This module provides webhook endpoints for receiving messages and events
 * from external platforms like WordPress, WhatsApp, etc.
 */
import { NextRequest, NextResponse } from "next/server";
import { pluginRegistry } from "@/lib/plugins/plugin-interface";
import { pluginDb } from "@/lib/database/plugin-db";
import { agentDb } from "@/lib/database/agent-db";

// POST /api/webhooks/:platform - Handle webhook events from external platforms
export async function POST(
  req: NextRequest,
  { params }: { params: { platform: string } }
) {
  try {
    const platform = params.platform;
    if (!platform) {
      return NextResponse.json({ error: "Platform not specified" }, { status: 400 });
    }
    
    // Get the payload
    const payload = await req.json();
    
    // Get all plugins for this platform
    const plugins = pluginRegistry.getPluginsByPlatform(platform);
    if (plugins.length === 0) {
      return NextResponse.json({ error: `No plugins found for platform: ${platform}` }, { status: 404 });
    }
    
    // Process the webhook with each plugin
    for (const plugin of plugins) {
      try {
        // Handle the webhook
        const message = await plugin.handleWebhook({
          ...payload,
          platform
        });
        
        if (message) {
          console.log(`Received message from ${platform}:`, message);
          
          // Here you would typically:
          // 1. Find the agent associated with this integration
          // 2. Process the message with the agent
          // 3. Send a response back to the user
          
          // For now, we'll just acknowledge receipt
          return NextResponse.json({
            success: true,
            message: "Webhook processed successfully",
            platform,
            messageReceived: true
          });
        }
      } catch (error) {
        console.error(`Error processing webhook with plugin ${plugin.id}:`, error);
      }
    }
    
    // If we got here, no plugin successfully handled the webhook
    return NextResponse.json({
      success: false,
      message: "Webhook received but not processed by any plugin",
      platform
    }, { status: 200 }); // Still return 200 to acknowledge receipt
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}

// GET /api/webhooks/:platform - Handle verification requests from external platforms
export async function GET(
  req: NextRequest,
  { params }: { params: { platform: string } }
) {
  try {
    const platform = params.platform;
    if (!platform) {
      return NextResponse.json({ error: "Platform not specified" }, { status: 400 });
    }
    
    // Get URL parameters
    const url = new URL(req.url);
    
    // Handle platform-specific verification
    switch (platform) {
      case 'whatsapp':
        // WhatsApp verification
        const mode = url.searchParams.get('hub.mode');
        const token = url.searchParams.get('hub.verify_token');
        const challenge = url.searchParams.get('hub.challenge');
        
        if (mode === 'subscribe' && token) {
          // Find WhatsApp plugin configurations with this verify token
          const plugins = pluginRegistry.getPluginsByPlatform('whatsapp');
          
          for (const plugin of plugins) {
            if (plugin.config.verifyToken === token) {
              console.log('WhatsApp webhook verified');
              return new Response(challenge, { status: 200 });
            }
          }
        }
        
        return new Response('Verification failed', { status: 403 });
        
      case 'wordpress':
        // WordPress verification (simple ping)
        return NextResponse.json({ status: 'ok' });
        
      default:
        // Generic verification
        return NextResponse.json({
          success: true,
          message: `Webhook endpoint for ${platform} is active`,
          platform
        });
    }
  } catch (error) {
    console.error("Error processing webhook verification:", error);
    return NextResponse.json({ error: "Failed to process verification" }, { status: 500 });
  }
}
