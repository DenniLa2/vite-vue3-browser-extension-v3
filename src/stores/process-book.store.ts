import { EMessageEvent, ERequestState } from '@/types/enums'
import { defineStore } from 'pinia'

const _fetchList = async () => {
  const result = await fetch(`${import.meta.env.VITE__BASE_API_URL}/books/list-to-download`)
  return result.json()
}

export const useProcessBookStore = defineStore('app', () => {
  const _requestState_links: Ref<ERequestState> = ref(ERequestState.initial)
  const _books: Ref<
    {
      url: string
      status: 'none' | 'parsing-details' | 'parsing-files' | 'done' | 'fail'
    }[]
  > = ref([])

  const start = async () => {
    try {
      _requestState_links.value = ERequestState.inProgress
      const urls = await _fetchList()

      _books.value = urls.map((url: string) => ({
        url,
        status: 'none',
      }))

      _requestState_links.value = ERequestState.resolved


      // await _processBooks()
    } catch (e: unknown) {
      // todo! handle errors
    }

    const message = {
      event: EMessageEvent.PROCESS_BOOK_PAGES,
      payload: `done: ${_books.value.length}`,
    }
    chrome.runtime.sendMessage(message)
  }

  /*async function _processBooks() {
    if (_books.value.length === 0) {
      return
    }

    for (let i = 0; i < _books.value.length; i++) {
      const book = _books.value[i]

      book.status = 'parsing-details'
      notify('Parsing details', `Book [ ${i} ]`)
      await _parseBook(book.url)

      book.status = 'parsing-files'
      notify('Parsing files', `Book [ ${i} ]`)

      await _processBook(book.url)
      book.status = 'done'
      notify('Done', `Book [ ${i} ]`)
    }
  }

  async function _parseBook(url: string) {

  }

  async function _processBook(url: string) {}*/

  return {
    start,
  }
})
