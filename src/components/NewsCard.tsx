import React from 'react';
import { NewsItem } from '../lib/types';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ExternalLink, Tag } from 'lucide-react';
import styles from '../styles/NewsCard.module.css';

interface NewsCardProps {
    item: NewsItem;
}

const sourceColors: Record<string, string> = {
    wscn: 'var(--wscn-color)',
    jin10: 'var(--jin10-color)',
    cls: 'var(--cls-color)',
    ths: 'var(--ths-color)'
};

const sourceNames: Record<string, string> = {
    wscn: '华尔街见闻',
    jin10: '金十数据',
    cls: '财联社',
    ths: '同花顺'
};

export const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.meta}>
                    <span
                        className={styles.source}
                        style={{ backgroundColor: sourceColors[item.source] || '#666' }}
                    >
                        {sourceNames[item.source] || item.source.toUpperCase()}
                    </span>
                    <span className={styles.time}>
                        {formatDistanceToNow(item.time * 1000, { addSuffix: true, locale: zhCN })}
                    </span>
                </div>
                <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--text-muted)' }}
                >
                    <ExternalLink size={16} />
                </a>
            </div>

            <h3 className={styles.title}>
                {item.title}
            </h3>

            {item.content && item.content !== item.title && (
                <p className={styles.content}>
                    {item.content.replace(/<[^>]*>?/gm, '')}
                </p>
            )}

            {item.tags && item.tags.length > 0 && (
                <div className={styles.tags}>
                    {item.tags.map((tag, idx) => (
                        <span key={idx} className={styles.tag}>
                            <Tag size={10} style={{ marginRight: 4 }} />
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};
