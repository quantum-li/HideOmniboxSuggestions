chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'options.html' });
  }
});

function isUrlInWhitelist(url, whitelist) {
  return whitelist.some(pattern => {
    try {
      const regex = new RegExp(pattern);
      return regex.test(url);
    } catch (e) {
      console.error('无效的正则表达式模式:', pattern);
      return false;
    }
  });
}

function cleanHistory() {
  chrome.storage.sync.get('whitelist', (data) => {
    const whitelist = data.whitelist || [];
    chrome.history.search({text: '', maxResults: 1000}, (historyItems) => {
      historyItems.forEach(item => {
        if (!isUrlInWhitelist(item.url, whitelist)) {
          chrome.history.deleteUrl({ url: item.url });
        }
      });
    });
  });
}

chrome.tabs.onActivated.addListener(cleanHistory);

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    cleanHistory();
  }
});
