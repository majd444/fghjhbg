
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink } from "lucide-react";

interface IntegrationFormProps {
  integrationId: string;
  integrationName: string;
  setupGuideUrl?: string;
  formState: Record<string, string>;
  onFormChange: (newState: Record<string, string>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function IntegrationForm({
  integrationId,
  integrationName,
  setupGuideUrl,
  formState,
  onFormChange,
  onSubmit,
  isSubmitting
}: IntegrationFormProps) {
  const handleChange = (key: string, value: string) => {
    onFormChange({ ...formState, [key]: value });
  };

  return (
    <div className="space-y-4">
      {setupGuideUrl && (
        <div className="mb-4">
          <a 
            href={setupGuideUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            View setup guide <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>
      )}

      {/* WordPress Integration Fields */}
      {integrationId === "wordpress" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="site-url">WordPress Site URL</Label>
            <Input
              id="site-url"
              placeholder="https://example.com"
              value={formState["site-url"] || ""}
              onChange={(e) => handleChange("site-url", e.target.value)}
            />
            <p className="text-xs text-gray-500">The URL of your WordPress site.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="wpapi_xxxxxxxxxxxxxxxx"
              value={formState["api-key"] || ""}
              onChange={(e) => handleChange("api-key", e.target.value)}
            />
            <p className="text-xs text-gray-500">Generate an API key in your WordPress admin dashboard.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="embed-location">Embed Location</Label>
            <Input
              id="embed-location"
              placeholder="bottom-right"
              value={formState["embed-location"] || "bottom-right"}
              onChange={(e) => handleChange("embed-location", e.target.value)}
            />
            <p className="text-xs text-gray-500">Where to display the chatbot on your site.</p>
          </div>
        </>
      )}

      {/* WhatsApp Integration Fields */}
      {integrationId === "whatsapp" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="phone-number-id">Phone Number ID</Label>
            <Input
              id="phone-number-id"
              placeholder="1234567890"
              value={formState["phone-number-id"] || ""}
              onChange={(e) => handleChange("phone-number-id", e.target.value)}
            />
            <p className="text-xs text-gray-500">Your WhatsApp Business Account Phone Number ID.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="access-token">Access Token</Label>
            <Input
              id="access-token"
              type="password"
              placeholder="EAAG..."
              value={formState["access-token"] || ""}
              onChange={(e) => handleChange("access-token", e.target.value)}
            />
            <p className="text-xs text-gray-500">Generate an access token in the Meta Developers dashboard.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="verify-token">Verify Token</Label>
            <Input
              id="verify-token"
              placeholder="your-verify-token"
              value={formState["verify-token"] || ""}
              onChange={(e) => handleChange("verify-token", e.target.value)}
            />
            <p className="text-xs text-gray-500">Custom string used to verify webhook endpoints.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              readOnly
              value={`${window.location.origin}/api/integrations/whatsapp/webhook`}
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <p className="text-xs text-gray-500">Set this URL as your WhatsApp webhook endpoint in the Meta Dashboard.</p>
          </div>
        </>
      )}

      {/* Instagram Integration Fields */}
      {integrationId === "instagram" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="page-id">Instagram Business Account ID</Label>
            <Input
              id="page-id"
              placeholder="1234567890"
              value={formState["page-id"] || ""}
              onChange={(e) => handleChange("page-id", e.target.value)}
            />
            <p className="text-xs text-gray-500">Your Instagram Business Account ID.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="access-token">Access Token</Label>
            <Input
              id="access-token"
              type="password"
              placeholder="EAAG..."
              value={formState["access-token"] || ""}
              onChange={(e) => handleChange("access-token", e.target.value)}
            />
            <p className="text-xs text-gray-500">Generate a page access token in the Meta Developers dashboard.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              readOnly
              value={`${window.location.origin}/api/integrations/instagram/webhook`}
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <p className="text-xs text-gray-500">Set this URL as your Instagram webhook endpoint in the Meta Dashboard.</p>
          </div>
        </>
      )}

      {/* Messenger Integration Fields */}
      {integrationId === "messenger" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="page-id">Facebook Page ID</Label>
            <Input
              id="page-id"
              placeholder="1234567890"
              value={formState["page-id"] || ""}
              onChange={(e) => handleChange("page-id", e.target.value)}
            />
            <p className="text-xs text-gray-500">Your Facebook Page ID.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="access-token">Page Access Token</Label>
            <Input
              id="access-token"
              type="password"
              placeholder="EAAG..."
              value={formState["access-token"] || ""}
              onChange={(e) => handleChange("access-token", e.target.value)}
            />
            <p className="text-xs text-gray-500">Generate a page access token in the Meta Developers dashboard.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="app-secret">App Secret</Label>
            <Input
              id="app-secret"
              type="password"
              placeholder="app-secret-here"
              value={formState["app-secret"] || ""}
              onChange={(e) => handleChange("app-secret", e.target.value)}
            />
            <p className="text-xs text-gray-500">Your Facebook App Secret.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="verify-token">Verify Token</Label>
            <Input
              id="verify-token"
              placeholder="your-verify-token"
              value={formState["verify-token"] || ""}
              onChange={(e) => handleChange("verify-token", e.target.value)}
            />
            <p className="text-xs text-gray-500">Custom string used to verify webhook endpoints.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              readOnly
              value={`${window.location.origin}/api/integrations/messenger/webhook`}
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <p className="text-xs text-gray-500">Set this URL as your Messenger webhook endpoint in the Meta Dashboard.</p>
          </div>
        </>
      )}

      {/* Telegram Integration Fields */}
      {integrationId === "telegram" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="bot-token">Bot Token</Label>
            <Input
              id="bot-token"
              type="password"
              placeholder="1234567890:ABCDEF..."
              value={formState["bot-token"] || ""}
              onChange={(e) => handleChange("bot-token", e.target.value)}
            />
            <p className="text-xs text-gray-500">Get this from BotFather when creating a new bot.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bot-username">Bot Username</Label>
            <Input
              id="bot-username"
              placeholder="YourBotName_bot"
              value={formState["bot-username"] || ""}
              onChange={(e) => handleChange("bot-username", e.target.value)}
            />
            <p className="text-xs text-gray-500">The username of your Telegram bot (with @).</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              readOnly
              value={`${window.location.origin}/api/integrations/telegram/webhook`}
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <p className="text-xs text-gray-500">
              Your bot will be automatically configured to use this webhook.
            </p>
          </div>
        </>
      )}

      {/* Agentive Integration Fields */}
      {integrationId === "agentive" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="api-key">Agentive API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="agentive_api_key_xxxxx"
              value={formState["api-key"] || ""}
              onChange={(e) => handleChange("api-key", e.target.value)}
            />
            <p className="text-xs text-gray-500">Your Agentive API key from the Agentive dashboard.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="assistant-id">Assistant ID</Label>
            <Input
              id="assistant-id"
              placeholder="asst_xxxxxxxxxxxxxxxx"
              value={formState["assistant-id"] || ""}
              onChange={(e) => handleChange("assistant-id", e.target.value)}
            />
            <p className="text-xs text-gray-500">The ID of your Agentive assistant.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="widget-position">Widget Position</Label>
            <Input
              id="widget-position"
              placeholder="bottom-right"
              value={formState["widget-position"] || "bottom-right"}
              onChange={(e) => handleChange("widget-position", e.target.value)}
            />
            <p className="text-xs text-gray-500">Position of the chat widget on your site (bottom-right, bottom-left, etc).</p>
          </div>
        </>
      )}

      {/* Discord Integration Fields */}
      {integrationId === "discord" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="bot-token">Bot Token</Label>
            <Input
              id="bot-token"
              type="password"
              placeholder="XXXXXXXXXXXXXXXXXXXX"
              value={formState["bot-token"] || ""}
              onChange={(e) => handleChange("bot-token", e.target.value)}
            />
            <p className="text-xs text-gray-500">Your Discord Bot Token from the Discord Developer Portal.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-id">Client ID</Label>
            <Input
              id="client-id"
              placeholder="1234567890"
              value={formState["client-id"] || ""}
              onChange={(e) => handleChange("client-id", e.target.value)}
            />
            <p className="text-xs text-gray-500">Your Discord Application Client ID.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="guild-id">Server ID (optional)</Label>
            <Input
              id="guild-id"
              placeholder="1234567890"
              value={formState["guild-id"] || ""}
              onChange={(e) => handleChange("guild-id", e.target.value)}
            />
            <p className="text-xs text-gray-500">Specific Discord Server ID to restrict the bot to.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              readOnly
              value={`${window.location.origin}/api/integrations/discord/webhook`}
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <p className="text-xs text-gray-500">Set this URL as your Discord bot's interaction endpoint URL.</p>
          </div>
        </>
      )}

      <div className="pt-4">
        <Button 
          type="button" 
          onClick={onSubmit} 
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            `Save ${integrationName} Integration`
          )}
        </Button>
      </div>
    </div>
  );
}
