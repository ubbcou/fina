import { NextResponse } from 'next/server';
import { fetchWSCN } from '@/lib/api/wscn';
import { fetchJin10 } from '@/lib/api/jin10';
import { fetchCLS } from '@/lib/api/cls';
import { fetchThs } from '@/lib/api/ths';
import { fetchSTCN } from '@/lib/api/stcn';
import { NewsItem } from '@/lib/types';

export const dynamic = 'force-dynamic'; // No caching for live news

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const source = searchParams.get('source');

        let items: NewsItem[] = [];

        // Parallel fetch
        const [wscn, jin10, cls, ths, stcn] = await Promise.all([
            fetchWSCN(),
            fetchJin10(),
            fetchCLS(),
            fetchThs(),
            fetchSTCN()
        ]);

        // Handle errors or empty results silently by just logging
        if (wscn.error) console.error('WSCN Error:', wscn.error);
        if (jin10.error) console.error('Jin10 Error:', jin10.error);
        if (cls.error) console.error('CLS Error:', cls.error);
        if (ths.error) console.error('Ths Error:', ths.error);
        if (stcn.error) console.error('STCN Error:', stcn.error);

        items = [
            ...wscn.items,
            ...jin10.items,
            ...cls.items,
            ...ths.items,
            ...stcn.items
        ];

        // Sort by time descending
        items.sort((a, b) => b.time - a.time);

        return NextResponse.json({
            items,
            status: 'ok',
            timestamp: Date.now()
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
