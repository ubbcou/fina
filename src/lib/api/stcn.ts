import axios from 'axios';
import { NewsItem, FetchResult } from '../types';

export async function fetchSTCN(): Promise<FetchResult> {
    try {
        const response = await axios.get('https://stcn.com/article/list.html', {
            timeout: 8_000,
            params: {
                type: 'kx',
                page_time: '1'
             },
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                // Critical header to get JSON response
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (response.data?.state !== 1 || !Array.isArray(response.data?.data)) {
            // If data is missing or state is not 1 (success)
             return { items: [], error: 'STCN API Error: Invalid response format' };
        }

        const items: NewsItem[] = response.data.data.map((item: any) => ({
            id: `stcn-${item.id}`,
            title: item.title,
            content: item.content || item.title,
            // item.time is in milliseconds (e.g. 1770953841000)
            time: Math.floor(item.time / 1000), 
            source: 'stcn',
            url: item.share_url || `https://stcn.com/article/detail/${item.id}.html`,
            tags: item.tags?.map((t: any) => t.name) || [],
             // STCN doesn't seem to have direct image fields for all items in the example, 
             // but if they do, we can map them. The example had a "share" object with an image.
             // We'll leave pic undefined for now unless we see it in the main item object.
        }));

        return { items };
    } catch (error: any) {
        console.error('STCN Fetch Error:', error);
        return { items: [], error: error.message };
    }
}
