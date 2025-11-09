/**
 * The Pizza Box NY - Cloudflare Worker
 * Serves static website files and handles form submissions to Airtable
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Handle form submission endpoint
    if (pathname === '/api/submit-form' && request.method === 'POST') {
      return handleFormSubmission(request, env);
    }

    // Handle root path
    if (pathname === '/') {
      pathname = '/index.html';
    }

    // Handle common file extensions
    if (!pathname.includes('.')) {
      // If no extension, try adding .html
      pathname += '.html';
    }

    // Try to fetch the file from the site bucket
    try {
      const response = await env.ASSETS.fetch(new Request(url.origin + pathname));
      
      if (response.status === 404) {
        // Try without .html extension for directories
        if (pathname.endsWith('.html')) {
          const altPath = pathname.slice(0, -5);
          const altResponse = await env.ASSETS.fetch(new Request(url.origin + altPath));
          if (altResponse.status !== 404) {
            return altResponse;
          }
        }
        
        // Return 404 page if it exists
        const notFoundResponse = await env.ASSETS.fetch(new Request(url.origin + '/404.html'));
        if (notFoundResponse.status !== 404) {
          return new Response(notFoundResponse.body, {
            status: 404,
            headers: notFoundResponse.headers
          });
        }
      }

      return response;
    } catch (error) {
      console.error('Error serving file:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};

/**
 * Handle form submission and send to Airtable
 * @param {Request} request - The incoming request
 * @param {Object} env - Environment variables (AIRTABLE_ACCESS_TOKEN, AIRTABLE_BASE_ID)
 * @returns {Response}
 */
async function handleFormSubmission(request, env) {
  try {
    // Parse form data
    const formData = await request.formData();
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    console.info('Form submission received:', data.Name || 'No name');

    // Prepare Airtable record
    const airtableRecord = {
      fields: {
        'Name': data.Name || '',
        'Event Type': data['Event-Type'] || '',
        'Phone Number': data['Phone-Number'] || '',
        'Email Address': data['Email-Address'] || data.email || '',
        'Event Date': data['Event-Date'] || '',
        'Event Time': data['Event-Time'] || '',
        'Formatted Date Time': data['Formatted-Date-Time'] || '',
        'Number of Seats': parseInt(data['Number-of-Seats']) || 0,
        'Message': data.Message || '',
        'Submission Date': new Date().toISOString()
      }
    };

    // Send to Airtable
    const airtableUrl = `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/Form%20Submissions`;
    
    const airtableResponse = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.AIRTABLE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(airtableRecord)
    });

    if (!airtableResponse.ok) {
      const errorText = await airtableResponse.text();
      console.error('Airtable API error:', errorText);
      throw new Error(`Airtable error: ${airtableResponse.status}`);
    }

    const result = await airtableResponse.json();
    console.info('Successfully saved to Airtable:', result.id);

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      message: 'Form submitted successfully',
      recordId: result.id
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('Form submission error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
