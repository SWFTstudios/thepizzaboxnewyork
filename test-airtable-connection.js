/**
 * Test Airtable Connection
 * Run this to verify your Airtable credentials are working
 */

const config = require('./airtable.config.js');

async function testConnection() {
  console.log('Testing Airtable connection...\n');
  console.log('Base ID:', config.baseId);
  console.log('Table:', config.tables.formSubmissions);
  
  const url = `${config.apiEndpoint}/${config.baseId}/${encodeURIComponent(config.tables.formSubmissions)}`;
  
  try {
    console.log('\nAttempting to fetch records...');
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${config.accessToken}`
      }
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error:', errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ Success! Connected to Airtable');
    console.log('Records found:', data.records.length);
    console.log('\nFirst few records:');
    data.records.slice(0, 3).forEach(record => {
      console.log('- Name:', record.fields.Name || 'No name');
    });
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();

