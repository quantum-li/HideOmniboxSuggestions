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

function cleanHistoryBatch(startTime, endTime, whitelist, maxResults, callback) {
  chrome.history.search({text: '', startTime: startTime, endTime: endTime, maxResults: maxResults}, (historyItems) => {
    if (historyItems.length === 0) {
      callback();
      return;
    }

    historyItems.forEach(item => {
      if (!isUrlInWhitelist(item.url, whitelist)) {
        chrome.history.deleteUrl({ url: item.url });
      }
    });

    const lastItemTime = historyItems[historyItems.length - 1].lastVisitTime;
    cleanHistoryBatch(startTime, lastItemTime, whitelist, maxResults, callback);
  });
}

function cleanHistory() {
  chrome.storage.sync.get(['whitelist', 'lastCleanTime'], (data) => {
    const whitelist = data.whitelist || [];
    const startTime = data.lastCleanTime || 0; // 从上次结束时间开始
    const endTime = Date.now();
    const maxResults = 1000; // 每次获取的最大记录数

    cleanHistoryBatch(startTime, endTime, whitelist, maxResults, () => {
      chrome.storage.sync.set({ lastCleanTime: endTime }, () => {
        console.log('历史记录清理完成');
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
