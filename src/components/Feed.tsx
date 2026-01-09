"use client";

import React from 'react';
import { useNewsFeed } from '../lib/hooks/useNewsFeed';
import { NewsCard } from './NewsCard';
import { RefreshCw } from 'lucide-react';
import styles from '../styles/Feed.module.css';

export const Feed: React.FC = () => {
    const { items, loading, lastUpdated, refresh } = useNewsFeed();

    return (
        <div className={styles.feedContainer}>
            <div className={styles.statusBar}>
                <span>上次更新: {lastUpdated.toLocaleTimeString()}</span>
                <button className={styles.refreshBtn} onClick={refresh}>
                    <RefreshCw size={14} style={{ display: 'inline', marginRight: 4 }} />
                    刷新
                </button>
            </div>

            {loading && items.length === 0 ? (
                <div className={styles.loader}>加载中...</div>
            ) : (
                <div>
                    {items.map(item => (
                        <NewsCard key={item.id} item={item} />
                    ))}
                    {items.length === 0 && !loading && (
                        <div className={styles.loader}>暂无快讯</div>
                    )}
                </div>
            )}
        </div>
    );
};
