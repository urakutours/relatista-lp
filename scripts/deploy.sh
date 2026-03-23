#!/bin/bash
# Relatista LP — Deploy to Xserver via scp
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Load environment variables
if [ -f "$PROJECT_DIR/.env" ]; then
  set -a
  source "$PROJECT_DIR/.env"
  set +a
else
  echo "ERROR: .env file not found"
  exit 1
fi

# Validate required variables
for var in DEPLOY_HOST DEPLOY_USER DEPLOY_PORT DEPLOY_KEY_PATH DEPLOY_REMOTE_PATH; do
  if [ -z "${!var:-}" ]; then
    echo "ERROR: $var is not set in .env"
    exit 1
  fi
done

KEY_FILE="$PROJECT_DIR/$DEPLOY_KEY_PATH"

if [ ! -f "$KEY_FILE" ]; then
  echo "ERROR: SSH key not found at $KEY_FILE"
  exit 1
fi

# Windows NTFS workaround: copy key to /tmp with proper permissions
TMP_KEY="/tmp/relatista_deploy_key_$$"
cp "$KEY_FILE" "$TMP_KEY"
chmod 600 "$TMP_KEY"
trap "rm -f $TMP_KEY" EXIT

SSH_OPTS="-i $TMP_KEY -o StrictHostKeyChecking=accept-new -P $DEPLOY_PORT"
SSH_CMD="ssh -i $TMP_KEY -o StrictHostKeyChecking=accept-new -p $DEPLOY_PORT"
REMOTE="${DEPLOY_USER}@${DEPLOY_HOST}"
REMOTE_PATH="$DEPLOY_REMOTE_PATH"

echo "Deploying Relatista LP to $DEPLOY_HOST..."
echo "  Remote path: $REMOTE_PATH"

# Ensure remote directory exists
$SSH_CMD "$REMOTE" "mkdir -p $REMOTE_PATH"

# Deploy files using scp (recursive)
# First, create a temp staging area with only deploy-worthy files
STAGING="/tmp/relatista_deploy_staging_$$"
mkdir -p "$STAGING"
trap "rm -rf $STAGING $TMP_KEY" EXIT

# Copy deployable files to staging
cp "$PROJECT_DIR/.htaccess" "$STAGING/"
cp "$PROJECT_DIR/favicon.ico" "$STAGING/"
cp "$PROJECT_DIR/index.html" "$STAGING/"
cp -r "$PROJECT_DIR/css" "$STAGING/"
cp -r "$PROJECT_DIR/js" "$STAGING/"
cp -r "$PROJECT_DIR/images" "$STAGING/"
cp -r "$PROJECT_DIR/privacy" "$STAGING/"
cp -r "$PROJECT_DIR/terms" "$STAGING/"
cp -r "$PROJECT_DIR/company" "$STAGING/"
cp -r "$PROJECT_DIR/tokushoho" "$STAGING/"
cp -r "$PROJECT_DIR/manual" "$STAGING/"
cp -r "$PROJECT_DIR/contact" "$STAGING/"

echo "Uploading files..."
scp -r $SSH_OPTS "$STAGING/"* "$STAGING/.htaccess" "$REMOTE:$REMOTE_PATH/"

echo ""
echo "Deploy complete!"
echo "Site: https://relatista.com"
