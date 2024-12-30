document.addEventListener('DOMContentLoaded', () => {
  const whitelistInput = document.getElementById('whitelistInput');
  const addToWhitelistButton = document.getElementById('addToWhitelist');
  const whitelistItems = document.getElementById('whitelistItems');

  function loadWhitelist() {
    chrome.storage.sync.get('whitelist', (data) => {
      const whitelist = data.whitelist || [];
      whitelistItems.innerHTML = '';
      whitelist.forEach((item) => {
        addWhitelistItem(item);
      });
    });
  }

  function addWhitelistItem(item) {
    const div = document.createElement('div');
    div.className = 'whitelist-item';
    div.innerHTML = `
      <span><i class="material-icons">link</i>${item}</span>
      <button class="remove"><i class="material-icons">delete</i></button>
    `;
    div.querySelector('.remove').addEventListener('click', () => {
      removeFromWhitelist(item);
    });
    whitelistItems.appendChild(div);
  }

  function addToWhitelist() {
    const pattern = whitelistInput.value.trim();
    if (pattern) {
      try {
        new RegExp(pattern);
        chrome.storage.sync.get('whitelist', (data) => {
          const whitelist = data.whitelist || [];
          if (!whitelist.includes(pattern)) {
            whitelist.push(pattern);
            chrome.storage.sync.set({ whitelist }, () => {
              addWhitelistItem(pattern);
              whitelistInput.value = '';
            });
          }
        });
      } catch (e) {
        alert('无效的正则表达式模式');
      }
    }
  }

  function removeFromWhitelist(pattern) {
    chrome.storage.sync.get('whitelist', (data) => {
      const whitelist = data.whitelist || [];
      const index = whitelist.indexOf(pattern);
      if (index > -1) {
        whitelist.splice(index, 1);
        chrome.storage.sync.set({ whitelist }, loadWhitelist);
      }
    });
  }

  addToWhitelistButton.addEventListener('click', addToWhitelist);
  loadWhitelist();
});
