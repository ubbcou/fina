
import fs from 'fs';

async function testFetch() {
  try {
    const url = 'https://stcn.com/article/list.html?type=kx';
    console.log(`Fetching ${url}...`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (!response.ok) {
        console.error(`Failed to fetch: ${response.status} ${response.statusText}`);
        return;
    }

    const text = await response.text();
    console.log(`Fetched ${text.length} bytes.`);
    
    // Save to file for inspection
    fs.writeFileSync('stcn_dump.html', text);
    console.log('Saved to stcn_dump.html');

    // Try to find news items
    // Pattern might be complex, so let's just look for the known title from browser subagent
    // "商业航天板块震荡上涨"
    const snippetIndex = text.indexOf('商业航天板块震荡上涨');
    if (snippetIndex !== -1) {
        console.log('Found snippet at index:', snippetIndex);
        console.log('Context:', text.substring(snippetIndex - 500, snippetIndex + 500));
    } else {
        console.log('Snippet not found. Maybe content changed or loaded via JS?');
        // Look for any list structure
        const listMatch = text.match(/<ul[^>]*class="[^"]*news_list[^"]*"[^>]*>/);
        if (listMatch) {
             console.log('Found news_list ul:', listMatch[0]);
        }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testFetch();
