/** Created by Denis Abramyan (dennila2@gmail.com) on 24.12.2024 */

export const wait = async (time_ms = 1_000) => {
  return await new Promise(resolve => setTimeout(resolve, time_ms))
}
