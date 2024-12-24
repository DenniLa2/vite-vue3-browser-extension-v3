/** Created by Denis Abramyan (dennila2@gmail.com) on 15.12.2024 */

import type { IAdditionalDetails, IBookInfo, IVoiceoverVariant } from '@/types'
import { MESSAGE_EVENT } from '@/constants'


export const processBooks = async (booksToProcess: IBookInfo[]) => {
  // 1. получить id текущего окна
  const _currentWindow = await browser.windows.getCurrent()
  const currentWindowId = _currentWindow.id

  // 2. получить список всех окон
  const _windows = await browser.windows.getAll()
  const _otherWindows = _windows.filter((window) => window.id !== currentWindowId)
  const _openedWindows = _otherWindows.filter((window) => window.state === 'normal')

  // 3. если есть другие окна, перейти на первое открытое
  if (_openedWindows.length > 0) {
    const _firstWindow = _openedWindows[0]
    await browser.windows.update(_firstWindow.id!, { focused: true })
    _processBooks(booksToProcess)

    return
  }

  //   3.1 если нет, то создать новое окно
  // 4. в новом окне открыть ссылку
  await browser.windows.create({ url: booksToProcess[0].link, type: 'normal' })
  // const _newWindow = await browser.windows.create({ url: booksToProcess[0].url, type: 'normal' })
  // const newWindowId = _newWindow.id!
  _processBooks(booksToProcess)
}

async function _processBooks(booksToProcess: IBookInfo[]) {
  for (let i = 0; i < booksToProcess.length; i++) {
    const bookAdditionalInfo = await _processBook(booksToProcess[i])

    // todo remove
    console.log(' *--->>>>>>>>>> -----------')
    console.log(' *---> bookAdditionalInfo', bookAdditionalInfo)
    // сообщить об окончании обработки книги
    const payload = {
      total: booksToProcess.length,
      current: i + 1,
      success: true,
    }
    chrome.runtime.sendMessage({
      event: MESSAGE_EVENT.BG._to_OPTIONS.ON_BOOKS_PROCESS_PROGRESS,
      payload,
    })
  }
}


async function _processBook(bookToProcess: IBookInfo) {
  let tab = await browser.tabs.create({ url: bookToProcess.link })

  tab = tab!

  // todo remove
  console.log(' *---> id', tab.id)

  return new Promise((resolve) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id!, allFrames: false },
        // @ts-ignore
        func: async (bookToProcess: IBookInfo, BASE_API_URL: string/*, tabId: number*/) => {
          // NB! Sync with original in src/types/enums/EVoiceoverSrcType.enum.ts
          enum EVoiceoverSrcType {
            TORRENT = 'TORRENT',
            WEB_ARCHIVE = 'WEB_ARCHIVE',
            BAZA_KNIG = 'BAZA_KNIG',
            DIRECT = 'DIRECT',
            ENGINE = 'ENGINE',
            XZ = 'XZ',
          }

          // todo remove
          console.log(' *---> START FUNC')


          const dleContent = document.querySelectorAll('#dle-content ul.full-items>li')

          if (!dleContent) {
            return
          }

          // >> BOOK DETAILS
          const details: IAdditionalDetails = {
            year: undefined,
            size: undefined,
            bitrate: undefined,
            fullDetails: '',
            fullDetailsRest: '',
          }

          Array.from(dleContent).forEach((el) => {
            const text = (el.textContent ?? '') as string
            details.fullDetails += `&${text}`

            if (text.includes('Автор: ')) {
              // nothing
            }
            else if (text.includes('Читает: ')) {
              // nothing
            }
            else if (text.includes('Год: ')) {
              details.year = text.replace('Год: ', '')
            }
            else if (text.includes('Длительность: ')) {
              // nothing
            }
            else if (text.includes('Цикл: ')) {
              // nothing
            }
            else if (text.includes('Жанр: ')) {
              // nothing
            }
            else if (text.includes('Добавлена: ')) {
              // nothing
            }
            else if (text.includes('] | ')) {
              const regex = /\[(.+)\] \| (.+)/
              const match = text.match(regex)
              if (match) {
                const [, size, bitrate] = match
                details.size = size.trim()
                details.bitrate = bitrate.trim()
              }
            }
            else {
              details.fullDetailsRest += `&${text}`
            }
          })

          // todo remove
          console.log(' *---> >>>, DETAILS', details)
          // << BOOK DETAILS

          // >> VOICEOVER`S
          const voiceoverVariants: IVoiceoverVariant[] = []

          const voiceoverSections = document.querySelectorAll('#dle-content .tabs section')

          Array.from(voiceoverSections)
            .forEach((voiceoverSection, sectionIdx) => {

              // >> NARRATORS
              const narratorsElement = Array.from(voiceoverSection.childNodes)
                .find(
                  node => node.nodeType === Node.TEXT_NODE && node.textContent?.includes('Озвучивает:'),
                )

              let narrators: string[] = []

              if (
                narratorsElement?.nextSibling
                && narratorsElement.nextSibling.nodeType === Node.ELEMENT_NODE
                && narratorsElement.nextSibling.nodeName === 'A'
              ) {
                let sibling = narratorsElement.nextSibling
                let _narrators = ''

                while (true) {
                  _narrators += sibling.textContent

                  if (sibling.nextSibling?.nodeName === 'BR') {
                    break
                  }

                  // @ts-ignore
                  sibling = sibling.nextSibling
                }

                narrators = _narrators.split(',').map(text => text.trim())
              }
              else {
                const _narrators = narratorsElement
                  ?.textContent
                  ?.split('\/n')
                  .join('')
                  .split(': ')[1]
                  .split(',')
                  .map(text => text.trim())

                if (Array.isArray(_narrators)) {
                  narrators = _narrators
                }
              }

              if (narrators.length === 0) return
              // << NARRATORS

              // >> SOURCES
              /** NB!
                BASA +
                <a1 href="" title="Скачать mp3">
                <button class="create_archive" data-id="16511" data-voice="1">
                <i class="fa fa-cloud-download fa-lg" aria-hidden="true"></i>
                .mp3
                </button>
                </a1>

                ENGINE ~~ARCHIVE~~
                <a href="/engine/go.php?url=aHR0cHM6Ly9" target="_blank" onclick="yaCounter46924785.reachGoal('clickMP3'); return true;">
                <a1 href="" title="Скачать mp3">
                <i class="fa fa-cloud-download fa-lg" aria-hidden="true"></i>
                .mp3
                </a1>
                </a>

                DIRECT ~~YA.DISK~~
                <a href="https://disk.yandex.ru/d/E3rnv7dG2uQ7kA" target="_blank" onclick="yaCounter46924785.reachGoal('clickMP3'); return true;">
                <a1 href="" title="Скачать mp3">
                <i class="fa fa-cloud-download fa-lg" aria-hidden="true"></i>
                .mp3</a1>
                </a>
              */
              const as = voiceoverSection.querySelectorAll('a')
              const a1s = voiceoverSection.querySelectorAll(':scope > a1')

              const srcTypes: EVoiceoverSrcType[] = []

              for (const _a of Array.from(as)) {
                // NB! TORRENT
                if (_a.textContent?.includes('.torrent')) {
                  srcTypes.push(EVoiceoverSrcType.TORRENT)
                }
                // NB! DIRECT | ENGINE | XZ
                else if (_a.textContent?.includes('.mp3')) {
                  let type:
                    | EVoiceoverSrcType.DIRECT
                    | EVoiceoverSrcType.ENGINE
                    | EVoiceoverSrcType.XZ = EVoiceoverSrcType.XZ

                  if (_a.href.indexOf('http') === 0) {
                    type = EVoiceoverSrcType.DIRECT
                  }
                  else if (_a.href.indexOf('/engine/go.php') === 0) {
                    type = EVoiceoverSrcType.ENGINE
                  }

                  srcTypes.push(type)
                }
              }


              for (const _a1 of Array.from(a1s)) {
                // NB! BAZA
                if (_a1.textContent?.includes('.mp3')) {
                  srcTypes.push(EVoiceoverSrcType.BAZA_KNIG)
                }
              }

              if (srcTypes.length === 0) return
              // << SOURCES

              const voiceoverVariant: IVoiceoverVariant = {
                sectionIdx,
                narrators,
                srcTypes,
              }

              voiceoverVariants.push(voiceoverVariant)
            })
          // << VOICEOVER`S

          // todo remove
          console.log(' *---> PAGE. info collected')

          try {
            const bookDetailsBody = {
              details,
              voiceoverVariants,
            }

            const res = await fetch(
              `${BASE_API_URL}/books/${bookToProcess.id}/additional-info`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify(bookDetailsBody),

              },
            )

            if (!res.ok) {
              return Promise.resolve('Fetch NOT OK <<')
            }

            const { data } = await res.json()

            // todo remove
            console.log(' *---> DATA', data)

            const _data = data as { sectionIdx: number, id: string }[]

            const wait = async (time_ms = 1_000) => {
              return await new Promise(resolve => setTimeout(resolve, time_ms))
            }

            for (const { sectionIdx, id: voiceoverVariantId } of _data) {
              document.querySelector(`#dle-content .tabs label[for=tab${sectionIdx + 1}]`)?.click?.()


              await wait()

              const as = document.querySelectorAll(`#dle-content .tabs section#content-tab${sectionIdx + 1} a`)

              for (const _a of Array.from(as)) {
                // NB! TORRENT
                if (_a.textContent?.includes('.torrent')) {
                  setTimeout(() => {
                    _a.click()
                  }, 1000)

                  try {// todo remove
                    console.log(' *---> url', `${BASE_API_URL}/books/wait-torrent-file/${voiceoverVariantId}`)
                    const res = await fetch(
                      //wait-torrent-file/:
                      `${BASE_API_URL}/books/wait-torrent-file/${voiceoverVariantId}`,
                      {
                        method: 'POST',
                      },
                    )

                    // todo remove
                    console.log(' *---> TORRENT FILE DOWNLOADED', res)
                  }
                  catch (e: unknown) {
                    // todo! handle errors
                    // todo remove
                    console.log(' *---> POST ERROR', e)
                  }
                }
              }

              //. todo!! setTimeout(() => {
              //   if (btn) {
              //     btn.click()
              //   }
              // }, 1000)
            }
          }
          catch (e: unknown) {
            // todo! handle errors
            // todo remove
            console.log(' *---> fetch error', e)
          }

          // todo remove
          console.log(' *---> SECTIONS', Array.from(voiceoverSections))

          // todo! subscribe to download events

          // const btn = document.querySelector('#content-tab1 a')

          //. todo!! setTimeout(() => {
          //   if (btn) {
          //     btn.click()
          //   }
          // }, 1000)


          // return 'el-file-name.torrent'

          /* NB! return {
            details,
            voiceoverVariants,
          }*/

          return Promise.resolve('book DONE')
        },
        args: [bookToProcess, import.meta.env.VITE__BASE_API_URL, tab.id!],
      },
      (results) => {
        setTimeout(() => {
          chrome.tabs.remove(tab.id!)
        }, calcRandomPause(60_000, 3 * 60_000, 10 * 60_000))

        resolve(results[0].result)
      },
    )
  })
}
