import { Client } from "tdl";
import { TDLib } from "tdl-tdlib-addon";
import fs from "fs";

console.log("🚀 === VERTEX ULTIMATE TELEGRAM AGENT v3.1 (Smart Reply) ===");

// Очистка базы по запросу
if (process.env.RESET_AUTH === "true") {
  console.log("⚠ RESET_AUTH=true → очищаю TDLib базу...");
  try {
    fs.rmSync("_td_database", { recursive: true, force: true });
    console.log("✔ База очищена");
  } catch (err) {
    console.log("❌ Ошибка удаления базы:", err.message);
  }
}

// Инициализация TDLib
const tdlib = new TDLib();

// Создаём клиент
const client = new Client(tdlib, {
  apiId: Number(process.env.TELEGRAM_API_ID),
  apiHash: process.env.TELEGRAM_API_HASH,
  databaseDirectory: "_td_database",
  filesDirectory: "_td_files",
});

// ====== КОНФИГ АГЕНТА ======

// Ключевые слова для каналов
const keywords = [
  "сайт", "сайты", "разработка", "разработчик",
  "бот", "боты", "telegram bot", "телеграм бот",
  "веб", "web", "frontend", "backend",
  "дизайн", "ui", "ux",
  "seo", "реклама", "продвижение", "лендинг"
];

// (опционально) Белый список каналов, где можно отвечать
// Если не хочешь фильтр — оставь массив пустым или закомментируй проверку
const allowedChannels = [
  // -1001234567890,
  // -1009876543210,
];

const VERTEX_MESSAGE = `
💼 *Услуги и цены VERTEX*

🖥 *Веб‑разработка*
• Landing page — от *1500 ₽*
• Корпоративный сайт — от *3500 ₽*
• Интернет‑магазин — от *6000 ₽*
• SaaS / Dashboard — от *9000 ₽*

🎨 *Дизайн и брендинг*
• Логотип и фирменный стиль — от *1000 ₽*
• UI/UX дизайн — от *2000 ₽*

📈 *Продвижение*
• SEO — от *1500 ₽*
• Контекстная реклама — от *2000 ₽*

🤖 *Автоматизация*
• Telegram‑бот — от *1200 ₽*
• CRM‑интеграция — от *2500 ₽*

⚡️ *Скидка 10% на первый проект!*

🌐 https://next-site-self-two.vercel.app
📱 Telegram: @Fulstak_raz
📧 Email: vertexsite07@gmail.com
📞 Телефон: +7 928 092‑2250
`;

// Антиспам: чтобы не отвечать дважды на один и тот же пост
const answeredMessages = new Set();

// ====== УМНЫЙ АВТООТВЕТЧИК ДЛЯ ЛИЧКИ ======

function detectIntent(text) {
  const t = (text || "").toLowerCase();

  const intents = [
    {
      name: "website",
      keys: ["сайт", "сайты", "разработка", "лендинг", "магазин", "web", "веб", "верстка", "frontend", "backend"],
      reply: `
Здравствуйте! 👋

Мы занимаемся профессиональной веб‑разработкой:

• Landing page — от 1500 ₽  
• Корпоративный сайт — от 3500 ₽  
• Интернет‑магазин — от 6000 ₽  
• SaaS / Dashboard — от 9000 ₽  

Готовы обсудить ваш проект.  
Напишите, пожалуйста, что именно нужно сделать и есть ли примеры.

🌐 https://next-site-self-two.vercel.app
📱 @Fulstak_raz
      `
    },
    {
      name: "bot",
      keys: ["бот", "боты", "telegram bot", "телеграм бот", "автоматизация", "crm", "интеграция"],
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
      name: "design",
      keys: ["дизайн", "ui", "ux", "логотип", "фирменный стиль", "макет"],
      reply: `
Здравствуйте! 🎨

Мы делаем дизайн и брендинг:

• Логотип — от 1000 ₽  
• UI/UX дизайн — от 2000 ₽  
• Фирменный стиль — индивидуально  

Пришлите примеры, которые вам нравятся — подберём стиль.

📱 @Fulstak_raz
      `
    },
    {
      name: "marketing",
      keys: ["seo", "реклама", "продвижение", "контекст"],
      reply: `
Здравствуйте! 📈

Мы занимаемся продвижением:

• SEO — от 1500 ₽  
• Контекстная реклама — от 2000 ₽  

Напишите, какой проект нужно продвигать — я подскажу стратегию.

📱 @Fulstak_raz
      `
    },
    {
      name: "hello",
      keys: ["привет", "здравствуйте", "салам", "hello", "hi", "хай"],
      reply: `
Привет! 👋  
Я агент VERTEX. Чем могу помочь?`
    }
  ];

  for (const intent of intents) {
    if (intent.keys.some(k => t.includes(k))) {
      return intent.reply;
    }
  }

  return `
Здравствуйте! 👋

Готов помочь вам с разработкой, дизайном, ботами или продвижением.  
Напишите, пожалуйста, что именно вам нужно — и я подскажу по стоимости и срокам.

🌐 https://next-site-self-two.vercel.app
📱 @Fulstak_raz
  `;
}

// ====== ОБРАБОТКА ОБНОВЛЕНИЙ ======

client.on("error", (err) => console.error("❌ TDLib ERROR:", err));

client.on("update", async (update) => {
  if (Array.isArray(update)) {
    for (const item of update) await handleUpdate(item);
    return;
  }
  await handleUpdate(update);
});

async function handleUpdate(update) {
  const type = update._;

  // Авторизация
  if (type === "updateAuthorizationState") {
    const state = update.authorization_state;
    const stateType = state._;

    console.log("🔐 AUTH STATE:", stateType);

    if (stateType === "authorizationStateWaitPhoneNumber") {
      console.log("📲 Запрошен номер → переключаюсь на QR...");
      await client.invoke({ "@type": "requestQrCodeAuthentication" });
    }

    if (stateType === "authorizationStateWaitOtherDeviceConfirmation") {
      console.log("🔗 === QR LINK ===");
      console.log(state.link);
    }

    if (stateType === "authorizationStateReady") {
      console.log("🎉 === AUTH OK — АГЕНТ ГОТОВ ===");
      startAgent();
    }
  }

  // Новые сообщения
  if (type === "updateNewMessage") {
    const msg = update.message;

    if (msg.is_channel_post) {
      await onChannelMessage(msg);
    } else {
      await onPrivateMessage(msg);
    }
  }
}

// ====== ЛОГИКА АГЕНТА ======

function startAgent() {
  console.log("🤖 Агент VERTEX работает 24/7 и слушает каналы и личку...");
}

// Сообщения из каналов
async function onChannelMessage(msg) {
  const chatId = msg.chat_id;

  // Фильтр каналов (если список не пустой)
  if (allowedChannels.length > 0 && !allowedChannels.includes(chatId)) {
    console.log("⛔ Канал не в списке разрешённых — пропускаю");
    return;
  }

  const text = msg?.content?.text?.text?.toLowerCase() || "";
  const messageId = msg.id;

  console.log(`📡 Канал → ${text}`);

  // Антиспам
  if (answeredMessages.has(messageId)) return;
  answeredMessages.add(messageId);

  // Проверка ключевых слов
  if (keywords.some(k => text.includes(k))) {
    console.log("🎯 Найдено ключевое слово → отправляю VERTEX сообщение");
    await sendText(chatId, VERTEX_MESSAGE);
  }
}

// Личные сообщения
async function onPrivateMessage(msg) {
  const text = msg?.content?.text?.text || "";
  const chatId = msg.chat_id;

  if (!text) return;

  console.log(`💬 Личка → ${text}`);

  const reply = detectIntent(text);
  await sendText(chatId, reply);
}

// Отправка сообщений (с защитой от падений)
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

// Запуск клиента
(async () => {
  console.log("⏳ Запуск клиента...");
  await client.connect();
  console.log("✔ Клиент подключён. Жду QR или сообщения...");
})();
