/** Created by Denis Abramyan (dennila2@gmail.com) on 13.12.2024 */

export const onOpenOptions = async () => {
  const allTabs = await chrome.tabs.query({})

  // @ts-ignore
  const optionsTabs = allTabs.filter((tab) => tab.url.includes('src/options'))

  if (optionsTabs.length === 0) {
    chrome.tabs.create({
      active: true,
      url: chrome.runtime.getURL('src/options/index.html'),
    })
  } else {
    // @ts-ignore
    chrome.tabs.update(optionsTabs[0].id, { active: true })
  }
}
