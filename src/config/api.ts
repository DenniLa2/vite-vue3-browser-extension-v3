/** Created by Denis Abramyan (dennila2@gmail.com) on 16.12.2024 */

import axios from 'axios'


export const bkAxios = axios.create({
  baseURL: import.meta.env.VITE__BASE_API_URL,
})

