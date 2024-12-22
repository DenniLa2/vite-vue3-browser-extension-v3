/** Created by Denis Abramyan (dennila2@gmail.com) on 17.12.2024 */

import { EVoiceoverSrcType } from '@/types/enums'


export interface IAdditionalDetails {
  year: undefined | string,
  size: undefined | string,
  bitrate: undefined | string,
  // todo!! привести к единому виду fullDetails в модели и rest на фронте
  rest: string[],
}

export  interface IVoiceoverVariant {
  sectionIdx: number
  narrators: string[]
  srcTypes: EVoiceoverSrcType[]
}

export interface IAdditionalBookInfo {
  tabId: number
  link: string
  details: IAdditionalDetails
  voiceoverVariants: IVoiceoverVariant[]
}

// Model: Author
export interface IAuthor {
  id: string
  name: string
  trueName: string | null
}

// Model: Book
export interface IBookInfo {
  id: string
  link: string
  bookName: string
  authors: IAuthor[]
  series?: string
  numberInSeries?: number
}
