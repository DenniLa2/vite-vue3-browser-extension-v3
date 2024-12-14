/** Created by Denis Abramyan (dennila2@gmail.com) on 13.12.2024 */

import { EMessageEvent } from '@/types/enums'

export const collectBKTabs = async () => {
  const tabs = await chrome.tabs.query({
    url: '*://baza-knig.ink/*',
  })

  chrome.runtime.sendMessage({
    event: EMessageEvent.ON_BK_TABS_COLLECTED,
    payload: tabs,
  })
}
