import axios from 'axios';
import crypto from 'crypto';
import { NewsItem, FetchResult } from '../types';

const MD5_SALT = '37089408432360b098317781b212f718'; // Found in scripts

function generateSign(params: Record<string, string>) {
    const sortedKeys = Object.keys(params).sort();
    const queryString = sortedKeys.map(k => `${k}=${params[k]}`).join('&');
    // Try sha1(params + salt) or md5(params + salt)
    // Based on common patterns: MD5(queryString + salt) or MD5(salt + queryString)
    // We'll try one standard way. If it fails, we catch the error.
    return crypto.createHash('md5').update(queryString + MD5_SALT).digest('hex');
}

export async function fetchCLS(): Promise<FetchResult> {
    try {
        const params = {
            app: 'CailianpressWeb',
            os: 'web',
            sv: '8.4.6',
            rn: '20',
            lastTime: Math.floor(Date.now() / 1000).toString()
        };

        // Sign generation (best guess, might fail without exact algo)
        const sign = generateSign(params);

        const response = await axios.get('https://www.cls.cn/nodeapi/telegraphList', {
            timeout: 8_000,
            params: { ...params, sign },
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
            title: item.title,
            content: item.content || item.title,
            time: item.ctime,
            source: 'cls',
            url: `https://www.cls.cn/detail/${item.id}`,
            tags: item.tags?.map((t: any) => t.tag_name)
        }));

        return { items };
    } catch (error: any) {
        console.error('CLS Fetch Error:', error);
        return { items: [], error: error.message };
    }
}
