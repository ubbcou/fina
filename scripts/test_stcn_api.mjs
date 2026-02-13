
import fs from 'fs';

async function testApi() {
  try {
    // Try to fetch the latest news without specific time first, or use current time
    const params = new URLSearchParams({
        type: 'kx',
        page_time: '1', // Start with page 1?
        // last_time: Math.floor(Date.now() / 1000).toString() 
    });
    const url = `https://stcn.com/article/list.html?${params.toString()}`;
    console.log(`Fetching ${url}...`);
    
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json, text/javascript, */*; q=0.01'
    };

    const response = await fetch(url, { headers });
    
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));

    const text = await response.text();
    console.log(`Body length: ${text.length}`);
    
    try {
        const json = JSON.parse(text);
        console.log('JSON parsed successfully!');
        if (json.data && json.data.length > 0) {
            console.log('First item:', JSON.stringify(json.data[0], null, 2));
        } else {
            console.log('No data found in JSON');
            console.log(text.substring(0, 500));
        }
    } catch (e) {
        console.error('Failed to parse JSON:', e);
        console.log('Raw body (first 500 chars):', text.substring(0, 500));
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testApi();
