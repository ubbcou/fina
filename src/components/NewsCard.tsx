import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { NewsItem } from "../lib/types";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { ExternalLink, Tag, ChevronRight, Box, Share2 } from "lucide-react";
import html2canvas from "html2canvas";
import styles from "../styles/NewsCard.module.css";

// 常量定义
const RENDER_DELAY = 100; // 等待DOM渲染完成的延迟时间(ms)
const SHADOW_PADDING = 30; // 分享卡片阴影的padding(px)
const TOAST_DURATION = 3000; // Toast提示显示时长(ms)

interface NewsCardProps {
  item: NewsItem;
}

const sourceColors: Record<string, string> = {
  wscn: "var(--wscn-color)",
  jin10: "var(--jin10-color)",
  cls: "var(--cls-color)",
  ths: "var(--ths-color)",
  stcn: "#e60012", // Securities Times Red
};

const sourceNames: Record<string, string> = {
  wscn: "华尔街见闻",
  jin10: "金十数据",
  cls: "财联社",
  ths: "同花顺",
  stcn: "证券时报",
};

export const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const shareCardRef = useRef<HTMLDivElement>(null);

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

  const handleShare = async () => {
    if (isGeneratingShare || !shareCardRef.current) return;

    try {
      setIsGeneratingShare(true);

      // 等待一小段时间确保DOM渲染完成
      await new Promise((resolve) => setTimeout(resolve, RENDER_DELAY));

      // 使用html2canvas生成卡片内容
      const cardCanvas = await html2canvas(shareCardRef.current, {
        backgroundColor: null,
        scale: 2, // 提高清晰度
        logging: false,
        useCORS: true,
      });

      // 创建新的canvas，添加阴影
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = cardCanvas.width + SHADOW_PADDING * 2;
      finalCanvas.height = cardCanvas.height + SHADOW_PADDING * 2;

      const ctx = finalCanvas.getContext("2d");
      if (!ctx) throw new Error("无法获取canvas context");

      // 绘制阴影
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 10;

      // 绘制卡片内容
      ctx.drawImage(cardCanvas, SHADOW_PADDING, SHADOW_PADDING);

      // 将canvas转换为blob
      finalCanvas.toBlob(async (blob) => {
        if (blob) {
          try {
            // 复制到剪贴板
            await navigator.clipboard.write([
              new ClipboardItem({
                "image/png": blob,
              }),
            ]);

            // 显示成功提示
            setToastMessage("✓ 分享图片已复制到剪贴板");
            setShowToast(true);
            setTimeout(() => setShowToast(false), TOAST_DURATION);
          } catch (err) {
            console.error("复制到剪贴板失败:", err);
            // 如果剪贴板API失败，尝试下载图片
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `news-share-${item.id}.png`;
            a.click();
            URL.revokeObjectURL(url);

            // 显示下载提示
            setToastMessage("✓ 分享图片已下载到本地");
            setShowToast(true);
            setTimeout(() => setShowToast(false), TOAST_DURATION);
          }
        }
        setIsGeneratingShare(false);
      }, "image/png");
    } catch (error) {
      console.error("生成分享图片失败:", error);
      setToastMessage("✗ 生成分享图片失败，请重试");
      setShowToast(true);
      setTimeout(() => setShowToast(false), TOAST_DURATION);
      setIsGeneratingShare(false);
    }
  };

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
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleShare}
            className={styles.iconButton}
            title="分享"
            disabled={isGeneratingShare}
            style={{ opacity: isGeneratingShare ? 0.5 : 1 }}
          >
            <Share2 size={16} />
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconButton}
            title="打开原文"
          >
            <ExternalLink size={16} />
          </a>
        </div>
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
          document.body,
        )}

      {/* 隐藏的分享卡片，用于生成图片 */}
      <div ref={shareCardRef} className={styles.shareCardHidden}>
        {/* 外层容器用于容纳阴影 */}
        <div className={styles.shareCardContainer}>
          <div className={styles.shareCardWindow}>
            <div className={styles.shareCardTitleBar}>
              <div className={styles.shareCardButtons}>
                <span className={styles.shareCardButtonClose}></span>
                <span className={styles.shareCardButtonMinimize}></span>
                <span className={styles.shareCardButtonMaximize}></span>
              </div>
              <div className={styles.shareCardTitle}>分享</div>
            </div>
            <div className={styles.shareCardContent}>
              <div className={styles.shareCardHeader}>
                <span
                  className={styles.shareCardSource}
                  style={{
                    backgroundColor: sourceColors[item.source] || "#666",
                  }}
                >
                  {sourceNames[item.source] || item.source.toUpperCase()}
                </span>
                <span className={styles.shareCardTime}>
                  {format(item.time * 1000, "yyyy-MM-dd HH:mm:ss", {
                    locale: zhCN,
                  })}
                </span>
              </div>
              <h3 className={styles.shareCardContentTitle}>{item.title}</h3>
              {item.content && item.content !== item.title && (
                <p className={styles.shareCardContentText}>
                  {item.content.replace(/<[^>]*>?/gm, "")}
                </p>
              )}
              {item.tags && item.tags.length > 0 && (
                <div className={styles.shareCardTags}>
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className={styles.shareCardTag}>
                      <Tag size={10} style={{ marginRight: 4 }} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className={styles.shareCardFooter}>
                <span className={styles.shareCardHost}>
                  {typeof window !== "undefined"
                    ? window.location.hostname
                    : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast 提示 */}
      {showToast && <div className={styles.toast}>{toastMessage}</div>}
    </div>
  );
};
