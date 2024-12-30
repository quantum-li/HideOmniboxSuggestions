// 保存选项
function saveOptions() {
    const customUrls = document.getElementById('customUrls').value.split('\n').filter(url => url.trim() !== '');
    chrome.storage.sync.set({ customUrls: customUrls }, () => {
      const status = document.getElementById('status');
      status.textContent = '选项已保存。';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    });
  }
  
  // 恢复选项
  function restoreOptions() {
    chrome.storage.sync.get(['customUrls'], (result) => {
      document.getElementById('customUrls').value = (result.customUrls || []).join('\n');
    });
  }
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);
  