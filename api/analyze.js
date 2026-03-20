export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const endpoint = (process.env.AZURE_ENDPOINT || "").replace(/\/+$/, "");
    const apiKey = process.env.AZURE_API_KEY || "";

    if (!endpoint || !apiKey) {
      return res.status(500).json({ error: "Azure environment variables are missing." });
    }

    const { modelId, locale, pages, stringIndexType, urlSource, fileBase64, fileType } = req.body || {};

    if (!modelId) {
      return res.status(400).json({ error: "modelId is required." });
    }

    const qs = new URLSearchParams({ "api-version": "2024-11-30" });
    if (locale) qs.set("locale", locale);
    if (pages) qs.set("pages", pages);
    if (stringIndexType) qs.set("stringIndexType", stringIndexType);

    const azureUrl =
      `${endpoint}/documentintelligence/documentModels/${encodeURIComponent(modelId)}:analyze?${qs.toString()}`;

    let azureRes;

    if (urlSource) {
      azureRes = await fetch(azureUrl, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urlSource }),
      });
    } else if (fileBase64) {
      const buffer = Buffer.from(fileBase64, "base64");
      azureRes = await fetch(azureUrl, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
          "Content-Type": fileType || "application/octet-stream",
        },
        body: buffer,
      });
    } else {
      return res.status(400).json({ error: "No document source provided." });
    }

    const responseText = await azureRes.text();
    const operationLocation =
      azureRes.headers.get("Operation-Location") ||
      azureRes.headers.get("operation-location");

    if ((!azureRes.ok && azureRes.status !== 202) || !operationLocation) {
      return res.status(azureRes.status || 500).json({
        error: "Azure analyze request failed.",
        details: responseText,
      });
    }

    for (let i = 0; i < 60; i++) {
      await new Promise(r => setTimeout(r, 1800));

      const pollRes = await fetch(operationLocation, {
        headers: { "Ocp-Apim-Subscription-Key": apiKey },
      });

      const data = await pollRes.json().catch(() => ({}));

      if (!pollRes.ok) {
        return res.status(pollRes.status || 500).json({
          error: "Polling failed.",
          details: data,
        });
      }

      const status = String(data.status || "").toLowerCase();

      if (status === "succeeded") {
        return res.status(200).json(data);
      }

      if (status === "failed" || status === "partiallyfailed") {
        return res.status(500).json({
          error: "Analysis failed.",
          details: data,
        });
      }
    }

    return res.status(408).json({ error: "Timed out waiting for Azure result." });
  } catch (err) {
    return res.status(500).json({
      error: err.message || "Internal server error",
    });
  }
}