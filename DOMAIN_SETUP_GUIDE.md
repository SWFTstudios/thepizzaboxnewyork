# Domain Setup Guide for The Pizza Box NY

## Prerequisites
- Access to the domain registrar (where thepizzaboxnewyork.com is registered)
- Cloudflare account with the Worker already deployed

## Method 1: Transfer Domain to Cloudflare (Recommended)

### Step 1: Add Domain to Cloudflare
1. Log into Cloudflare dashboard
2. Click "Add a Site"
3. Enter: `thepizzaboxnewyork.com`
4. Select "Free" plan (sufficient for most websites)
5. Click "Continue"

### Step 2: Get Nameservers
1. Cloudflare will provide 2 nameservers (e.g., `ns1.cloudflare.com`, `ns2.cloudflare.com`)
2. Copy these nameservers

### Step 3: Update Domain Registrar
1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find DNS management or nameserver settings
3. Replace existing nameservers with Cloudflare's nameservers
4. Save changes

### Step 4: Wait for Propagation
- DNS changes can take 24-48 hours to fully propagate
- Check status in Cloudflare dashboard

### Step 5: Enable Worker Routing
1. In Cloudflare dashboard, go to Workers & Pages
2. Select your `thepizzaboxnewyork` worker
3. Go to "Settings" → "Triggers"
4. Add route: `thepizzaboxnewyork.com/*`

## Method 2: Keep Domain with Current Registrar

### Step 1: Add Custom Domain to Worker
1. In Cloudflare dashboard, go to your Worker
2. Click "Settings" tab
3. Scroll to "Custom Domains"
4. Click "Add Custom Domain"
5. Enter: `thepizzaboxnewyork.com`

### Step 2: Configure DNS Records
Add these DNS records in your domain registrar:

```
Type: CNAME
Name: @
Value: thepizzaboxnewyork.your-subdomain.workers.dev

Type: CNAME  
Name: www
Value: thepizzaboxnewyork.your-subdomain.workers.dev
```

### Step 3: Enable SSL
1. In Cloudflare dashboard, go to SSL/TLS
2. Set encryption mode to "Full" or "Full (strict)"
3. Enable "Always Use HTTPS"

## Verification Steps

### Test Domain Access
1. Wait 15-30 minutes after DNS changes
2. Visit `https://thepizzaboxnewyork.com`
3. Verify the website loads correctly
4. Check that all images and styles load properly

### Check SSL Certificate
1. Ensure the site loads with HTTPS
2. Look for the lock icon in the browser
3. Test on mobile devices

## Troubleshooting

### Common Issues
- **Domain not resolving**: Wait longer for DNS propagation
- **SSL errors**: Check SSL/TLS settings in Cloudflare
- **Images not loading**: Verify all assets are uploaded to Worker
- **404 errors**: Check Worker routing configuration

### Support Resources
- Cloudflare Support: https://support.cloudflare.com
- DNS Checker: https://dnschecker.org
- SSL Labs Test: https://ssllabs.com/ssltest/

## Client Communication Template

"Hi [Client Name],

I've successfully deployed your The Pizza Box NY website to Cloudflare's global network. To connect your domain (thepizzaboxnewyork.com), I need to update your DNS settings.

**Option A (Recommended)**: Transfer domain management to Cloudflare for better performance and security.

**Option B**: Keep current domain registrar and add DNS records.

I'll handle the technical setup once you confirm which option you prefer. The website is currently live at: [Worker URL]

Let me know your preference and I'll complete the domain setup.

Best regards,
[Your Name]"
