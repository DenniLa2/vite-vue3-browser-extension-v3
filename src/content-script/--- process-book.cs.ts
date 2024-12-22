/** Created by Denis Abramyan (dennila2@gmail.com) on 17.12.2024 */

import type { IAdditionalDetails } from '@/types'
import { MESSAGE_EVENT } from '@/constants'
import { EVoiceoverSrcType } from '@/types/enums'


const processBook = (tab: any) => {
  const dleContent = document.querySelectorAll('#dle-content ul.full-items>li')

  if (!dleContent) {
    return
  }

  // >> BOOK DETAILS
  const details: IAdditionalDetails = {
    year: undefined,
    size: undefined,
    bitrate: undefined,
    rest: [],
  }

  Array.from(dleContent).forEach((el) => {
    const text = (el.textContent ?? '') as string
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
      details.rest.push(text)
    }
  })
  // << BOOK DETAILS

  // >> VOICEOVER`S
  interface IVoiceoverVariant {
    sectionIdx: number
    narrators: string[]
    // sources: ISrc[]
    srcTypes: EVoiceoverSrcType[]
  }

  const voiceoverVariants: IVoiceoverVariant[] = []

  const voiceoverSection = document.querySelectorAll('#dle-content .tabs section')

  Array.from(voiceoverSection)
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
          // todo remove
          // console.log(' *---> text', sibling.textContent)
          // console.log(' >>> ', sibling.nextSibling?.nodeName)

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
      /* NB!
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
          srcTypes.push(EVoiceoverSrcType.WEB_ARCHIVE)
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
  console.log(' *---> SECTIONS', Array.from(voiceoverSection))

  chrome.tabs.sendMessage(
    tab.id!,
    {
      event: MESSAGE_EVENT.SCRIPT._to_BG.ADDITIONAL_BOOK_INFO,
      payload: {
        details,
        voiceoverVariants,
      },
    })

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
}
