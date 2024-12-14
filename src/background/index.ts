import type { IMessage } from '@/types'
import { EMessageEvent } from '@/types/enums'
import { collectBKTabs } from './collect-bk-tabs'
import { onOpenOptions } from './open-options'


chrome.runtime.onInstalled.addListener(async (opt) => {
  if (opt.reason === 'install') {
    await chrome.storage.local.clear()

    chrome.tabs.create({
      active: true,
      url: chrome.runtime.getURL('src/setup/index.html?type=install'),
    })
  }

  if (opt.reason === 'update') {
    // onUpdated()
  }
})

chrome.tabs.onUpdated.addListener(async (/* tabId, changeInfo, tab */) => {
  // todo remove
  console.log(' *---> TAB UPDATED')
  collectBKTabs()
})

chrome.tabs.onRemoved.addListener(async (/* tabId, changeInfo, tab */) => {
  // todo remove
  console.log(' *---> TAB REMOVED')
  collectBKTabs()
})

chrome.tabs.onCreated.addListener(async (/*tabId, changeInfo, tab*/) => {
  // todo remove
  console.log(' *---> TAB CREATED')
  collectBKTabs()
})

chrome.runtime.onMessage.addListener(
  // @ts-ignore
  async (message: IMessage/*, sender, sendResponse*/) => {
    // todo remove
    console.log(' *---> ON MESSAGE', message)

    if (message.event === EMessageEvent.OPEN_OPTIONS_WINDOW) {
      onOpenOptions()
    }
    else if (message.event === EMessageEvent.COLLECT_BK_TABS) {
      collectBKTabs()
    }
    // await notify(`on-message: ${message.event}`, message.payload)
  },
)
console.log('hello world from background')

self.onerror = function(message, source, lineno, colno, error) {
  console.info(
    `Error: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nError object: ${error}`,
  )
}

export {}
