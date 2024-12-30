// 清除所有历史记录
function clearAllHistory() {
  chrome.history.deleteAll(() => {
    if (chrome.runtime.lastError) {
      console.error('Error deleting all history:', chrome.runtime.lastError);
    } else {
      console.log('All history cleared');
    }
  });
}

let newTabCreated = false;

// 监听新标签页创建事件
chrome.tabs.onCreated.addListener((tab) => {
  console.log('New tab created');
  newTabCreated = true;
});

// 监听标签页激活事件
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('Tab activated:', activeInfo.tabId);
  if (newTabCreated) {
    clearAllHistory();
    newTabCreated = false;
  }
});

// 监听扩展安装事件
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed, clearing all history');
    clearAllHistory();
    // 打开欢迎页面
    chrome.tabs.create({ url: 'options.html' });
  }
});
