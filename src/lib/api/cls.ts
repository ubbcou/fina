import axios from 'axios';
import type { NewsItem, FetchResult } from '../types';

export async function fetchCLS(): Promise<FetchResult> {
    try {
        const params = {
            rn: '20',
            lastTime: Math.floor(Date.now() / 1000).toString(),
            name: 'telegraph'
        };

        const response = await axios.get('https://www.cls.cn/api/cache', {
            timeout: 8_000,
            params,
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.data.data?.roll_data) {
            // Fallback to error

            return { items: [], error: 'CLS API Error: ' + (response.data.data || 'Unknown') };
        }

        const items: NewsItem[] = (response.data.data?.roll_data || []).map((item: any) => ({
            id: `cls-${item.id}`,
            title: item.title || item.brief || item.content,
            content: item.content || item.brief || item.title,
            time: item.ctime,
            source: 'cls',
            url: `https://www.cls.cn/detail/${item.id}`,
            tags: item.subjects?.map((subject: any) => subject.subject_name)
        }));

        return { items };
    } catch (error: any) {
        console.error('CLS Fetch Error:', error);
        return { items: [], error: error.message };
    }
}
