import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { NewsItem } from "../lib/types";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { ExternalLink, Tag, ChevronRight, Box } from "lucide-react";
import styles from "../styles/NewsCard.module.css";

interface NewsCardProps {
  item: NewsItem;
}

const sourceColors: Record<string, string> = {
  wscn: "var(--wscn-color)",
  jin10: "var(--jin10-color)",
  cls: "var(--cls-color)",
  ths: "var(--ths-color)",
};

const sourceNames: Record<string, string> = {
  wscn: "华尔街见闻",
  jin10: "金十数据",
  cls: "财联社",
  ths: "同花顺",
};

export const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Prevent scrolling when modal is open
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.meta}>
          <span
            className={styles.source}
            style={{ backgroundColor: sourceColors[item.source] || "#666" }}
          >
            {sourceNames[item.source] || item.source.toUpperCase()}
          </span>
          <span className={styles.time}>
            {format(item.time * 1000, "yyyy-MM-dd HH:mm:ss", { locale: zhCN })}
          </span>
        </div>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--text-muted)" }}
        >
          <ExternalLink size={16} />
        </a>
      </div>

      <h3 className={styles.title}>{item.title}</h3>

      {item.content && item.content !== item.title && (
        <p className={styles.content}>
          {item.content.replace(/<[^>]*>?/gm, "")}
        </p>
      )}

      {item.pic && (
        <div
          className={styles.picContainer}
          onClick={() => item.fantiPic && setIsModalOpen(true)}
        >
          <img src={item.pic} alt="" className={styles.picThumbnail} />
          <div className={styles.picInfo}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {item.picTitle && <Box size={16} />}
              <span className={styles.picTitle}>{item.picTitle || ""}</span>
            </div>
            <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
          </div>
        </div>
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

      {isModalOpen &&
        item.fantiPic &&
        createPortal(
          <div
            className={styles.modalOverlay}
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={item.fantiPic}
                className={styles.modalImage}
                alt="Full view"
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
