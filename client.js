import { Client } from 'tdl';
import { TDLib } from 'tdl-tdlib-addon';

// === ТВОИ ДАННЫЕ ===
const API_ID; 
const API_HASH;

// === ЛОВИМ ВСЕ НЕОБРАБОТАННЫЕ ОШИБКИ ===
process.on('unhandledRejection', e => {
  console.log('UNHANDLED REJECTION:', e);
});

process.on('uncaughtException', e => {
  console.log('UNCAUGHT EXCEPTION:', e);
});

// === КЛИЕНТ TDLib ===
const client = new Client(new TDLib('/usr/local/lib/libtdjson.so')
, {
  apiId: API_ID,
  apiHash: API_HASH,
  databaseDirectory: '_td_database',
  filesDirectory: '_td_files'
});

let paramsSet = false;

// === КЛЮЧЕВЫЕ СЛОВА ДЛЯ ЛИДОВ ===
const leadKeywords = [
  'нужен разработчик',
  'ищем разработчика',
  'нужен сайт',
  'нужен бот',
  'telegram бот',
  'телеграм бот',
  'нужен программист',
  'ищем программиста',
  'нужен фронтендер',
  'нужен фронт',
  'нужен ai',
  'нужен дизайн',
  'нужен веб',
  'нужен сайт срочно',
  'разработчик срочно',
  'нужен веб-разработчик',
  'нужен web разработчик'
];

// === ОСНОВНОЙ ОБРАБОТЧИК ОБНОВЛЕНИЙ ===
client.on('update', async update => {
  console.log('UPDATE:', update);

  // --- АВТОРИЗАЦИЯ ---
  if (update._ === 'updateAuthorizationState') {
    const state = update.authorization_state._;

    if (state === 'authorizationStateWaitTdlibParameters' && !paramsSet) {
      paramsSet = true;

      try {
        const res = await client.invoke({
          _: 'setTdlibParameters',
          parameters: {
            _: 'tdlibParameters',
            use_test_dc: false,
            database_directory: '_td_database',
            files_directory: '_td_files',
            api_id: API_ID,
            api_hash: API_HASH,
            system_language_code: 'en',
            device_model: 'PC',
            system_version: 'Linux',
            application_version: '1.0',
            enable_storage_optimizer: true
          }
        });

        console.log('setTdlibParameters OK:', res);
      } catch (e) {
        console.log('setTdlibParameters ERROR:', e);
      }
    }

    if (state === 'authorizationStateWaitPhoneNumber') {
      console.log('Запрашиваю QR-код...');

      try {
        const res = await client.invoke({
          _: 'requestQrCodeAuthentication',
          other_user_ids: []
        });
        console.log('requestQrCodeAuthentication OK:', res);
      } catch (e) {
        console.log('requestQrCodeAuthentication ERROR:', e);
      }
    }

    if (state === 'authorizationStateWaitOtherDeviceConfirmation') {
      console.log('\n=== QR LINK ===');
      console.log(update.authorization_state.link);
      console.log('Открой эту ссылку в Telegram, чтобы авторизоваться.');
      console.log('===============\n');
    }

    return;
  }

  // --- ОБРАБОТКА НОВЫХ СООБЩЕНИЙ (АГЕНТ VERTEX) ---
  if (update._ === 'updateNewMessage') {
    const msg = update.message;

    const chatId = msg.chat_id;
    const senderId = msg.sender_id?.user_id;

    const textRaw =
      msg.content?._ === 'messageText'
        ? msg.content.text.text
        : null;

    if (!textRaw) return;

    const text = textRaw.toLowerCase();

    // проверяем, есть ли ключевые слова
    const isLead = leadKeywords.some(keyword => text.includes(keyword));
    if (!isLead) return;

    console.log('НАЙДЕН ЛИД! От:', senderId, 'Текст:', textRaw);

    const reply = `
Здравствуйте! 👋  
Мы увидели, что вам требуется разработчик.

Мы — **VERTEX**, команда по веб‑разработке, дизайну и автоматизации.

🔗 Наш сайт: https://next-site-self-two.vercel.app  
🤖 Наш Telegram‑бот: https://xn--80affa3aj0al.xn--80asehdb/web/#@Official_assist_bot  

📌 **Услуги и цены:**

🖥 *Веб‑разработка*  
• Landing page — от 1500 ₽  
• Корпоративный сайт — от 3500 ₽  
• Интернет-магазин — от 6000 ₽  
• SaaS / Dashboard — от 9000 ₽  

🎨 *Дизайн и брендинг*  
• Логотип и фирменный стиль — от 1000 ₽  
• UI/UX дизайн сайта — от 2000 ₽  

📈 *Продвижение*  
• SEO — от 1500 ₽  
• Контекстная реклама — от 2000 ₽  

🤖 *Автоматизация*  
• Telegram‑бот — от 1200 ₽  
• CRM интеграция — от 2500 ₽  

⚡️ *Скидка 10% на первый проект!*  

Если интересно — можем обсудить детали прямо сейчас 😊
    `;

    try {
      await client.invoke({
        _: 'sendMessage',
        chat_id: chatId,
        input_message_content: {
          _: 'inputMessageText',
          text: {
            _: 'formattedText',
            text: reply
          }
        }
      });

      console.log('Ответ отправлен в чат', chatId);
    } catch (e) {
      console.log('Ошибка при отправке ответа:', e);
    }
  }
});

// === СТАРТ КЛИЕНТА ===
(async () => {
  try {
    await client.connect();
    console.log('Клиент запущен. Жду QR-код или новые сообщения...');
  } catch (e) {
    console.log('CONNECT ERROR:', e);
  }
})();
