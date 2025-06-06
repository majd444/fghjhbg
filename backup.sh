#!/bin/bash

# Create a timestamped backup of the frontend project
# This script creates a complete copy of the project with a timestamp

# Get current timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Define backup directory (parent of current directory)
BACKUP_DIR="/Users/majd/Desktop"

# Define current project directory name
CURRENT_DIR="frontend_backup_20250516_105537"

# New backup directory name
BACKUP_NAME="frontend_backup_${TIMESTAMP}"

# Full path for the new backup
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"

# Create backup
echo "Creating backup of project..."
echo "From: ${BACKUP_DIR}/${CURRENT_DIR}"
echo "To:   ${BACKUP_PATH}"

# Copy the directory
cp -R "${BACKUP_DIR}/${CURRENT_DIR}" "${BACKUP_PATH}"

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "✅ Backup created successfully at: ${BACKUP_PATH}"
    echo "To restore this backup, simply use the files from this directory."
else
    echo "❌ Error: Backup failed"
    exit 1
fi
