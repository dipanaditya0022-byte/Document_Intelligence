# 🚀 Azure Document Intelligence Pro Dashboard

> A secure, production-ready web dashboard for Azure AI Document Intelligence — extract text, tables, fields, and structured data from any document using Azure’s prebuilt AI models.

![Azure AI](https://img.shields.io/badge/Azure-Document%20Intelligence-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## ✨ Features

- 📄 Multi-source Input — Upload files, paste public URLs, or clipboard screenshots
- 🔍 Azure AI Analysis — Supports prebuilt models like `prebuilt-layout`, `prebuilt-read`, `prebuilt-invoice`, `prebuilt-receipt`, and `prebuilt-idDocument`
- 📊 Rich Results Dashboard — View extracted text, structured fields, tables, stats, and raw JSON
- 🖥️ Side-by-Side Preview — See the document and extracted result together
- 📈 Confidence Score Visualization
- 🕐 Analysis History — Stores the latest 20 runs locally
- 🌙 Dark / Light Mode
- ⚡ Secure Connection Tester
- 📋 Copy extracted text and download JSON output
- 📱 Responsive UI
- 🔐 Secure Backend — Azure API key is never exposed to the browser

---

## 🛠 Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | UI structure |
| CSS3 | Styling, animations, themes |
| Vanilla JavaScript | Frontend logic |
| Vercel Serverless Functions | Secure backend API |
| Azure Document Intelligence | AI document processing |
| Vercel | Hosting and deployment |

---

## 🚀 Getting Started

### Prerequisites

- An Azure account with a Document Intelligence resource
- Azure Endpoint
- Azure API Key

---

## ⚙️ Environment Variables

Add these in:

**Vercel → Project → Settings → Environment Variables**

```env
AZURE_ENDPOINT=https://your-resource.cognitiveservices.azure.com
AZURE_API_KEY=your_api_key_here