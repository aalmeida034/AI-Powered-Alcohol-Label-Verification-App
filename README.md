# AI‑Powered Alcohol Label Verification App  
**Full‑stack TTB Compliance Auditor • Next.js + FastAPI + Google Vision + Playwright**

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)

**Live Demo:** https://ai-powered-alcohol-label-verification-app.vercel.app  
**GitHub (Private):** https://github.com/aalmeida034/AI-Powered-Alcohol-Label-Verification-App

---

### Overview
A production‑grade take‑home project that **far exceeds** the original assignment.

This app simulates a real‑world TTB (Alcohol and Tobacco Tax and Trade Bureau) label verification workflow:
- User fills a simplified COLA‑style form
- Uploads a real alcohol label image
- AI (Google Cloud Vision) extracts text
- Smart fuzzy matching + exact Government Warning check
- Full mandatory TTB compliance audit (27 CFR Parts 4, 5, 7, 16)
- Instant visual feedback (green/red) + detailed report

---

### Features Delivered

| Feature                                   | Implemented |
|-------------------------------------------|-------------|
| Next.js 16 + Tailwind UI (App Router)     | Yes         |
| FastAPI backend with Google Vision OCR    | Yes         |
| Smart fuzzy matching (O/0, l/I, apostrophes, spacing) | Yes |
| Multi‑category support (Spirits, Wine, Beer) | Yes      |
| Exact Government Health Warning validation | Yes       |
| Complete TTB mandatory checklist audit with citations | Yes |
| Async form submission (no page reload)    | Yes         |
| Loading states & beautiful error handling | Yes         |
| End‑to‑end Playwright tests with real label images | Yes |
| Clean repo (no large files, no secrets)   | Yes         |
| Deployed on Vercel (frontend)             | Yes         |

---

### Screenshots

![Home Page](screenshots/home.png)  
*Landing page with form and image upload*

![Form Filled](screenshots/form-filled.png)  
*Example: Old Tom Distillery Bourbon*

![Success Result](screenshots/success.png)  
*Perfect match – all green*

![Compliance Report](screenshots/compliance-report.png)  
*Full TTB audit with regulatory citations*

![Playwright Test UI](screenshots/playwright-ui.png)  
*Automated E2E tests running in Playwright UI*

*(Drag your screenshots into a `screenshots/` folder and rename them accordingly)*

---

### Tech Stack

| Layer          | Technology                                 |
|----------------|--------------------------------------------|
| Frontend       | Next.js 16 (App Router), React Hook Form, Zod, Tailwind CSS |
| Backend        | FastAPI, Google Cloud Vision, Python 3.11  |
| Testing        | Playwright (E2E) with real label images    |
| Deployment     | Vercel (frontend) – live in 60 seconds     |
| Hosting        | Railway / Render (backend – optional)      |

---

### How to Run Locally

```bash
# Terminal 1 – Backend
uvicorn ocr:app --reload

# Terminal 2 – Frontend
npm run dev
# → http://localhost:3000

# Terminal 3 – Run tests (optional)
npx playwright test --ui
