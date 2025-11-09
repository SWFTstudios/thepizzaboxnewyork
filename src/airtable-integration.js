/**
 * Airtable Integration for The Pizza Box NY
 * Handles form submission data and sends it to Airtable
 * Matches the exact structure from your Airtable base
 */

const config = require('../airtable.config.js');

/**
 * Submit form data to Airtable Form Submissions table
 * @param {Object} formData - The form submission data
 * @returns {Promise<Object>} - Airtable response
 */
async function submitToAirtable(formData) {
  const url = `${config.apiEndpoint}/${config.baseId}/${encodeURIComponent(config.tables.formSubmissions)}`;
  
  // Match exact field names from your Airtable "Form Submissions" table
  const airtableRecord = {
    fields: {
      'Name': formData.Name || '',
      'Event Type': formData['Event-Type'] || '',
      'Phone Number': formData['Phone-Number'] || '',
      'Email Address': formData['Email-Address'] || formData.email || '',
      'Event Date': formData['Event-Date'] || '',
      'Event Time': formData['Event-Time'] || '',
      'Formatted Date Time': formData['Formatted-Date-Time'] || '',
      'Number of Seats': parseInt(formData['Number-of-Seats']) || 0,
      'Message': formData.Message || '',
      'Submission Date': new Date().toISOString()
      // Customer and Order fields will be linked via Airtable relationships
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(airtableRecord)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Successfully submitted to Airtable:', result.id);
    return result;
  } catch (error) {
    console.error('Error submitting to Airtable:', error);
    throw error;
  }
}

/**
 * Get all form submissions from Airtable
 * @returns {Promise<Array>} - Array of form submission records
 */
async function getFormSubmissions() {
  const url = `${config.apiEndpoint}/${config.baseId}/${encodeURIComponent(config.tables.formSubmissions)}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${config.accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    return data.records;
  } catch (error) {
    console.error('Error fetching from Airtable:', error);
    throw error;
  }
}

module.exports = { submitToAirtable, getFormSubmissions };

