# 🚀 Azure Document Intelligence Pro Dashboard

> A secure, production-ready web dashboard for Azure AI Document Intelligence — extract text, tables, fields, and structured data from any document using Azure’s prebuilt AI models.

![Azure AI](https://img.shields.io/badge/Azure-Document%20Intelligence-0078D4?style=for-the-badge\&logo=microsoft-azure\&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge\&logo=html5\&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge\&logo=css3\&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge\&logo=vercel\&logoColor=white)

---

## ✨ Features

* 📄 Multi-source Input — Upload files, paste public URLs, or clipboard screenshots
* 🔍 Azure AI Analysis — Supports prebuilt models (layout, read, invoice, receipt, ID)
* 📊 Rich Results Dashboard — Text, tables, fields, stats, JSON
* 🖥 Side-by-Side Preview
* 📈 Confidence Score Charts
* 🕐 Analysis History (last 20 runs)
* 🌙 Dark / Light Mode
* ⚡ Secure Connection Tester
* 📋 Copy & Download results
* 📱 Responsive UI
* 🔐 Secure Backend — API key never exposed

---

## 🛠 Tech Stack

| Technology                  | Usage                |
| --------------------------- | -------------------- |
| HTML5                       | UI structure         |
| CSS3                        | Styling & themes     |
| Vanilla JavaScript          | Frontend logic       |
| Vercel Serverless Functions | Secure backend API   |
| Azure Document Intelligence | AI processing        |
| Vercel                      | Hosting & deployment |

---

## 🚀 Getting Started

### 🔹 Prerequisites

* Azure account with Document Intelligence resource
* Azure Endpoint
* Azure API Key

---

## ⚙️ Environment Variables (Vercel)

Add these in:

👉 **Vercel → Project → Settings → Environment Variables**

```
AZURE_ENDPOINT=https://your-resource.cognitiveservices.azure.com
AZURE_API_KEY=your_api_key_here
```

---

## 🚀 Deploy to Vercel

### ✅ GitHub Integration (Recommended)

1. Push repo to GitHub
2. Import project at https://vercel.com
3. Add environment variables
4. Deploy 🎉

---

## 📁 Project Structure

```
azure-docintel-pro/
├── index.html
├── style.css
├── script.js
├── api/
│   ├── analyze.js   # Secure analyze endpoint
│   └── test.js      # Secure connection test endpoint
├── vercel.json
└── README.md
```

---

## 🔐 Security

This project uses **Vercel Serverless Functions** as a secure backend proxy.

✔ Azure API key stored only in server environment variables
✔ Never exposed to browser
✔ Safe for public deployment

### 🔄 Request Flow

```
User → Website → Vercel API → Azure → Result → User
```

---

## 📂 Supported File Types

| Format      | Extension                             |
| ----------- | ------------------------------------- |
| PDF         | .pdf                                  |
| Images      | .png, .jpg, .jpeg, .tiff, .bmp, .heic |
| Office Docs | .docx, .pptx, .xlsx                   |

---

## 🤖 Supported Models

| Model               | Best For            |
| ------------------- | ------------------- |
| prebuilt-layout     | General documents   |
| prebuilt-read       | OCR text extraction |
| prebuilt-invoice    | Invoice parsing     |
| prebuilt-receipt    | Receipt parsing     |
| prebuilt-idDocument | IDs & passports     |

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

Educational and personal use.

---

<p align="center">Made with ❤️ using Azure AI Document Intelligence</p>
