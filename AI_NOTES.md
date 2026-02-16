# AI Implementation Notes

**Author**: Umar Farooq

This document outlines how I utilized Artificial Intelligence to accelerate the development of the Research Brief Generator, detailing the division of labor between AI assistance and my own manual engineering.

## AI Model & Provider
**Provider**: Google Generative AI (Gemini)
**Model**: `gemini-2.5-flash-lite`

### Why I chose this stack
1.  **Performance/Cost**: I selected `gemini-2.5-flash-lite` for its superior balance of low latency and high reasoning capability, which is essential for processing multiple scraped articles in real-time.
2.  **JSON Reliability**: The model's native JSON mode was crucial for ensuring the backend always returns structured data that my React frontend can parse without error.

## AI Usage vs. Manual Work

### What I Used AI For:
Based on my development prompts, I leveraged AI to:
- **Architect the Solution**: Used AI to validate my step-by-step plan for building the app from scratch.
- **Select Tools**: Consulted AI to identify the best tools (like Firecrawl) for extracting clean content from URLs.
- **Refine UX/UI**: Generated suggestions for a clean "research theme" color palette and improved layout spacing for better usability.
- **Ensure Stability**: Asked AI to help identify edge cases where the API might return unexpected data, preventing crashes.
- **Documentation**: Accelerated the writing of standard documentation (README, etc.).

### What I Checked Manually:
- **Code Quality & Structure**: I manually reviewed and refactored the project structure to ensure it was clean and maintainable.
- **Security**: I personally verified that API keys (Firecrawl, Gemini) were correctly secured in environment variables and not exposed to the client.
- **Production Readiness**: I conducted the final review of the codebase, removing debug comments and unused files to ensure production readiness.
- **Verification**: I manually tested the application against real-world sources (news sites, forums) to verify the accuracy of the generated briefs.
