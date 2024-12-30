// 监听导航完成事件
chrome.webNavigation.onCompleted.addListener((details) => {
    if (details.frameId === 0) {  // 只处理主框架
      chrome.storage.sync.get(['customUrls'], (result) => {
        const customUrls = result.customUrls || [];
        if (customUrls.some(url => details.url.startsWith(url))) {
          chrome.history.deleteUrl({ url: details.url });
        }
      });
    }
  });
  
  // 定期清除历史记录以隐藏搜索建议
  function clearRecentHistory() {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    chrome.history.search({
      text: '',
      startTime: fiveMinutesAgo,
      maxResults: 1000
    }, (historyItems) => {
      historyItems.forEach(item => {
        chrome.history.deleteUrl({ url: item.url });
      });
    });
  }
  
  // 每5分钟清除一次最近的历史记录
  setInterval(clearRecentHistory, 5 * 60 * 1000);
  
  // 初始运行一次
  clearRecentHistory();
  