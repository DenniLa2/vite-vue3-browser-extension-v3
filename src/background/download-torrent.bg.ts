/** Created by Denis Abramyan (dennila2@gmail.com) on 17.12.2024 */

import type { IAdditionalBookInfo, IBookInfo } from '@/types'
import { MESSAGE_EVENT } from '@/constants'


export const __t = {
  bookInfo: {} as IBookInfo,
  additionalBookInfo: {} as IAdditionalBookInfo,
  currentTabIdx: -1,
}

export const tupleFileName: [string | undefined] = [undefined]

export const downloadTorrentFiles = (port: chrome.runtime.Port, additionalBookInfo: IAdditionalBookInfo) => {
  if (__t.additionalBookInfo.link !== additionalBookInfo.link) {
    __t.additionalBookInfo = additionalBookInfo
    __t.currentTabIdx = -1
  }

  let hasTorrent = false
  for (let i = 0; i < __t.additionalBookInfo.voiceoverVariants.length; i++) {
    if (
      i > __t.currentTabIdx
      && __t.additionalBookInfo.voiceoverVariants[i].sources.findIndex(src => src.type === 'torrent') !== -1
    ) {
      __t.currentTabIdx = i
      hasTorrent = true
    }
  }

  if (hasTorrent) {
    _contentScript_downloadTorrent()
  }
  else {
    // todo end
    port.postMessage({})
  }

  // todo remove
  console.log(' *---> __T', __t)
  port.postMessage({
    event: MESSAGE_EVENT.BG._to_SCRIPT.DOWNLOAD_TORRENT,
    payload: {},
  })
}

function generateSeriesPlus() {
  let _seriesPlus = ''

  if (__t.bookInfo.series) {
    _seriesPlus = __t.bookInfo.series

    if (__t.bookInfo.numberInSeries) {
      _seriesPlus += ` ${__t.bookInfo.numberInSeries}`
    }
  }
  else {
    _seriesPlus = __t.bookInfo.bookName
  }

  return _seriesPlus.length <= 7
    ? _seriesPlus
    : compactSeriesPlus(_seriesPlus)
}

function compactSeriesPlus(seriesPlus: string) {
  const parts = seriesPlus.split(' ')

  if (parts.length === 1) {
    return `${seriesPlus.substring(0, 7)}...`
  }

  return parts.map(part => part[0].toUpperCase()).join('')
}

export const generateTorrentFileName = () => {
  // ($AUTHORS$)[$SERIES$ $NUM$] '$NAME$' { $NARRATORS$ }
  // (Аркадий Стругацкий, Борис Стругацкий)[Космос 1] 'Стажеры' { Кирилл Головин, Кирилисса Головиновская }

  try {
    const authors = __t.bookInfo.authors.slice(0, 2).map(author => author.trueName ?? author.name).join(',')

    const bookName = __t.bookInfo.bookName

    const seriesPlus = generateSeriesPlus()

    const narrators = __t.additionalBookInfo.voiceoverVariants[__t.currentTabIdx]
      .narrators
      .slice(0, 2)
      .join(', ')

    return `(${authors})[${seriesPlus}] '${bookName}' { ${narrators} }.torrent`
  }
  catch (e: unknown) {
    // todo! handle errors
    // todo remove
    console.error(' *---> generateTorrentFileName.E', e)
  }
}

async function _contentScript_downloadTorrent() {
  // todo remove
  console.log(' *---> ### _contentScript_downloadTorrent 0')


  chrome.scripting.executeScript({
    target: { tabId: __t.additionalBookInfo.tabId, allFrames: false },
    func: (tabIdx: number) => {
      // todo remove
      console.log(' *---> BROWSER. func INJECTED')
      /*chrome.downloads.onCreated.addListener((downloadItem) => {
        console.log(`Имя файла: ${downloadItem.filename}`)
      })*/

      document.querySelector(`#dle-content .tabs label[for=tab${tabIdx + 1}]`)?.click?.()
      console.log(' *---> BROWSER. 1')

      const voiceoverSection = document.querySelector(`#dle-content .tabs section#content-tab${tabIdx + 1}`)
      console.log(' *---> BROWSER. 2')

      const as = voiceoverSection?.querySelectorAll('a')
      console.log(' *---> BROWSER. 3')

      for (const _a of Array.from(as)) {
        // NB! TORRENT
        if (_a.textContent?.includes('.torrent')) {
          console.log(' *---> BROWSER. 4')
          // tupleFileName[0] = generateTorrentFileName()
          // console.log(' *---> BROWSER. 5', tupleFileName[0])
          // todo!! send message about starting downloading torrent file
          _a.click()
          // todo remove
          console.log(' *---> start download torrent file')
        }
      }
    },
    args: [__t.currentTabIdx],
  }, () => {
  })
}
