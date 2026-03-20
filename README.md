# 🚀 Azure Document Intelligence Pro Dashboard

> A powerful, modern web dashboard for Azure AI Document Intelligence — extract text, tables, fields, and structured data from any document using Azure's prebuilt AI models.

![Azure AI](https://img.shields.io/badge/Azure-Document%20Intelligence-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## ✨ Features

- **📄 Multi-source Input** — Upload files, paste public URLs, or paste clipboard screenshots
- **🔍 Azure AI Analysis** — Supports `prebuilt-layout`, `prebuilt-read`, `prebuilt-invoice`, `prebuilt-receipt`, `prebuilt-idDocument`
- **📊 Rich Results Dashboard** — Overview stats, extracted text, structured fields, tables, and raw JSON
- **🖥 Side-by-Side Preview** — View document alongside extracted text simultaneously
- **📈 Confidence Score Charts** — Animated bar charts for field confidence levels
- **🕐 Analysis History** — Auto-saves last 20 analyses with one-click reload
- **🌙 Dark / Light Mode** — Fully themed toggle with preference persistence
- **⚡ Connection Tester** — Test your Azure credentials before analyzing
- **📋 Copy & Download** — Copy extracted text or download full JSON result
- **📱 Responsive Design** — Works on desktop and tablet

---

## 🛠 Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Structure & layout |
| CSS3 | Styling, animations, dark/light theme |
| Vanilla JavaScript | All logic, API calls, state management |
| Azure Document Intelligence API | AI document processing |
| Vercel | Deployment & hosting |

---

## 🚀 Getting Started

### Prerequisites
- An [Azure account](https://azure.microsoft.com/) with Document Intelligence resource
- Your Azure **Endpoint URL** and **API Key**

### Local Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/azure-docintel-pro.git

# Navigate to project
cd azure-docintel-pro

# Open in browser (no build step needed!)
open index.html
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo directly at [vercel.com](https://vercel.com) for auto-deploy on every push.

---

## ⚙️ Configuration

1. Enter your **Azure Endpoint** (e.g. `https://your-resource.cognitiveservices.azure.com`)
2. Enter your **Azure API Key**
3. Click **⚡ Test** to verify connection
4. Select a **Model** from the dropdown
5. Upload a file, paste a URL, or paste an image
6. Click **🔍 Analyze Now**

### Supported File Types

| Format | Extension |
|---|---|
| PDF | `.pdf` |
| Images | `.png`, `.jpg`, `.jpeg`, `.tiff`, `.bmp`, `.heic` |
| Office Documents | `.docx`, `.pptx`, `.xlsx` |

### Supported Models

| Model | Best For |
|---|---|
| `prebuilt-layout` | General documents, tables, text extraction |
| `prebuilt-read` | Plain text, OCR |
| `prebuilt-invoice` | Invoice data extraction |
| `prebuilt-receipt` | Receipt parsing |
| `prebuilt-idDocument` | ID cards, passports |

---

## 📁 Project Structure

```
azure-docintel-pro/
├── index.html       # Main HTML structure
├── style.css        # All styles, themes, animations
├── script.js        # JavaScript logic & API integration
├── vercel.json      # Vercel deployment config
└── README.md        # Project documentation
```

---

## 🔐 Security Note

> This is a frontend-only demo. Your API key is stored in browser `localStorage` and sent directly to Azure from the browser. For production use, always route API calls through a secure backend proxy to protect your credentials.

---

## 👥 Team

<table>
  <tr>
    <td align="center">
      <b>Aditya Sharma</b><br/>
      <i>Project Developer</i><br/>
      <a href="https://www.linkedin.com/in/aditya-sharma-a42a68293/">LinkedIn</a> ·
      <a href="mailto:dipanaditya0022@gmail.com">dipanaditya0022@gmail.com</a>
    </td>
    <td align="center">
      <b>Abhimanyu Sharma Sir</b><br/>
      <i>Project Mentor & Guide</i><br/>
      <a href="https://www.linkedin.com/in/017abhimanyu/">LinkedIn</a>
    </td>
  </tr>
</table>

---

## 📄 License

This project is for educational and personal use.

---

<p align="center">Made with ❤️ using Azure AI Document Intelligence</p>
