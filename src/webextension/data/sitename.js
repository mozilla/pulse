(() => {
  const og_sitename = document.querySelector('meta[property="og:site_name"]');
  return og_sitename ? og_sitename.content : window.location.hostname;
})();
