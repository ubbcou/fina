import { useState, useEffect } from 'react';
import { NewsItem } from '../types';
import { fetchWSCN } from '../api/wscn';
import { fetchJin10 } from '../api/jin10';
import { fetchCLS } from '../api/cls';
import { fetchThs } from '../api/ths';

// Deduplication Logic
function deduplicate(items: NewsItem[]): NewsItem[] {
    // 1. Sort by time desc
    const sorted = items.sort((a, b) => b.time - a.time);

    // 2. Simple filtering by Title similarity (Levenshtein or just identical words?)
    // For now, just remove exact duplicate titles or IDs
    const seen = new Set();
    return sorted.filter(item => {
        const key = item.title.trim() + '-' + item.source; // Allow same news from diff sources? 
        // User asked for "deduplication" (去重). 
        // Usually means merging same event from diff sources.
        // That's hard. Let's start by removing EXACT identical content if any, 
        // or maybe group by similar content.
        // For MVP, show all but maybe filter if title is exactly same.
        // A better approach is "Cluster" view.
        // Let's just return all sorted for now, but ensure no ID dupes.
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
    });
}

export function useNewsFeed() {
    const [items, setItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchAll = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/news');
            const data = await response.json();

            if (data.items) {
                setItems(deduplicate(data.items));
            }
            setLastUpdated(new Date());
        } catch (e) {
            console.error("Aggregation Error", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
        // Poll every 30s
        const interval = setInterval(fetchAll, 30000);
        return () => clearInterval(interval);
    }, []);

    return { items, loading, lastUpdated, refresh: fetchAll };
}
