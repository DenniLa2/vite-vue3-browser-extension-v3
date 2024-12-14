/** Created by Denis Abramyan (dennila2@gmail.com) on 01.12.2024 */

export const onUpdated = () => {
  chrome.tabs.create({
    active: true,
    url: chrome.runtime.getURL('src/setup/index.html?type=update'),
  })
}

export const notify = (title: string, message: string) => {
  return chrome.notifications.create({
    type: 'basic',
    iconUrl: 'src/assets/logo.png',
    title,
    message,
  })
}
