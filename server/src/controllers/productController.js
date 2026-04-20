import axios from "axios";

/* =====================================================
   PLATFORM TRUST SCORES
===================================================== */

const PLATFORM_SCORE = {
  Amazon: 90,
  Flipkart: 85,
  Blinkit: 70,
  JioMart: 75,
  Meesho: 65,
};

/* =====================================================
   SIMPLE IN-MEMORY CACHE (60s TTL)
===================================================== */

const searchCache = new Map();
const CACHE_TTL = 60 * 1000; // 60 seconds

const getCached = (key) => {
  const entry = searchCache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiry) {
    searchCache.delete(key);
    return null;
  }

  return entry.data;
};

const setCache = (key, data) => {
  searchCache.set(key, {
    data,
    expiry: Date.now() + CACHE_TTL,
  });
};

/* =====================================================
   AXIOS SAFE CLIENT
===================================================== */

const apiClient = axios.create({
  timeout: 5000,
});

/* =====================================================
   SEARCH PRODUCT (PUBLIC)
   GET /api/products/search?q=...
===================================================== */

export const searchProduct = async (req, res) => {
  try {
    let { q } = req.query;

    if (!q || typeof q !== "string" || !q.trim()) {
      return res.status(400).json({
        message: "Search query required",
      });
    }

    // Basic sanitization
    q = q.trim().slice(0, 100).toLowerCase();

    /* ---------------- Check Cache ---------------- */

    const cached = getCached(q);
    if (cached) {
      return res.json(cached);
    }

    /* ---------------- External API Call ---------------- */

    const response = await apiClient.get(
      `https://dummyjson.com/products/search?q=${encodeURIComponent(q)}`,
    );

    const products = response.data?.products || [];

    /* Limit results to prevent abuse */
    const limitedProducts = products.slice(0, 20);

    const formatted = limitedProducts.map((p) => {
      const platforms = [
        {
          platform: "Amazon",
          link: `https://www.amazon.in/s?k=${encodeURIComponent(p.title)}`,
        },
        {
          platform: "Flipkart",
          link: `https://www.flipkart.com/search?q=${encodeURIComponent(p.title)}`,
        },
      ];

      const scored = platforms.map((pl) => ({
        ...pl,
        score: PLATFORM_SCORE[pl.platform] || 50,
      }));

      const recommended =
        scored.sort((a, b) => b.score - a.score)[0] || platforms[0];

      return {
        productId: p.id.toString(),
        title: p.title,
        image: p.thumbnail,
        price: p.price,
        availablePlatforms: platforms.map((pl) => pl.platform),
        recommended: {
          platform: recommended.platform,
          link: recommended.link,
          reason: "High trust score & fast availability",
        },
      };
    });

    /* Store in cache */
    setCache(q, formatted);

    res.set("Cache-Control", "public, max-age=60");

    return res.json(formatted);
  } catch (error) {
    console.error("Product search error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};

/* =====================================================
   ADMIN: ADD PRODUCT (DISABLED)
===================================================== */

export const addProduct = async (req, res) => {
  return res.status(200).json({
    message: "Manual product creation disabled in dynamic mode",
  });
};
