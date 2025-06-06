#!/bin/bash

# Create directory if it doesn't exist
mkdir -p public/images/integrations

# Download logos for each platform
curl -s "https://upload.wikimedia.org/wikipedia/commons/0/09/Wordpress-Logo.svg" > public/images/integrations/wordpress.svg
curl -s "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" > public/images/integrations/whatsapp.svg
curl -s "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" > public/images/integrations/instagram.svg
curl -s "https://upload.wikimedia.org/wikipedia/commons/b/be/Facebook_Messenger_logo_2020.svg" > public/images/integrations/messenger.svg
curl -s "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" > public/images/integrations/telegram.svg
curl -s "https://upload.wikimedia.org/wikipedia/commons/c/c0/Discord_logo.svg" > public/images/integrations/discord.svg

echo "All logos downloaded successfully to public/images/integrations/"
