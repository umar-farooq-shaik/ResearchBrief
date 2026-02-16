# Research Brief Generator

A web application that generates structured research briefs from multiple URLs using AI.

## How to Run

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/umar-farooq-shaik/ResearchBrief
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    - Copy `.env.example` to `.env`
    - Add your API keys (`FIRECRAWL_API_KEY`, `GEMINI_API_KEY`, `VITE_SUPABASE_URL`, etc.)

4.  **Start the Backend**:
    ```bash
    npm run server:dev
    ```

5.  **Start the Frontend**:
    ```bash
    npm run dev
    ```

6.  **Open**: `http://localhost:8080`

## What is Done

### ✅ Frontend (UI/UX)
- **Modern Stack**: Built with **React** and **Vite** for fast performance.
- **Styling**: Uses **Tailwind CSS** and **Shadcn UI** for a clean, responsive, and professional aesthetic.
- **Key Pages**:
    - **Home**: URL input interface with multi-source support (paste up to 10 URLs).
    - **Brief View**: detailed research report with tabs for Summary, Findings, and Citations.
    - **Status Page**: Real-time health check for Database, AI API, and Scraper connections.
    - **History**: View previously generated briefs.

### ✅ Backend & API
- **Node.js Server**: Custom **Express** server handles the research pipeline.
- **Direct AI Integration**: Communicates with **Google Gemini API** (`gemini-2.5-flash-lite`).
- **Web Scraping**: Integrated **Firecrawl API** to extract clean markdown from complex websites.
- **Database**: **Supabase** (PostgreSQL) stores all briefs, source metadata, and analysis results.

### ✅ Core Features
- **Research Pipeline**: Automated workflow: `Input URLs -> Scrape Content -> AI Analysis -> Structured JSON`.
- **Fact Verification**: Generates a verification checklist with confidence scores for key claims.
- **Citation System**: Inline citations linking specific claims back to their source URLs.
- **Conflict Detection**: AI identifies and highlights conflicting information across different sources.

## What is Not Done
None (All features implemented)