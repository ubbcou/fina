import axios from 'axios';
import { NewsItem, FetchResult } from '../types';

export async function fetchThs(): Promise<FetchResult> {
    try {
        // Ths requires cookies and hexin-v header. 
        // This simple fetch will likely fail with 403, but placeholder for now.
        // Solution: Implement Puppeteer bridge later.
        const response = await axios.get('https://news.10jqka.com.cn/tapp/news/push/stock/', {
            params: {
                page: 1,
                tag: '',
                track: 'website',
                pagesize: 20
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://news.10jqka.com.cn/realtimenews.html'
            }
        });

        if (response.data.code !== '200' && response.data.code !== 0) {
            // Ths return format varies
        }

        const items: NewsItem[] = (response.data.data?.list || []).map((item: any) => ({
            id: `ths-${item.id}`,
            title: item.title,
            content: item.digest || item.title,
            time: parseInt(item.ctime),
            source: 'ths',
            url: item.url,
            tags: []
        }));

        return { items };
    } catch (error: any) {
        console.error('Ths Fetch Error:', error);
        return { items: [], error: error.message };
    }
}
