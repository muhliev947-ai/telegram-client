import { Client } from "tdl";
import { TDLib } from "tdl-tdlib-addon";
import fs from "fs";

console.log("🚀 === VERTEX ULTIMATE TELEGRAM AGENT v3.0 ===");

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

const keywords = [
  "сайт", "сайты", "разработка", "разработчик",
  "бот", "боты", "telegram bot", "телеграм бот",
  "веб", "web", "frontend", "backend",
  "дизайн", "ui", "ux",
  "seo", "реклама", "продвижение", "лендинг"
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

// Антиспам: чтобы агент не отвечал 100 раз на один и тот же пост
const answeredMessages = new Set();

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
  console.log("🤖 Агент VERTEX работает 24/7 и слушает каналы...");
}

// Сообщения из каналов
async function onChannelMessage(msg) {
  const text = msg?.content?.text?.text?.toLowerCase() || "";
  const chatId = msg.chat_id;
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

  console.log(`💬 Личка → ${text}`);

  if (text.toLowerCase().includes("привет")) {
    await sendText(chatId, "Привет! Я агент VERTEX 😎");
  }
}

// Отправка сообщений
async function sendText(chatId, text) {
  await client.invoke({
    "@type": "sendMessage",
    chat_id: chatId,
    input_message_content: {
      "@type": "inputMessageText",
      text: { "@type": "formattedText", text },
    },
  });

  console.log(`📤 Отправлено сообщение`);
}

// Запуск клиента
(async () => {
  console.log("⏳ Запуск клиента...");
  await client.connect();
  console.log("✔ Клиент подключён. Жду QR или сообщения...");
})();
