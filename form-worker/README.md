# Form Submission Worker for The Pizza Box NY

This Worker handles form submissions and sends them to Airtable.

## Deployment Instructions

### 1. Set the Airtable Access Token (One-time setup)

```bash
cd form-worker
echo "YOUR_AIRTABLE_ACCESS_TOKEN" | npx wrangler secret put AIRTABLE_ACCESS_TOKEN
```

Replace `YOUR_AIRTABLE_ACCESS_TOKEN` with your actual Airtable Personal Access Token.

### 2. Deploy the Worker

```bash
cd form-worker
npx wrangler deploy
```

### 3. Verify Deployment

The worker will be live at: `https://thepizzaboxformsubmission.elombe.workers.dev`

## Environment Variables

- **AIRTABLE_BASE_ID**: `appCdCg00IyNvmV1L` (in wrangler.toml)
- **AIRTABLE_ACCESS_TOKEN**: Stored as encrypted secret in Cloudflare

## How It Works

1. Main website form submits to FormSubmit.co (email)
2. JavaScript also sends copy to this Worker URL
3. Worker receives form data
4. Worker sends data to Airtable API
5. Form Submissions table gets new record

## Testing

Submit a test form on the website and check:
- ✅ Email received (FormSubmit.co)
- ✅ Record appears in Airtable Form Submissions table
- ✅ Console shows "✅ Form data saved to Airtable"

