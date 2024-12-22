/** Created by Denis Abramyan (dennila2@gmail.com) on 17.11.2024 */

import { calcRandomInt } from './math.utils'


export const calcRandomPause = (min: number, max: number, superMax: number) => {
  const shans = calcRandomInt(1, 10)

  return calcRandomInt(min, shans > 8 ? superMax : max)
}
