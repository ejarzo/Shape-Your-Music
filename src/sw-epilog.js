/* Custom service worker epilog */
self.addEventListener('message', event => {
  console.log(`Message received: ${event.data}`);
  if (event.data === 'NEW_CONTENT_AVAILABLE') {
    if (window.confirm('New Version Available. Please refresh now.')) {
      window.location.reload();
    }
  }
  if (event.data === 'CONTENT_CACHED') {
    console.log('Content is cached');
  }
});
