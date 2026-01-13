export interface NewsItem {
    id: string;
    title: string;
    content: string;
    time: number; // Unix timestamp in seconds
    source: 'cls' | 'wscn' | 'jin10' | 'ths';
    url: string;
    tags?: string[];
    pic?: string;
    fantiPic?: string;
    picTitle?: string;
}

export interface FetchResult {
    items: NewsItem[];
    error?: string;
}
