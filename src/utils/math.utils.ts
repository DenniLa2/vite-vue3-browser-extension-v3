/** Created by Denis Abramyan (dennila2@gmail.com) on 04.11.2024 */

export function calcRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
