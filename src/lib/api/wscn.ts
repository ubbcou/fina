import axios from 'axios';
import { NewsItem, FetchResult } from '../types';

export async function fetchWSCN(): Promise<FetchResult> {
    try {
        const response = await axios.get('https://api-prod.wallstreetcn.com/apiv1/content/lives', {
            params: {
                channel: 'global-channel',
                limit: 20
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (response.data.code !== 20000) {
            return { items: [], error: 'WSCN API Error: ' + response.data.message };
        }

        const items: NewsItem[] = response.data.data.items.map((item: any) => ({
            id: `wscn-${item.id}`,
            title: item.title || item.content_text.slice(0, 30) + '...',
            content: item.content_text,
            time: item.display_time,
            source: 'wscn',
            url: item.uri || `https://wallstreetcn.com/livenews/${item.id}`,
            tags: item.tags
        }));

        return { items };
    } catch (error: any) {
        console.error('WSCN Fetch Error:', error);
        return { items: [], error: error.message };
    }
}
