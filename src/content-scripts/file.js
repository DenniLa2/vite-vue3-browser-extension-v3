/** Created by Denis Abramyan (dennila2@gmail.com) on 26.12.2024 */

(() => {
  // todo remove
  console.log(' *---> FILE.JS (CS) <---* ');

  if (window.frameElement) {
    console.log('Скрипт запущен внутри фрейма:', window.frameElement);
  } else {
    console.log('Скрипт запущен в основном документе.');
  }
})()
