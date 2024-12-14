/** Created by Denis Abramyan (dennila2@gmail.com) on 13.12.2024 */

import { EMessageEvent } from '@/types/enums'


export interface IMessage {
  event: EMessageEvent
  payload?: any
}
