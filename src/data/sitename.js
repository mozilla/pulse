self.port.on('get-sitename', () => {
  const og_sitename = document.querySelector('meta[property="og:site_name"]');
  self.port.emit(
    'send-sitename',
    og_sitename ? og_sitename.content : window.location.hostname
  );
});
