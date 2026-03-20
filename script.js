const API_VERSION = "2024-11-30";
const STORAGE_KEY = "azure_docintel_pro_v3";
const HISTORY_KEY = "azure_docintel_history_v3";

const endpointEl = document.getElementById("endpoint");
const apiKeyEl = document.getElementById("apiKey");
const modelIdEl = document.getElementById("modelId");
const localeEl = document.getElementById("locale");
const pagesEl = document.getElementById("pages");
const stringIndexTypeEl = document.getElementById("stringIndexType");
const fileInput = document.getElementById("fileInput");
const dropzone = document.getElementById("dropzone");
const fileCard = document.getElementById("fileCard");
const urlSourceEl = document.getElementById("urlSource");
const pasteBoxEl = document.getElementById("pasteBox");
const pastePreview = document.getElementById("pastePreview");
const pastePreviewImg = document.getElementById("pastePreviewImg");
const testBtn = document.getElementById("testBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const saveConfigBtn = document.getElementById("saveConfigBtn");
const copyTextBtn = document.getElementById("copyTextBtn");
const downloadJsonBtn = document.getElementById("downloadJsonBtn");
const clearBtn = document.getElementById("clearBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const themeToggle = document.getElementById("themeToggle");
const statusBadge = document.getElementById("statusBadge");
const statusText = document.getElementById("statusText");
const progressBar = document.getElementById("progressBar");
const metaPages = document.getElementById("metaPages");
const metaModel = document.getElementById("metaModel");
const metaStatus = document.getElementById("metaStatus");
const textOutput = document.getElementById("textOutput");
const splitTextOutput = document.getElementById("splitTextOutput");
const fieldsOutput = document.getElementById("fieldsOutput");
const tablesOutput = document.getElementById("tablesOutput");
const jsonOutput = document.getElementById("jsonOutput");
const overviewDetails = document.getElementById("overviewDetails");
const heroSource = document.getElementById("heroSource");
const heroModel = document.getElementById("heroModel");
const topbarSource = document.getElementById("topbarSource");
const topbarModel = document.getElementById("topbarModel");
const inputSummary = document.getElementById("inputSummary");
const resultSummary = document.getElementById("resultSummary");
const operationId = document.getElementById("operationId");
const historyList = document.getElementById("historyList");
const docPreviewArea = document.getElementById("docPreviewArea");
const statPages = document.getElementById("statPages");
const statWords = document.getElementById("statWords");
const statTables = document.getElementById("statTables");
const ovPages = document.getElementById("ovPages");
const ovWords = document.getElementById("ovWords");
const ovTables = document.getElementById("ovTables");
const ovDocs = document.getElementById("ovDocs");
const connStatus = document.getElementById("connStatus");
const connDot = document.getElementById("connDot");
const connLabel = document.getElementById("connLabel");

let selectedFile = null;
let pastedImageBlob = null;
let pastedImageName = null;
let lastResult = null;
let activeSourcePane = "uploadPane";
let isDark = true;
let analysisHistory = [];

init();

function init() {
  loadSavedConfig(); loadHistory(); wireTabs(); wireSourceModes();
  wireUpload(); wirePaste(); wireButtons(); wireTheme();
  resetResults(); updateSourceSummary(); renderHistory();
}

function wireTheme() {
  const saved = localStorage.getItem("docintel_theme");
  if (saved === "light") applyTheme(false);
  themeToggle.addEventListener("click", () => applyTheme(isDark));
}
function applyTheme(toLight) {
  isDark = !toLight;
  document.body.classList.toggle("light-mode", toLight);
  themeToggle.textContent = toLight ? "🌙" : "☀️";
  localStorage.setItem("docintel_theme", toLight ? "light" : "dark");
}

function wireTabs() {
  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });
}

function wireSourceModes() {
  document.querySelectorAll("#sourceTabs button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#sourceTabs button").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".source-pane").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.src).classList.add("active");
      activeSourcePane = btn.dataset.src;
      updateSourceSummary();
    });
  });
}

function wireUpload() {
  dropzone.addEventListener("click", () => fileInput.click());
  ["dragenter","dragover"].forEach(evt => dropzone.addEventListener(evt, e => { e.preventDefault(); dropzone.classList.add("dragover"); }));
  ["dragleave","drop"].forEach(evt => dropzone.addEventListener(evt, e => { e.preventDefault(); dropzone.classList.remove("dragover"); }));
  dropzone.addEventListener("drop", e => { const f = e.dataTransfer.files?.[0]; if (f) setSelectedFile(f); });
  fileInput.addEventListener("change", e => { const f = e.target.files?.[0]; if (f) setSelectedFile(f); });
}

function setSelectedFile(file) {
  selectedFile = file;
  fileCard.style.display = "block";
  fileCard.innerHTML = `<strong>${escapeHtml(file.name)}</strong><br>${(file.size/1024/1024).toFixed(2)} MB · ${escapeHtml(file.type||"unknown")}`;
  updateDocPreview(file);
  updateSourceSummary();
}

function updateDocPreview(file) {
  if (!file) { docPreviewArea.innerHTML = `<div class="doc-preview-empty"><div class="icon">📁</div>Upload a document to preview it here</div>`; return; }
  if (file.type.startsWith("image/")) {
    docPreviewArea.innerHTML = `<img src="${URL.createObjectURL(file)}" style="max-width:100%;border-radius:10px;border:1px solid var(--line);" alt="Preview"/>`;
  } else if (file.type === "application/pdf") {
    docPreviewArea.innerHTML = `<iframe src="${URL.createObjectURL(file)}" style="width:100%;height:500px;border:none;border-radius:10px;"></iframe>`;
  } else {
    docPreviewArea.innerHTML = `<div class="doc-preview-empty"><div class="icon">📄</div><div>${escapeHtml(file.name)}</div><div style="font-size:10px;margin-top:3px;color:var(--text3);">${escapeHtml(file.type||"document")}</div></div>`;
  }
}

function wirePaste() {
  pasteBoxEl.addEventListener("paste", e => {
    const imgItem = Array.from(e.clipboardData?.items||[]).find(i => i.type.startsWith("image/"));
    if (!imgItem) return;
    const blob = imgItem.getAsFile();
    if (!blob) return;
    pastedImageBlob = blob;
    pastedImageName = `pasted-image-${Date.now()}.png`;
    pastePreviewImg.src = URL.createObjectURL(blob);
    pastePreview.style.display = "block";
    pasteBoxEl.value = "[Image pasted from clipboard]";
    updateSourceSummary();
  });
}

function wireButtons() {
  testBtn.addEventListener("click", testConnection);
  saveConfigBtn.addEventListener("click", saveConfig);
  analyzeBtn.addEventListener("click", analyzeDocument);
  copyTextBtn.addEventListener("click", copyExtractedText);
  downloadJsonBtn.addEventListener("click", downloadJson);
  clearBtn.addEventListener("click", clearAll);
  clearHistoryBtn.addEventListener("click", clearHistory);
  [endpointEl, apiKeyEl, modelIdEl, urlSourceEl].forEach(el => el.addEventListener("input", updateSourceSummary));
}

function saveConfig() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    endpoint: endpointEl.value.trim(), apiKey: apiKeyEl.value.trim(),
    modelId: modelIdEl.value, locale: localeEl.value.trim(),
    pages: pagesEl.value.trim(), stringIndexType: stringIndexTypeEl.value
  }));
  setStatus("Saved", "good", "Configuration saved locally");
}

function loadSavedConfig() {
  try {
    const cfg = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    endpointEl.value = cfg.endpoint || "https://adityash123.cognitiveservices.azure.com";
    apiKeyEl.value = cfg.apiKey || "";
    modelIdEl.value = cfg.modelId || "prebuilt-layout";
    localeEl.value = cfg.locale || "";
    pagesEl.value = cfg.pages || "";
    stringIndexTypeEl.value = cfg.stringIndexType || "textElements";
  } catch { endpointEl.value = "https://adityash123.cognitiveservices.azure.com"; }
}

function updateSourceSummary() {
  const model = modelIdEl.value || "—";
  heroModel.textContent = model; topbarModel.textContent = model;
  if (activeSourcePane === "uploadPane") {
    const name = selectedFile ? selectedFile.name : "Upload mode";
    heroSource.textContent = name; topbarSource.textContent = selectedFile ? name : "Upload";
    inputSummary.textContent = selectedFile ? `📁 ${name}` : "Upload a file to begin";
  } else if (activeSourcePane === "urlPane") {
    const val = urlSourceEl.value.trim();
    heroSource.textContent = val ? "Public URL" : "URL mode"; topbarSource.textContent = val ? "URL" : "URL mode";
    inputSummary.textContent = val ? "🌐 URL ready" : "Paste a public URL";
  } else {
    heroSource.textContent = pastedImageBlob ? "Pasted image" : "Paste mode";
    topbarSource.textContent = pastedImageBlob ? "Pasted" : "Paste";
    inputSummary.textContent = pastedImageBlob ? "📋 Pasted image ready" : "Paste an image from clipboard";
  }
}

function setConnStatus(type, label) {
  connStatus.style.display = "flex";
  connDot.className = `conn-dot ${type}`;
  connLabel.textContent = label;
}

function setStatus(label, type, msg) {
  statusBadge.textContent = label; statusBadge.className = `badge ${type}`;
  statusText.textContent = msg; metaStatus.textContent = label;
}
function setProgress(v) { progressBar.style.width = `${Math.max(0, Math.min(100, v))}%`; }

function resetResults() {
  lastResult = null;
  textOutput.textContent = "No text yet."; splitTextOutput.textContent = "No text extracted yet.";
  fieldsOutput.innerHTML = `<div class="placeholder"><div class="pl-icon">🏷</div>No fields extracted yet.</div>`;
  tablesOutput.innerHTML = `<div class="placeholder"><div class="pl-icon">📋</div>No tables detected yet.</div>`;
  jsonOutput.textContent = "No JSON yet.";
  metaPages.textContent="—"; metaModel.textContent="—"; metaStatus.textContent="—";
  statPages.textContent="—"; statWords.textContent="—"; statTables.textContent="—";
  ovPages.textContent="—"; ovWords.textContent="—"; ovTables.textContent="—"; ovDocs.textContent="—";
  resultSummary.textContent = "No result yet"; operationId.textContent = "—";
  overviewDetails.innerHTML = `<div class="placeholder"><div class="pl-icon">🧠</div>Analyze a document to see results here.</div>`;
  copyTextBtn.disabled = true; downloadJsonBtn.disabled = true; setProgress(0);
}

function clearAll() {
  selectedFile = null; pastedImageBlob = null; pastedImageName = null;
  fileInput.value = ""; urlSourceEl.value = ""; pasteBoxEl.value = "";
  fileCard.style.display = "none"; fileCard.innerHTML = "";
  pastePreview.style.display = "none"; pastePreviewImg.src = "";
  docPreviewArea.innerHTML = `<div class="doc-preview-empty"><div class="icon">📁</div>Upload a document to preview it here</div>`;
  resetResults(); setStatus("Idle", "warn", "Waiting for input");
  heroSource.textContent = "No source selected"; topbarSource.textContent = "No source";
  inputSummary.textContent = "No input selected"; updateSourceSummary();
}

function loadHistory() { try { analysisHistory = JSON.parse(localStorage.getItem(HISTORY_KEY)||"[]"); } catch { analysisHistory = []; } }
function saveHistory() { localStorage.setItem(HISTORY_KEY, JSON.stringify(analysisHistory.slice(0,20))); }
function addToHistory(e) { analysisHistory.unshift(e); if(analysisHistory.length>20) analysisHistory.pop(); saveHistory(); renderHistory(); }
function clearHistory() { analysisHistory = []; saveHistory(); renderHistory(); }

function renderHistory() {
  if (!analysisHistory.length) { historyList.innerHTML = `<div class="placeholder" style="min-height:70px;font-size:11px;"><div class="pl-icon" style="font-size:22px;">📂</div>No history yet</div>`; return; }
  historyList.innerHTML = analysisHistory.map((h,i) => `
    <div class="history-item fade-in" data-index="${i}">
      <div class="history-dot ${h.status==='Succeeded'?'':'failed'}"></div>
      <div class="history-info">
        <div class="history-name">${escapeHtml(h.name)}</div>
        <div class="history-meta">${escapeHtml(h.model)} · ${escapeHtml(h.time)}</div>
      </div>
      <div class="history-badge">${escapeHtml(String(h.pages||'?'))}p</div>
    </div>`).join("");
  historyList.querySelectorAll(".history-item").forEach(el => {
    el.addEventListener("click", () => {
      const entry = analysisHistory[+el.dataset.index];
      if (entry?.result) { lastResult=entry.result; renderResult(entry.result,entry.model); setStatus("Loaded","good",`Loaded: ${entry.name}`); setProgress(100); copyTextBtn.disabled=false; downloadJsonBtn.disabled=false; }
    });
  });
}

function getCurrentSource() {
  if (activeSourcePane==="uploadPane" && selectedFile) return {type:"file",file:selectedFile};
  if (activeSourcePane==="urlPane" && urlSourceEl.value.trim()) return {type:"url",url:urlSourceEl.value.trim()};
  if (activeSourcePane==="pastePane" && pastedImageBlob) return {type:"file",file:new File([pastedImageBlob],pastedImageName||"pasted.png",{type:pastedImageBlob.type||"image/png"})};
  return null;
}

function normalizeEndpoint(raw) {
  let v = raw.trim().replace(/\/+$/,"");
  v = v.replace(/\/documentintelligence.*$/i,""); v = v.replace(/\/formrecognizer.*$/i,""); return v;
}

async function analyzeDocument() {
  const endpoint=normalizeEndpoint(endpointEl.value), apiKey=apiKeyEl.value.trim();
  const modelId=modelIdEl.value.trim(), locale=localeEl.value.trim();
  const pages=pagesEl.value.trim(), stringIndexType=stringIndexTypeEl.value.trim();
  if (!endpoint||!apiKey) { alert("Please enter Azure endpoint and API key."); return; }
  const source = getCurrentSource();
  if (!source) { alert("Please provide a source: upload file, public URL, or pasted image."); return; }
  analyzeBtn.disabled=true; resetResults();
  setStatus("Submitting","warn","Sending request to Azure..."); setProgress(12); metaModel.textContent=modelId;
  const sourceName = source.type==="url" ? source.url : (source.file?.name||"Pasted image");
  try {
    const opLocation = await submitAnalyzeRequest({endpoint,apiKey,modelId,locale,pages,stringIndexType,source});
    operationId.textContent = extractOperationId(opLocation)||"active";
    setStatus("Processing","warn","Azure is analyzing..."); setProgress(32);
    const result = await pollAnalyzeResult(opLocation,apiKey);
    lastResult=result; renderResult(result,modelId);
    setStatus("Succeeded","good","Analysis completed! 🎉"); setProgress(100);
    copyTextBtn.disabled=false; downloadJsonBtn.disabled=false;
    const ar=result.analyzeResult||{};
    addToHistory({name:sourceName.length>40?sourceName.substring(0,40)+"…":sourceName,model:modelId,time:new Date().toLocaleTimeString(),pages:(ar.pages||[]).length,status:"Succeeded",result});
  } catch(err) {
    console.error(err); setStatus("Failed","bad",err.message||"Something went wrong"); setProgress(100);
    jsonOutput.textContent=JSON.stringify({error:err.message||String(err)},null,2); resultSummary.textContent="Failed";
    addToHistory({name:sourceName.length>40?sourceName.substring(0,40)+"…":sourceName,model:modelId,time:new Date().toLocaleTimeString(),pages:"?",status:"Failed",result:null});
  } finally { analyzeBtn.disabled=false; }
}

async function submitAnalyzeRequest({endpoint,apiKey,modelId,locale,pages,stringIndexType,source}) {
  const cleanEndpoint=normalizeEndpoint(endpoint);
  const qs=new URLSearchParams({"api-version":API_VERSION});
  if(locale) qs.set("locale",locale); if(pages) qs.set("pages",pages); if(stringIndexType) qs.set("stringIndexType",stringIndexType);
  const url=`${cleanEndpoint}/documentintelligence/documentModels/${encodeURIComponent(modelId)}:analyze?${qs.toString()}`;
  console.log("Analyze URL:",url);
  let response;
  if(source.type==="url") {
    response=await fetch(url,{method:"POST",headers:{"Ocp-Apim-Subscription-Key":apiKey,"Content-Type":"application/json"},body:JSON.stringify({urlSource:source.url})});
  } else {
    const ab=await source.file.arrayBuffer();
    response=await fetch(url,{method:"POST",headers:{"Ocp-Apim-Subscription-Key":apiKey,"Content-Type":source.file.type||"application/octet-stream"},body:ab});
  }
  const responseText=await safeText(response);
  if(!response.ok && response.status!==202) throw new Error(`Analyze request failed (${response.status}): ${responseText}`);
  const opLoc=response.headers.get("Operation-Location")||response.headers.get("operation-location");
  if(!opLoc) throw new Error(`Operation-Location not found. ${responseText}`);
  return opLoc;
}

async function testConnection() {
  const endpoint=normalizeEndpoint(endpointEl.value), apiKey=apiKeyEl.value.trim();
  if(!endpoint||!apiKey) { alert("Please enter Azure endpoint and API key."); return; }
  setConnStatus("testing","Testing connection..."); setStatus("Testing","warn","Checking Azure connection..."); setProgress(20);
  try {
    const url=`${endpoint}/documentintelligence/documentModels?api-version=${API_VERSION}`;
    const res=await fetch(url,{method:"GET",headers:{"Ocp-Apim-Subscription-Key":apiKey}});
    const text=await safeText(res);
    if(!res.ok) { setConnStatus("bad",`Failed (${res.status})`); setStatus("Failed","bad",`Connection failed (${res.status})`); jsonOutput.textContent=text; setProgress(100); return; }
    let data; try{data=JSON.parse(text);}catch{data=text;}
    setConnStatus("good","Connected ✓"); setStatus("Connected ✓","good","Azure resource is reachable!");
    jsonOutput.textContent=typeof data==="string"?data:JSON.stringify(data,null,2); setProgress(100);
  } catch(err) {
    setConnStatus("bad","Connection failed"); setStatus("Failed","bad",err.message||"Connection test failed");
    jsonOutput.textContent=JSON.stringify({error:err.message||String(err)},null,2); setProgress(100);
  }
}

async function pollAnalyzeResult(operationLocation,apiKey) {
  for(let i=1;i<=60;i++) {
    setProgress(Math.min(32+i*1.1,94)); setStatus("Processing","warn",`Polling... attempt ${i}/60`);
    const res=await fetch(operationLocation,{headers:{"Ocp-Apim-Subscription-Key":apiKey}});
    const data=await res.json().catch(()=>({}));
    if(!res.ok) throw new Error(`Polling failed (${res.status}): ${JSON.stringify(data,null,2)}`);
    const status=String(data.status||"").toLowerCase();
    if(status==="succeeded") return data;
    if(status==="failed"||status==="partiallyfailed") throw new Error(`Analysis failed: ${JSON.stringify(data,null,2)}`);
    await sleep(1800);
  }
  throw new Error("Timed out waiting for Azure result.");
}

function renderResult(result,selectedModelId) {
  const ar=result.analyzeResult||{}, pages=ar.pages||[], tables=ar.tables||[], documents=ar.documents||[];
  const text=getFullText(result), words=countWords(text);
  jsonOutput.textContent=JSON.stringify(result,null,2);
  textOutput.textContent=text||"No text extracted."; splitTextOutput.textContent=text||"No text extracted.";
  metaPages.textContent=pages.length||"0"; metaModel.textContent=ar.modelId||selectedModelId||"—";
  heroModel.textContent=ar.modelId||selectedModelId||"—"; topbarModel.textContent=ar.modelId||selectedModelId||"—";
  resultSummary.textContent=`Pages: ${pages.length||0} · Tables: ${tables.length||0} · Docs: ${documents.length||0}`;
  statPages.textContent=pages.length||"0"; statWords.textContent=words.toLocaleString(); statTables.textContent=tables.length||"0";
  ovPages.textContent=pages.length||"0"; ovWords.textContent=words.toLocaleString(); ovTables.textContent=tables.length||"0"; ovDocs.textContent=documents.length||"0";
  renderOverviewDetails(ar,documents,selectedModelId); renderFields(documents); renderTables(tables);
}

function renderOverviewDetails(ar,documents,selectedModelId) {
  const langs=(ar.languages||[]).map(x=>x.locale||x.language||"").filter(Boolean);
  const allFields=[];
  documents.forEach(doc=>{ Object.entries(doc.fields||{}).forEach(([name,field])=>{ if(typeof field?.confidence==="number") allFields.push({name,confidence:field.confidence}); }); });
  const confBars=allFields.length?`<div class="card" style="margin-top:14px;"><div class="card-title">📈 Confidence Scores</div><div class="conf-chart">${allFields.slice(0,12).map(f=>`<div class="conf-bar-row"><div class="conf-label">${escapeHtml(f.name)}</div><div class="conf-track"><div class="conf-fill" style="width:${(f.confidence*100).toFixed(1)}%"></div></div><div class="conf-val">${(f.confidence*100).toFixed(0)}%</div></div>`).join("")}</div></div>`:"";
  overviewDetails.innerHTML=`<div class="field-list"><div class="field-item"><div class="field-name">Model</div><div class="field-val">${escapeHtml(ar.modelId||selectedModelId||"—")}</div><div class="field-meta">Content length: ${escapeHtml(String((ar.content||"").length))} characters</div></div><div class="field-item"><div class="field-name">Detected Languages</div><div class="field-val">${escapeHtml(langs.length?langs.join(", "):"No language metadata")}</div></div></div>${confBars}`;
}

function renderFields(documents) {
  if(!documents.length){fieldsOutput.innerHTML=`<div class="placeholder"><div class="pl-icon">🏷</div>No structured fields for this model.</div>`;return;}
  const chunks=['<div class="field-list">'];
  documents.forEach((doc,i)=>{
    chunks.push(`<div class="field-item"><div class="field-name">Document ${i+1} · ${escapeHtml(doc.docType||"Unknown")}</div><div class="field-meta">Confidence: ${formatConfidence(doc.confidence)}</div></div>`);
    const names=Object.keys(doc.fields||{});
    if(!names.length){chunks.push(`<div class="field-item"><div class="field-val">No fields in this document.</div></div>`);}
    else names.forEach(name=>{
      const field=(doc.fields||{})[name], conf=typeof field?.confidence==="number"?field.confidence:null;
      chunks.push(`<div class="field-item"><div class="field-name">${escapeHtml(name)}</div><div class="field-val">${escapeHtml(formatFieldValue(field))}</div><div class="field-meta">Type: ${escapeHtml(field?.type||"Unknown")} · Confidence: ${formatConfidence(field?.confidence)}</div>${conf!==null?`<div class="conf-track" style="margin-top:5px;"><div class="conf-fill" style="width:${(conf*100).toFixed(1)}%"></div></div>`:""}</div>`);
    });
  });
  chunks.push("</div>"); fieldsOutput.innerHTML=chunks.join("");
}

function renderTables(tables) {
  if(!tables.length){tablesOutput.innerHTML=`<div class="placeholder"><div class="pl-icon">📋</div>No tables detected.</div>`;return;}
  const out=[];
  tables.forEach((table,idx)=>{
    const rows=table.rowCount||0,cols=table.columnCount||0;
    const grid=Array.from({length:rows},()=>Array.from({length:cols},()=>""));
    (table.cells||[]).forEach(cell=>{const r=cell.rowIndex??0,c=cell.columnIndex??0;if(r<rows&&c<cols)grid[r][c]=cell.content||"";});
    out.push(`<div class="field-item" style="margin-bottom:12px;"><div class="field-name">Table ${idx+1}</div><div class="field-meta">${rows} rows × ${cols} columns</div></div><div class="table-wrap"><table>`);
    if(rows>0){out.push("<thead><tr>");for(let c=0;c<cols;c++)out.push(`<th>${escapeHtml(grid[0][c]||`Col ${c+1}`)}</th>`);out.push("</tr></thead>");}
    out.push("<tbody>");
    for(let r=1;r<rows;r++){out.push("<tr>");for(let c=0;c<cols;c++)out.push(`<td>${escapeHtml(grid[r][c]||"")}</td>`);out.push("</tr>");}
    out.push("</tbody></table></div>");
  });
  tablesOutput.innerHTML=out.join("");
}

function getFullText(result) {
  const ar=result.analyzeResult||{};
  if(ar.content) return ar.content;
  const lines=[];
  for(const page of ar.pages||[]) for(const line of page.lines||[]) if(line.content) lines.push(line.content);
  return lines.join("\n");
}

async function copyExtractedText() {
  if(!lastResult) return;
  try{await navigator.clipboard.writeText(getFullText(lastResult));setStatus("Copied ✓","good","Text copied to clipboard");}
  catch{setStatus("Copy failed","bad","Clipboard permission denied");}
}

function downloadJson() {
  if(!lastResult) return;
  const blob=new Blob([JSON.stringify(lastResult,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob); const a=document.createElement("a");
  a.href=url; a.download="azure-docintel-result.json"; a.click(); URL.revokeObjectURL(url);
}

function extractOperationId(opUrl){try{return opUrl.match(/analyzeResults\/([^?]+)/i)?.[1]||null;}catch{return null;}}

function formatFieldValue(field) {
  if(!field) return "—";
  if(field.content) return field.content;
  if(field.valueString) return field.valueString;
  if(typeof field.valueNumber!=="undefined") return String(field.valueNumber);
  if(typeof field.valueInteger!=="undefined") return String(field.valueInteger);
  if(typeof field.valueBoolean!=="undefined") return String(field.valueBoolean);
  if(field.valueDate) return field.valueDate;
  if(field.valueTime) return field.valueTime;
  if(field.valuePhoneNumber) return field.valuePhoneNumber;
  if(field.valueCountryRegion) return field.valueCountryRegion;
  if(field.valueSelectionMark) return field.valueSelectionMark;
  if(field.valueCurrency){const{amount="",currencySymbol:sym="",currencyCode:code=""}=field.valueCurrency;return `${sym}${amount} ${code}`.trim();}
  if(field.valueArray) return field.valueArray.map(item=>formatFieldValue(item)).join(", ");
  if(field.valueObject){const obj={};for(const key in field.valueObject)obj[key]=formatFieldValue(field.valueObject[key]);return JSON.stringify(obj,null,2);}
  return "—";
}

function formatConfidence(v){return typeof v==="number"?`${(v*100).toFixed(1)}%`:"—";}
function countWords(text){return text?text.trim().split(/\s+/).filter(Boolean).length:0;}
function escapeHtml(str){return String(str).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}
async function safeText(res){try{return await res.text();}catch{return "Unable to read response body";}}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}