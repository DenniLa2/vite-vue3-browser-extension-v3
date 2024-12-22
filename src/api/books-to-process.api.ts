/** Created by Denis Abramyan (dennila2@gmail.com) on 16.12.2024 */

import { bkAxios } from '@/config'


export const fetchBooksToProcessList = async () => {
  const res = await bkAxios.get(`/books/list-to-download`)

  return res.data
}
