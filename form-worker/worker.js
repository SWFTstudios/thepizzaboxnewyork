/**
 * The Pizza Box NY - Form Submission Worker
 * Handles form submissions and sends to Airtable
 * Deploy this to: thepizzaboxformsubmission
 */

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // Only accept POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

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
      // Use environment variables: env.AIRTABLE_ACCESS_TOKEN and env.AIRTABLE_BASE_ID
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
        message: 'Form submitted to Airtable successfully',
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
};

