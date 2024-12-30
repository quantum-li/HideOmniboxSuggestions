document.getElementById('addToWhitelist').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab && currentTab.url && !currentTab.url.startsWith('chrome://')) {
        const url = new URL(currentTab.url).hostname;
        const pattern = url.replace(/\./g, '\\.') + '.*';
        chrome.storage.sync.get('whitelist', (data) => {
          const whitelist = data.whitelist || [];
          if (!whitelist.includes(pattern)) {
            whitelist.push(pattern);
            chrome.storage.sync.set({ whitelist }, () => {
              alert(`已将 ${pattern} 添加到白名单`);
            });
          } else {
            alert(`${pattern} 已在白名单中`);
          }
        });
      } else {
        alert('无法将当前页面添加到白名单');
      }
    });
  });
  