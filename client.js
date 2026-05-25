import { Client } from "tdl";
import { TDLib } from "tdl-tdlib-addon";

console.log("🚀 === VERTEX ULTIMATE TELEGRAM AGENT v3.3 (Stable TDLib) ===");
console.log("⏳ Запуск клиента...");

// === ГЛОБАЛЬНАЯ ЗАЩИТА ОТ ПАДЕНИЙ ===
process.on("unhandledRejection", (err) => {
  console.log("❌ Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.log("❌ Uncaught Exception:", err);
});

// === ИНИЦИАЛИЗАЦИЯ TDLib ===
const tdlib = new TDLib();

const client = new Client(tdlib, {
  apiId: Number(process.env.TELEGRAM_API_ID),
  apiHash: process.env.TELEGRAM_API_HASH,

  // Храним базу в RAM → не переполняется, не ломается
  databaseDirectory: "/tmp/td_database",
  filesDirectory: "/tmp/td_files",
});

// === УМНЫЙ АВТООТВЕТЧИК ===
function detectIntent(text) {
  const t = text.toLowerCase();

  const intents = [
    {
      keys: ["сайт", "разработка", "лендинг", "магазин", "web", "веб"],
      reply: `
Здравствуйте! 👋

Мы занимаемся профессиональной веб‑разработкой:

• Landing page — от 1500 ₽  
• Корпоративный сайт — от 3500 ₽  
• Интернет‑магазин — от 6000 ₽  
• SaaS / Dashboard — от 9000 ₽  

Напишите, пожалуйста, что именно нужно сделать и есть ли примеры.

🌐 https://next-site-self-two.vercel.app
📱 @Fulstak_raz
      `
    },
    {
      keys: ["бот", "telegram bot", "телеграм бот", "автоматизация", "crm"],
      reply: `
Здравствуйте! 🤖

Мы создаём Telegram‑ботов и автоматизацию:

• Telegram‑бот — от 1200 ₽  
• CRM‑интеграция — от 2500 ₽  
• Автоматизация процессов — индивидуально  

Расскажите, какой бот вам нужен — я подскажу по стоимости и срокам.

📱 @Fulstak_raz
      `
    },
    {
      keys: ["дизайн", "ui", "ux", "логотип"],
      reply: `
Здравствуйте! 🎨

Мы делаем дизайн и брендинг:

• Логотип — от 1000 ₽  
• UI/UX дизайн — от 2000 ₽  

Пришлите примеры, которые вам нравятся — подберём стиль.

📱 @Fulstak_raz
      `
    },
    {
      keys: ["привет", "здравствуйте", "салам", "hello", "hi"],
      reply: `Привет! 👋 Чем могу помочь?`
    }
  ];

  for (const intent of intents) {
    if (intent.keys.some(k => t.includes(k))) return intent.reply;
  }

  return `
Здравствуйте! 👋

Готов помочь вам с разработкой, дизайном, ботами или продвижением.  
Напишите, пожалуйста, что именно вам нужно — и я подскажу по стоимости и срокам.

🌐 https://next-site-self-two.vercel.app
📱 @Fulstak_raz
  `;
}

// === ОТПРАВКА СООБЩЕНИЙ ===
async function sendText(chatId, text) {
  try {
    await client.invoke({
      "@type": "sendMessage",
      chat_id: chatId,
      input_message_content: {
        "@type": "inputMessageText",
        text: { "@type": "formattedText", text },
      },
    });

    console.log(`📤 Отправлено сообщение в чат ${chatId}`);
  } catch (err) {
    console.log("❌ Ошибка отправки сообщения:", err);
  }
}

// === ОБРАБОТКА ОБНОВЛЕНИЙ ===
client.on("update", async (update) => {
  if (update._ === "updateAuthorizationState") {
    const state = update.authorization_state;
    console.log("🔐 AUTH STATE:", state._);

    // === ОПТИМИЗИРОВАННЫЙ TDLib CONFIG С TRY/CATCH ===
    if (state._ === "authorizationStateWaitTdlibParameters") {
      try {
        await client.invoke({
          "@type": "setTdlibParameters",
          parameters: {
            "@type": "tdlibParameters",
            use_test_dc: false,

            database_directory: "/tmp/td_database",
            files_directory: "/tmp/td_files",

            use_file_database: false,
            use_chat_info_database: false,
            use_message_database: false,
            use_secret_chats: false,

            api_id: Number(process.env.TELEGRAM_API_ID),
            api_hash: process.env.TELEGRAM_API_HASH,

            system_language_code: "ru",
            device_model: "Railway",
            system_version: "Linux",
            application_version: "1.0",

            enable_storage_optimizer: true,
            ignore_file_names: true
          }
        });
      } catch (err) {
        console.log("❌ Ошибка setTdlibParameters:", err);
      }
    }

    // === QR-КОД ===
    if (state._ === "authorizationStateWaitOtherDeviceConfirmation") {
      console.log("🔗 === QR LINK ===");
      console.log(state.link);
    }

    // === ГОТОВО ===
    if (state._ === "authorizationStateReady") {
      console.log("🎉 === AUTH OK — АГЕНТ ГОТОВ ===");
      console.log("🤖 Агент VERTEX работает 24/7 и слушает каналы и личку...");
    }
  }

  // === НОВЫЕ СООБЩЕНИЯ ===
  if (update._ === "updateNewMessage") {
    const msg = update.message;

    // Пропускаем исходящие сообщения (отправленные самим ботом)
    if (msg.is_outgoing) return;

    const chatId = msg.chat_id;

    // Проверяем, что чат является личной перепиской (не канал и не группа)
    let chat;
    try {
      chat = await client.invoke({ "@type": "getChat", chat_id: chatId });
    } catch (err) {
      console.log("❌ Ошибка получения чата:", err);
      return;
    }

    if (chat?.type?._ !== "chatTypePrivate") return;

    const text = msg?.content?.text?.text || "";
    console.log(`💬 Личка → ${text}`);

    const reply = detectIntent(text);
    await sendText(chatId, reply);
  }
});

// === СТАРТ КЛИЕНТА ===
(async () => {
  await client.connect();
  console.log("✔ Клиент подключён. Жду QR или сообщения...");
})();
