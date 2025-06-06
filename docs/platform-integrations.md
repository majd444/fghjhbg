# Chatbot Platform Integration Guide

This guide provides detailed, step-by-step instructions for setting up each platform integration with your chatbot.

## Table of Contents
- [WordPress Integration](#wordpress-integration)
- [WhatsApp Integration](#whatsapp-integration)
- [Instagram Integration](#instagram-integration)
- [Facebook Messenger Integration](#facebook-messenger-integration)
- [Telegram Integration](#telegram-integration)
- [Discord Integration](#discord-integration)

## WordPress Integration

### Overview
Add your chatbot to any WordPress website using a simple embed code.

### Requirements
- WordPress website with admin access
- API key from your chatbot platform

### Step-by-Step Instructions

1. **Get Your Embed Code**
   - Go to the Integrations section in your dashboard
   - Click "Connect" next to WordPress
   - Copy the generated embed code

2. **Add to Your WordPress Site**
   - Log in to your WordPress admin dashboard
   - There are three ways to add the code:

   **Option A: Using a Header/Footer Plugin**
   - Install a plugin like "Header and Footer Scripts" or "Insert Headers and Footers"
   - Go to Settings > Header and Footer Scripts
   - Paste the embed code in the Footer section
   - Save changes

   **Option B: Using Theme Customizer**
   - Go to Appearance > Customize > Additional CSS/HTML
   - Paste the embed code
   - Save and publish changes

   **Option C: Editing Theme Files**
   - Go to Appearance > Theme Editor
   - Edit footer.php
   - Paste the embed code just before the closing </body> tag
   - Update file

3. **Customize Position**
   - The default position is bottom-right
   - To change it, modify the "position" parameter in the embed code to:
     - "bottom-right" (default)
     - "bottom-left"
     - "top-right"
     - "top-left"

4. **Test Your Integration**
   - Visit your WordPress site
   - Look for the chatbot icon in the position you selected
   - Click it to open the chat interface
   - Send a test message to ensure it's working correctly

### Troubleshooting
- If the chatbot doesn't appear, try clearing your browser cache
- Check if you have any script-blocking plugins that might interfere
- Verify that your API key is correct in the embed code

---

## WhatsApp Integration

### Overview
Connect your chatbot to WhatsApp Business API to automatically respond to customer messages.

### Requirements
- WhatsApp Business API access
- Meta Developer account
- Valid business account

### Step-by-Step Instructions

1. **Apply for WhatsApp Business API Access**
   - Go to [Meta Business Platform](https://business.facebook.com/)
   - Create or select your business account
   - Navigate to WhatsApp > Getting Started
   - Follow the application process for WhatsApp Business API

2. **Set Up Your Meta App**
   - Go to [Meta Developer Portal](https://developers.facebook.com/)
   - Create a new app (or use an existing one)
   - Add the WhatsApp product to your app
   - Accept the terms and conditions

3. **Get Your Credentials**
   - In your Meta app dashboard, go to WhatsApp > Getting Started
   - Note your:
     - Phone Number ID
     - WhatsApp Business Account ID
     - Access Token (generate a permanent token if needed)

4. **Configure Your Chatbot Integration**
   - In your chatbot platform, go to Integrations and select WhatsApp
   - Enter your Phone Number ID and Access Token
   - Click "Connect"

5. **Set Up Webhook**
   - Copy the Webhook URL provided by your chatbot platform
   - In the Meta Developer Portal, go to WhatsApp > Configuration
   - Add the Webhook URL
   - Set the Verify Token (use the same one shown in your chatbot platform)
   - Subscribe to the following webhook fields:
     - `messages`
     - `message_status`

6. **Test Your Integration**
   - Send a message to your WhatsApp business number
   - Verify that your chatbot responds
   - Check the logs in your chatbot platform to ensure messages are being received

### Troubleshooting
- Ensure your WhatsApp Business API account is active and approved
- Verify that webhook subscription is correctly set up
- Check that all permissions are properly configured
- Ensure your access token hasn't expired

---

## Instagram Integration

### Overview
Connect your chatbot to Instagram Direct Messages for automated responses.

### Requirements
- Instagram Business Account
- Facebook Page connected to your Instagram account
- Meta Developer account

### Step-by-Step Instructions

1. **Prepare Your Instagram Account**
   - Convert your Instagram account to a Business account if you haven't already
   - Link your Instagram account to a Facebook Page
   - Ensure you have admin access to both

2. **Set Up Your Meta App**
   - Go to [Meta Developer Portal](https://developers.facebook.com/)
   - Create a new app (or use an existing one)
   - Add the Messenger product to your app
   - Under Products > Messenger > Instagram, connect your Instagram account

3. **Get Your Credentials**
   - In your Meta app dashboard, go to Messenger > Settings
   - Generate or copy your Page Access Token
   - Make sure it has the `instagram_basic` and `instagram_manage_messages` permissions

4. **Configure Your Chatbot Integration**
   - In your chatbot platform, go to Integrations and select Instagram
   - Enter your Page Access Token
   - Click "Connect"

5. **Set Up Webhook**
   - Copy the Webhook URL provided by your chatbot platform
   - In the Meta Developer Portal, go to Webhooks > Settings
   - Add the Webhook URL
   - Set the Verify Token (use the same one shown in your chatbot platform)
   - Subscribe to the `messages` field for your Instagram account

6. **Test Your Integration**
   - Open Instagram and send a direct message to your business account
   - Verify that your chatbot responds
   - Check the logs in your chatbot platform to ensure messages are being received

### Troubleshooting
- Instagram messaging API access may be limited in some regions
- Ensure your business account is properly set up and linked to Facebook
- Verify that all required permissions are granted
- Check that webhook subscriptions are correctly configured

---

## Facebook Messenger Integration

### Overview
Add your chatbot to Facebook Messenger to engage with customers automatically.

### Requirements
- Facebook Page
- Meta Developer account

### Step-by-Step Instructions

1. **Set Up Your Meta App**
   - Go to [Meta Developer Portal](https://developers.facebook.com/)
   - Create a new app (or use an existing one)
   - Select "Business" as the app type
   - Add the Messenger product to your app

2. **Configure Messenger Settings**
   - In your Meta app dashboard, go to Messenger > Settings
   - Under Access Tokens, connect your Facebook Page
   - Generate or copy your Page Access Token

3. **Configure Your Chatbot Integration**
   - In your chatbot platform, go to Integrations and select Messenger
   - Enter your Page Access Token
   - Click "Connect"

4. **Set Up Webhook**
   - Copy the Webhook URL provided by your chatbot platform
   - In the Meta Developer Portal, go to Messenger > Settings > Webhooks
   - Add the Webhook URL
   - Set the Verify Token (use the same one shown in your chatbot platform)
   - Subscribe to the following webhook fields:
     - `messages`
     - `messaging_postbacks`
     - `messaging_optins`

5. **Add Messenger to Your Facebook Page**
   - The integration automatically adds the Messenger experience to your page
   - Go to your Facebook Page to verify it's working

6. **Test Your Integration**
   - Send a message to your Facebook Page via Messenger
   - Verify that your chatbot responds
   - Check the logs in your chatbot platform to ensure messages are being received

### Troubleshooting
- Make sure your Facebook Page is published and visible to the public
- Verify that webhook subscription is correctly set up
- Ensure you have the proper page permissions and roles
- Check that your access token is valid and hasn't expired

---

## Telegram Integration

### Overview
Deploy your chatbot as a Telegram bot to engage with users on the platform.

### Requirements
- Telegram account

### Step-by-Step Instructions

1. **Create a Telegram Bot**
   - Open Telegram and search for "BotFather"
   - Start a chat with BotFather and send `/newbot`
   - Follow the instructions to create your bot:
     - Set a name for your bot
     - Set a username (must end with "bot")
   - BotFather will provide a Bot Token - save this

2. **Configure Your Chatbot Integration**
   - In your chatbot platform, go to Integrations and select Telegram
   - Enter your Bot Token
   - Click "Connect"

3. **Set Up Webhook**
   - The webhook is automatically configured when you connect your bot
   - However, you can verify it by using this URL in your browser:
     ```
     https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
     ```
   - Replace `<YOUR_BOT_TOKEN>` with your actual bot token

4. **Customize Your Bot (Optional)**
   - Return to BotFather and use these commands to customize your bot:
     - `/setdescription` - Change the bot description
     - `/setabouttext` - Set "About" information
     - `/setuserpic` - Set a profile picture
     - `/setcommands` - Set up command menu

5. **Test Your Integration**
   - Search for your bot on Telegram using its username
   - Start a chat with your bot
   - Send a message and verify that your chatbot responds
   - Try the /start command to see if it initializes properly

### Troubleshooting
- Ensure your bot token is entered correctly without any extra spaces
- Check if your bot is active by sending the `/start` command
- Verify the webhook is properly set up using the getWebhookInfo URL
- Make sure your bot has the privacy mode configured appropriately for your use case

---

## Discord Integration

### Overview
Add your chatbot to Discord servers to engage with community members.

### Requirements
- Discord account
- Ability to manage a Discord server (or permission from an admin)

### Step-by-Step Instructions

1. **Create a Discord Application**
   - Go to the [Discord Developer Portal](https://discord.com/developers/applications)
   - Click "New Application" and name your application
   - Navigate to the "Bot" tab
   - Click "Add Bot" and confirm

2. **Configure Bot Settings**
   - In the Bot tab, you can customize your bot's username and avatar
   - Under "Privileged Gateway Intents", enable:
     - Presence Intent
     - Server Members Intent
     - Message Content Intent
   - Save changes

3. **Get Your Bot Token**
   - In the Bot tab, click "Reset Token" or "Copy" if you already have one
   - Save this token securely - you'll need it for the integration

4. **Configure Your Chatbot Integration**
   - In your chatbot platform, go to Integrations and select Discord
   - Enter your Bot Token
   - Click "Connect"

5. **Add Bot to Your Server**
   - In the Discord Developer Portal, go to the "OAuth2" tab
   - In "URL Generator", select the following scopes:
     - `bot`
     - `applications.commands`
   - Under "Bot Permissions", select:
     - "Read Messages/View Channels"
     - "Send Messages"
     - "Read Message History"
   - Copy the generated URL and open it in your browser
   - Select the server to add your bot to and authorize

6. **Configure Webhook (Optional)**
   - If you want specific channel alerts, you can set up a Discord webhook:
     - In your Discord server, go to a channel's settings
     - Select "Integrations" > "Webhooks" > "New Webhook"
     - Configure and copy the webhook URL
     - Add this URL in your chatbot platform's Discord integration settings

7. **Test Your Integration**
   - Go to your Discord server where the bot is installed
   - Send a message mentioning your bot or use a command prefix
   - Verify that your chatbot responds
   - Try various commands to ensure functionality

### Troubleshooting
- Make sure your bot has the correct permissions in the server
- Verify that all required intents are enabled
- Check that your bot token is valid and entered correctly
- Ensure the bot is online in your Discord server members list

---

## General Troubleshooting Tips

1. **Check Connection Status**
   - Verify the integration shows as "Connected" in your dashboard
   - Look for any error messages in the connection process

2. **Review Webhook Configuration**
   - Ensure webhook URLs are correctly set up on each platform
   - Verify that all required events are subscribed to

3. **Validate Credentials**
   - Double-check that all tokens, keys, and IDs are entered correctly
   - Ensure credentials haven't expired (especially for Meta platform)

4. **Test Messages**
   - Use the Test function in your chatbot platform
   - Send real messages from each platform to verify end-to-end functionality

5. **Check Logs**
   - Review any error logs in your chatbot platform
   - Look for webhook errors in the platform developer portals

6. **Permissions Issues**
   - Verify your app/bot has all necessary permissions
   - Check if platform-specific requirements have changed

7. **Platform Limitations**
   - Be aware of rate limits on each platform
   - Understand message format limitations for each service

---

Need more help? Contact our support team for personalized assistance with your integration.
