export default async function handler(req, res) {
  try {
    const endpoint = (process.env.AZURE_ENDPOINT || "").replace(/\/+$/, "");
    const apiKey = process.env.AZURE_API_KEY || "";

    if (!endpoint || !apiKey) {
      return res.status(500).json({ error: "Azure environment variables are missing." });
    }

    const url = `${endpoint}/documentintelligence/documentModels?api-version=2024-11-30`;

    const azureRes = await fetch(url, {
      method: "GET",
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
      },
    });

    const text = await azureRes.text();

    if (!azureRes.ok) {
      return res.status(azureRes.status).json({
        error: "Connection failed.",
        details: text,
      });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return res.status(200).json({
      ok: true,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message || "Internal server error",
    });
  }
}