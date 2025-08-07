export const openBrandDialog = (brand) => {

  const brandSlug = brand.brandDetails?.brandName
    ?.toLowerCase()
    ?.replace(/\s+/g, '-')
    ?.replace(/[^a-z0-9\-]/g, '')
    ?.substring(0, 50);

  const brandKey = `viewing-brand-id-${brand.uuid}`;
  sessionStorage.setItem(brandKey, brand.uuid); // ✅ Only store ID

  const newWindow = window.open(`/brands/${brand.uuid}?--${brandSlug}`, '_blank');

  // 🧹 Auto-remove sessionStorage when tab is closed
  if (newWindow) {
    const interval = setInterval(() => {
      if (newWindow.closed) {
        sessionStorage.removeItem(brandKey);
        clearInterval(interval);
      }
    }, 1000); // check every 1s
  }
};
