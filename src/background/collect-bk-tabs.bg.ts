/** Created by Denis Abramyan (dennila2@gmail.com) on 13.12.2024 */

import { EMessageEvent } from '@/types/enums'


export const collectBKTabs = async () => {
  const tabs = await chrome.tabs.query({
    url: '*://baza-knig.ink/*',
  })

  try {
    await chrome.runtime.sendMessage({
      event: EMessageEvent.ON_BK_TABS_COLLECTED,
      payload: tabs,
    })
  }
  catch (e: unknown) {
    // todo! handle errors
    // todo remove
    console.log(' *---> TryCatch', e)
  }
}
