const express = require("express");
const router = express.Router();
const { readUrls, writeUrls } = require("../utils/fileStore");

function isValidUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch (err) {
    return false;
  }
}
// google.com/kjsgdfjsh

function generateCode(length = 6) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i += 1) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return code;
}

function getUniqueCode(existingUrls) {
  const usedCodes = new Set(existingUrls.map((item) => item.short_code));
  let candidate = "";
  do {
    const length = 6 + Math.floor(Math.random() * 3);
    candidate = generateCode(length);
  } while (usedCodes.has(candidate));
  return candidate;
}

// POST - Create a new shortened URL
router.post("/shorten", async (req, res) => {
  try {
    const { originalUrl: rawUrl } = req.body;
    const originalUrl = rawUrl?.trim();
    if (!originalUrl) {
      return res.status(400).json({ message: " URL is required." });
    }
    const urls = await readUrls();
    const existingItem = urls.find((item) => item.original_url === originalUrl);
    if (existingItem) {
      const shortUrl = `${req.protocol}://${req.get("host")}/${existingItem.short_code}`;
      return res.status(200).json({
        message: "URL already exists.",
        data: { ...existingItem, short_url: shortUrl },
      });
    }
    const shortCode = await getUniqueCode(urls);
    const nextId =
      urls.length > 0 ? Math.max(...urls.map((item) => item.id || 0)) + 1 : 1;
    const newEntry = {
      id: nextId,
      original_url: originalUrl,
      short_code: shortCode,
      clicks: 0,
      created_at: new Date().toISOString(),
    };
    const updatedUrls = [...urls, newEntry];
    await writeUrls(updatedUrls);
    const shortUrl = `${req.protocol}://${req.get("host")}/${shortCode}`;
    res.status(201).json({
      message: "URL shortened successfully.",
      data: { ...newEntry, short_url: shortUrl },
    });
  } catch (err) {
    console.error("Error shortening URL:", err);
    res.status(500).json({ message: "Unable to shorten URL." });
  }
});

// GET - api/urls Retrieve all shortened URLs
router.get("/urls", async (req, res) => {
  try {
    const urls = await readUrls();
    const hostBase = `${req.protocol}://${req.get("host")}`;
    const urlsWithShortLink = urls.map((item) => ({
      ...item,
      short_url: `${hostBase}/${item.short_code}`,
    }));
    res.status(200).json({
      message: "URLs retrieved successfully.",
      data: urlsWithShortLink,
    });
  } catch (err) {
    console.error("Error retrieving URLs:", err);
    res.status(500).json({ message: "Unable to retrieve URLs." });
  }
});

// DELETE - api/urls/:id Delete a shortened URL by ID
router.delete("/urls/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const urls = await readUrls();
    const remainingUrls = urls.filter((item) => item.id !== id);
    if (remainingUrls.length === urls.length) {
      return res.status(404).json({ message: "URL not found." });
    }
    await writeUrls(remainingUrls);
    res.status(200).json({ message: "URL deleted successfully." });
  } catch (err) {
    console.error("Error deleting URL:", err);
    res.status(500).json({ message: "Unable to delete URL." });
  }
});

module.exports = router;
