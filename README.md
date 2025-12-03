# AI‑Powered Alcohol Label Verification App
**Full‑stack TTB Compliance Auditor • Next.js + FastAPI + Google Vision + Playwright**

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Google Cloud Vision](https://img.shields.io/badge/Google_Cloud_Vision-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)
![ngrok](https://img.shields.io/badge/ngrok-1f1e37?style=for-the-badge&logo=ngrok&logoColor=white)

**Live Demo Hosted on ngrok:**  
https://lona-oxycephalic-matilde.ngrok-free.dev 

You can use sample figures found in /tests/fixtures

**GitHub:** 

https://github.com/aalmeida034/AI-Powered-Alcohol-Label-Verification-App

---
### Overview
A **production-grade**, self-hosted TTB (Alcohol and Tobacco Tax and Trade Bureau) label verification tool that runs 100% from your own computer or remotely.

- Upload any alcohol label image
- AI extracts text using Google Cloud Vision
- Smart fuzzy matching + exact Government Warning check
- Full mandatory TTB compliance audit (27 CFR Parts 4, 5, 7, 16)
- Instant visual feedback + detailed regulatory report

## Justification for using EasyOCR & Google Cloud Vision API

Standard OCR engines (Tesseract.js, Pytesseract, etc.) are optimised for flat, straight text. Curved text introduces several mathematical challenges:

- **Cylindrical projection distortion** – Text follows an arc, where i is the character index and α is angular spacing. These effects cause standard OCR pipelines to produce very low recall and high CER on bottle labels, stamps, and other cylindrical objects unless specialised curved-text models.  This can typically be parameterised as:  
  ```math
  x' = r \cos(\theta + \alpha \cdot i), \quad y' = r \sin(\theta + \alpha \cdot i) + y_{\text{offset}}
---
## Dewarping Techniques for Curved/Cylindrical Text

| Method                          | Core Idea                                                                 | Pros                                      | Cons / Limitations                            | Best For                               | Open-Source Example |
|---------------------------------|---------------------------------------------------------------------------|-------------------------------------------|-----------------------------------------------|----------------------------------------|---------------------|
| **1. Arc/Circle Fitting + Polar Transform** | Fit a circle/arc to the text baseline → unwrap into polar coordinates → rectify to rectangle | Simple, fast, works well if text is on a clean arc | Fails on wavy/multi-line text, needs accurate arc | Single-line bottle neck labels         | OpenCV + custom script |
| **2. Cylindrical Unwrapping (known radius)** | Assume known bottle radius → back-project image onto cylinder → flatten | Physically accurate for true cylinders    | Requires known radius + camera intrinsics     | Controlled industrial setups           | OpenCV `warpPerspective` with cylinder map |
| **3. Baseline Regression + Thin-Plate Spline (TPS)** | Detect text baseline points → fit spline → use TPS to straighten image   | Handles mild curves and waves well        | Struggles with very tight curves or 360° text | Slightly curved labels                 | DeepReg, DocTr (TPS branch) |
| **4. Fourier-based Dewarping**  | Model distorted baseline with Fourier descriptors → invert distortion     | Mathematically elegant, few parameters    | Sensitive to noise, poor on non-smooth curves | Smooth arcs                            | DewarpNet (early versions) |
| **5. Learning-based Geometric Rectification** | CNN predicts pixel-wise flow field or Bézier control points to flatten   | State-of-the-art accuracy, handles complex curves | Needs training data + GPU inference       | Arbitrary curved text (bottles, books) | DewarpNet, DocTr, GeomNet, PWCN, MARCN |
| **6. Curved-Text Native Models (no dewarping)** | Directly detect & recognise curved text using polygons/Béziers (ABCNet, TextSnake, SA-Text) | Avoids error-prone dewarping step         | Usually slower, lower maturity than flat OCR  | When you can replace Tesseract entirely| ABCNet v2, TextRay, SATRN (curved branch) |
### Features Delivered
| Feature                                  | Status |
|------------------------------------------|--------|
| Next.js 15 + Tailwind (App Router)       | Yes    |
| FastAPI OCR backend with Google Vision   | Yes    |
| Smart fuzzy matching (O/0, l/I, spacing) | Yes    |
| Multi-category (Spirits, Wine, Beer)     | Yes    |
| Exact Government Health Warning check    | Yes    |
| Full TTB compliance audit with citations | Yes    |
| Local proxy (`/api/proxy/ocr`)           | Yes    |
| Large file support (10MB+)               | Yes    |
| Runs 100% locally with ngrok tunneling   | Yes    |
| End-to-end Playwright tests              | Yes    |

---
## Screenshots

### Home page

<img width="440" height="958" alt="Screenshot 2025-12-02 160926" src="https://github.com/user-attachments/assets/cf040f74-6682-4e36-a000-58434aa96a11" />

*Home page sample*

### Good results

<img width="432" height="359" alt="green" src="https://github.com/user-attachments/assets/10a7c12b-f571-4037-963d-acca42d506b6" />

*Perfect match – all green*

### Sample Compliance Audit

<img width="434" height="970" alt="success" src="https://github.com/user-attachments/assets/b69bfd48-8236-4c0a-b0ea-5d443bf774f7" />

*Full TTB audit with regulatory citations*

### Unit Testing Sample

<img width="944" height="595" alt="unit_test" src="https://github.com/user-attachments/assets/1838d7ec-6a6f-4cea-8cd7-da5d41d0b1a2" />

---
### How to Run Locally & Make It Public

```bash
# 1. Clone and install
git clone https://github.com/aalmeida034/AI-Powered-Alcohol-Label-Verification-App.git
cd AI-Powered-Alcohol-Label-Verification-App
npm install

# 2. Terminal 1 – Start FastAPI OCR backend
cd src/api
uvicorn ocr:app --host 0.0.0.0 --port 8000 --reload

# 3. Terminal 2 – Start Next.js frontend (production mode)
cd ../../
npm run build
npm run start

# 4. Terminal 3 – Expose to the internet with ngrok
ngrok http 3000

# 5. Unit Testing Example
npx playwright test --ui

Or 

Headless Example
npx playwright test

Specific Example
npx playright test "Beer Label"
