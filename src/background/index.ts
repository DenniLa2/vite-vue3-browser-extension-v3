import type { IMessage } from '@/types'
import { MESSAGE_EVENT } from '@/constants'
import { EMessageEvent } from '@/types/enums'
import { collectBKTabs } from './collect-bk-tabs.bg'
import { openOptions } from './open-options.bg'
import { processBooks } from './process-books.bg'


chrome.runtime.onInstalled.addListener(async (opt) => {
  // todo remove
  console.log(' *---> ON INSTALLED', opt)
  if (opt.reason === 'install') {
    await chrome.storage.local.clear()

    chrome.tabs.create({
      active: true,
      url: chrome.runtime.getURL('src/setup/index.html?type=install'),
    })
  }

  if (opt.reason === 'update') {
    // onUpdated()
    openOptions()
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
  (message: IMessage/*, sender, sendResponse*/) => {
    // todo remove
    console.log(' *---> ON MESSAGE', message)

    if (message.event === EMessageEvent.OPEN_OPTIONS_WINDOW) {
      openOptions()
    }
    else if (message.event === EMessageEvent.COLLECT_BK_TABS) {
      collectBKTabs()
    }
    else if (message.event === MESSAGE_EVENT.OPTIONS._to_BG.PROCESS_BOOKS) {
      processBooks(message.payload.booksToProcess)
    }
    else if (message.event === MESSAGE_EVENT.SCRIPT._to_BG.ADDITIONAL_BOOK_INFO) {
      // todo remove
      console.log(' *---> ADDITIONAL BOOK INFO', message.payload)
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
