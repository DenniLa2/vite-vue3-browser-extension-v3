/** Created by Denis Abramyan (dennila2@gmail.com) on 01.12.2024 */

export const onUpdated = () => {
  chrome.tabs.create({
    active: true,
    url: chrome.runtime.getURL('src/setup/index.html?type=update'),
  })
}
