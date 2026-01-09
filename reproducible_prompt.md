# Master Prompt: Create Financial News Aggregator "FinaFlash"

**Role**: You are an expert Full-Stack Developer specializing in Next.js and Reverse Engineering.

**Objective**: Build a real-time financial news aggregator that consolidates "Flash News" (7x24快讯) from four major Chinese financial platforms: **Wallstreetcn (华尔街见闻)**, **Jin10 (金十数据)**, **Cailianpress (财联社)**, and **10jqka (同花顺)**.

**Tech Stack**:
- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS (CSS Modules) - *Do not use Tailwind CSS*
- **Icons**: Lucide React
- **HTTP Client**: Axios

---

## 1. Project Setup
Initialize a Next.js project with TypeScript and ESLint.
```bash
npx create-next-app@latest fina-flash --typescript --eslint --no-tailwind --src-dir --app
npm install axios clsx lucide-react date-fns
```

## 2. API Research & Reverse Engineering (Knowledge Base)
Use the following reverse-engineered endpoints and headers. *Note: These require specific headers to bypass anti-crawling.*

### A. Wallstreetcn (WSCN)
- **Endpoint**: `https://api-prod.wallstreetcn.com/apiv1/content/lives`
- **Params**: `channel=global-live`, `limit=20`
- **Headers**: standard User-Agent.

### B. Jin10 (金十数据)
- **Endpoint**: `https://flash-api.jin10.com/get_flash_list`
- **Params**: `channel=-24`, `vip=1`
- **Headers**:
  - `x-app-id`: `bVBF4FyRTn5NJF5n`
  - `x-version`: `1.0.0`

### C. Cailianpress (CLS)
- **Endpoint**: `https://www.cls.cn/nodeapi/telegraphList`
- **Params**: `app=CailianpressWeb`, `os=web`, `sv=8.4.6`, `rn=20`
- **Signature Logic**: Requires a `sign` parameter.
  - **Salt**: `37089408432360b098317781b212f718`
  - **Algo**: `MD5(SortedQueryString + Salt)` (Simplified)
  - *Fallback*: If signature fails, log error but attempt fetch.

### D. Tonghuashun (Ths)
- **Endpoint**: `https://news.10jqka.com.cn/tapp/news/push/stock/`
- **Header Requirement**: `hexin-v` (Dynamic token).
- **Strategy**: Try fetching with just User-Agent and Referer `https://news.10jqka.com.cn/realtimenews.html`. If 403, fail gracefully.

---

## 3. Architecture & Implementation

### A. Data Types ([src/lib/types.ts](file:///c:/Mine/Code/ai/fina/src/lib/types.ts))
Define a unified [NewsItem](file:///c:/Mine/Code/ai/fina/src/lib/types.ts#1-10) interface:
```typescript
interface NewsItem {
  id: string;
  source: 'wscn' | 'jin10' | 'cls' | 'ths';
  title: string;
  content: string;
  time: number; // Unix timestamp
  url: string;
}
```

### B. Fetcher Modules (`src/lib/api/*.ts`)
Create separate files for each source ([wscn.ts](file:///c:/Mine/Code/ai/fina/src/lib/api/wscn.ts), [jin10.ts](file:///c:/Mine/Code/ai/fina/src/lib/api/jin10.ts), etc.).
- Normalization: map raw API responses to [NewsItem](file:///c:/Mine/Code/ai/fina/src/lib/types.ts#1-10).
- Error Handling: Return empty array on failure, do not crash.

### C. Central API Route ([src/app/api/news/route.ts](file:///c:/Mine/Code/ai/fina/src/app/api/news/route.ts))
**CRITICAL**: Do not call external APIs directly from the client (Browser) to avoid CORS issues.
- Create a Next.js API Route.
- Parallel fetch all sources: `Promise.all([fetchWSCN(), fetchJin10(), ...])`.
- Deduplication: Merge lists and filter out items with identical titles or IDs.
- Sort by time descending.
- Return JSON: `{ items: [...] }`.

### D. Frontend Hook ([src/lib/hooks/useNewsFeed.ts](file:///c:/Mine/Code/ai/fina/src/lib/hooks/useNewsFeed.ts))
- Fetch from `/api/news` every 30 seconds (Polling).
- State management: `items`, `loading`, `lastUpdated`.

### E. UI Components
1. **[NewsCard.tsx](file:///c:/Mine/Code/ai/fina/src/components/NewsCard.tsx)** (CSS Module):
   - Display Source (colored badge), Time (relative), Title, Content (truncated).
   - Glassmorphism style: `backdrop-filter: blur(12px)`, semi-transparent background.
2. **[Feed.tsx](file:///c:/Mine/Code/ai/fina/src/components/Feed.tsx)**:
   - Render list of NewsCards.
   - "Refresh" button.
3. **[globals.css](file:///c:/Mine/Code/ai/fina/src/styles/globals.css)**:
   - Define variables for source colors (`--wscn-color`, etc.).
   - Dark mode theme (`#0f172a` background).

---

## 4. Execution Instructions
Please generate the full code for the above architecture, ensuring the UI looks premium (modern typography, subtle animations, dark theme).
