import axios from 'axios';
import { NewsItem, FetchResult } from '../types';

export async function fetchJin10(): Promise<FetchResult> {
    try {
        // Attempt with channel -24 (Common for 7x24), if fail, try others
        const response = await axios.get('https://flash-api.jin10.com/get_flash_list', {
            params: {
                channel: '-8200',
                limit: 20,
                vip: '1'
            },
            headers: {
                'x-app-id': 'bVBF4FyRTn5NJF5n', // Common app ID found in public scripts
                'x-version': '1.0.0',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        // If 405 or error, might need to adjust channel. 
        // Data format: { status: 0, data: [ ... ] } or similar

        if (response.data.status !== 0 && response.data.message !== 'OK') {
            // Fallback or specific error handling
            // Sometimes status is omitted or different
        }


        const items: NewsItem[] = (response.data.data || []).map((item: any) => ({
            id: `jin10-${item.id}`,
            title: item.data?.title || item.data?.content?.slice(0, 30) || 'No Title',
            content: item.data?.content || item.data?.title,
            time: new Date(item.time).getTime() / 1000, // Jin10 uses full timestamp string usually? Need to verify
            source: 'jin10',
            url: item.data?.link || `https://flash.jin10.com/detail/${item.id}`,
            tags: []
        }));

        return { items };
    } catch (error: any) {
        console.error('Jin10 Fetch Error:', error);
        return { items: [], error: error.message };
    }
}
