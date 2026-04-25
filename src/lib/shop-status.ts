export interface ShopStatus {
  isOpen: boolean;
  message: string;
  nextOpenTime: string;
}

export function getShopStatus(): ShopStatus {
  // ── Master Switch (admin override) ──────────────────────────────────────
  // Read admin settings from localStorage. If the master switch is
  // explicitly turned OFF, the studio is closed regardless of the time.
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("bakery_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isShopOpen === false) {
          return {
            isOpen: false,
            message: "We are currently closed. Please check back later or call us at 076619 00009.",
            nextOpenTime: "09:00 AM",
          };
        }
      }
    } catch {
      // Ignore parse errors — fall through to time-based check
    }
  }

  // ── Time-based check ────────────────────────────────────────────────────
  // Shop Hours: 09:00 AM (540 mins) to 01:00 AM next day (60 mins)
  const now = new Date();
  const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
  const openTimeMinutes = 9 * 60;   // 540
  const closeTimeMinutes = 1 * 60;  // 60 (next day)

  // Crosses midnight, so open when time >= 9 AM OR time < 1 AM
  const isOpen =
    currentTimeInMinutes >= openTimeMinutes ||
    currentTimeInMinutes < closeTimeMinutes;

  return {
    isOpen,
    message: isOpen
      ? "We are baking!"
      : "We are currently resting! Browsing is open, but orders resume at 9:00 AM.",
    nextOpenTime: "09:00 AM",
  };
}
