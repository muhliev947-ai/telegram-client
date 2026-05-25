import { Client } from "tdl";
import { TDLib } from "tdl-tdlib-addon";

console.log("🚀 === VERTEX ULTIMATE TELEGRAM AGENT v3.3 (Stable TDLib) ===");
console.log("⏳ Запуск клиента...");

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});

// === ИНИЦИАЛИЗАЦИЯ TDLib (ПАРАМЕТРЫ ТОЛЬКО ЗДЕСЬ) ===
const tdlib = new TDLib();
const client = new Client(tdlib, {
  apiId: Number(process.env.TELEGRAM_API_ID),
  apiHash: process.env.TELEGRAM_API_HASH,
  databaseDirectory: "/data/td_database",
  filesDirectory: "/data/td_files",
});

// === ИНТЕНТЫ ОТВЕТОВ (без изменений) ===
function detectIntent(text) {
  const t = text.toLowerCase();
  const intents = [
    {
      keys: ["привет", "здравствуйте", "салам", "hello", "hi", "как дела", "что нового", "помощь", "help", "поддержка", "support", "вопрос", "question", "информация", "info"],
      reply: `Привет! 👋 Чем могу помочь? Напишите, что вас интересует — разработка, дизайн, боты, продвижение или что‑то другое.`
    },
    {
      keys: ["цена", "price", "стоимость", "cost", "сколько стоит", "как заказать", "order", "заказ", "контакты", "contacts"],
      reply: `Здравствуйте! 💬 Уточните, пожалуйста, что именно вас интересует — и я сразу назову стоимость и сроки:\n\n- Сайт / лендинг / интернет‑магазин\n- Telegram‑бот или автоматизация\n- Дизайн, логотип, брендинг\n- Маркетинг, SEO, продвижение\n\n🌐 https://next-site-self-two.vercel.app\n📱 @Fulstak_raz`
    },
    {
      keys: ["сайт", "разработка", "лендинг", "магазин", "web", "веб", "сайтик", "веб-сайт", "интернет-магазин", "e-commerce", "ecommerce", "онлайн-магазин", "портал", "приложение", "app", "мобильное приложение", "мобилка", "ios", "android", "flutter", "react", "vue", "angular", "next.js", "nuxt", "svelte"],
      reply: `Здравствуйте! 👋 Мы занимаемся профессиональной веб‑разработкой:\n\n- Landing page — от 1500 ₽\n- Корпоративный сайт — от 3500 ₽\n- Интернет‑магазин — от 6000 ₽\n- Мобильное приложение (Flutter/React Native) — от 12 000 ₽\n- SaaS / Dashboard — от 9000 ₽\n\nНапишите, что именно нужно сделать и есть ли примеры — подберём стек и назовём точную цену.\n\n🌐 https://next-site-self-two.vercel.app\n📱 @Fulstak_raz`
    },
    {
      keys: ["бот", "telegram bot", "телеграм бот", "автоматизация", "crm", "бот для телеграма", "telegram", "tg", "автоответчик", "парсер", "скрейпер", "scraper", "parser", "автопост", "автопубликация", "рассылка", "mailing", "newsletter"],
      reply: `Здравствуйте! 🤖 Мы создаём Telegram‑ботов и системы автоматизации:\n\n- Telegram‑бот — от 1200 ₽\n- CRM‑интеграция — от 2500 ₽\n- Парсер / скрейпер — от 2000 ₽\n- Авторассылка / автопубликация — от 1500 ₽\n- Автоматизация бизнес‑процессов — индивидуально\n\nРасскажите, какой бот или автоматизация нужны — подскажу по стоимости и срокам.\n\n📱 @Fulstak_raz`
    },
    {
      keys: ["дизайн", "ui", "ux", "логотип", "брендинг", "графика", "иллюстрация", "макет", "mockup", "прототип", "prototype", "веб-дизайн", "мобильный дизайн", "иконки", "icons", "баннер", "poster", "флаер", "flyer", "презентация", "presentation"],
      reply: `Здравствуйте! 🎨 Мы делаем дизайн и брендинг:\n\n- Логотип — от 1000 ₽\n- UI/UX дизайн сайта или приложения — от 2000 ₽\n- Брендинг / фирменный стиль — от 3000 ₽\n- Баннер, флаер, презентация — от 500 ₽\n- Иконки и иллюстрации — от 800 ₽\n\nПришлите примеры, которые вам нравятся — подберём стиль и назовём точную цену.\n\n📱 @Fulstak_raz`
    },
    {
      keys: ["маркетинг", "seo", "продвижение", "реклама", "ads", "контент", "content", "копирайтинг", "copywriting", "smm", "социальные сети", "instagram", "facebook", "vk", "youtube", "tiktok", "блог", "blog", "статьи", "articles", "email marketing", "email"],
      reply: `Здравствуйте! 📈 Мы занимаемся маркетингом и продвижением:\n\n- SEO‑оптимизация — от 3000 ₽/мес\n- Таргетированная реклама (VK, Instagram, TikTok) — от 2000 ₽/мес\n- SMM‑ведение — от 4000 ₽/мес\n- Копирайтинг / статьи — от 500 ₽/шт\n- Email‑рассылки — от 1500 ₽\n\nРасскажите о вашем проекте — подберём стратегию и назовём стоимость.\n\n🌐 https://next-site-self-two.vercel.app\n📱 @Fulstak_raz`
    },
    {
      keys: ["консультация", "консультирование", "стратегия", "strategy", "бизнес", "business", "план", "planning", "аналитика", "analytics", "аудит", "audit", "оптимизация", "optimization"],
      reply: `Здравствуйте! 💼 Мы предоставляем консалтинг и стратегическое сопровождение:\n\n- Бизнес‑консультация — от 1500 ₽/час\n- Аудит сайта / рекламы — от 2000 ₽\n- Разработка стратегии продвижения — от 5000 ₽\n- Аналитика и оптимизация — индивидуально\n\nОпишите вашу задачу — обсудим и предложим решение.\n\n📱 @Fulstak_raz`
    }
  ];
  for (const intent of intents) {
    if (intent.keys.some(k => t.includes(k))) return intent.reply;
  }
  return `Здравствуйте! 👋\n\nГотов помочь вам с разработкой, дизайном, ботами или продвижением.\nНапишите, пожалуйста, что именно вам нужно — и я подскажу по стоимости и срокам.\n\n🌐 https://next-site-self-two.vercel.app\n📱 @Fulstak_raz`;
}

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
    console.error("❌ Ошибка отправки сообщения:", err);
  }
}

// === ОБРАБОТКА ОБНОВЛЕНИЙ (БЕЗ ВТОРИЧНОГО setTdlibParameters) ===
client.on("update", async (update) => {
  if (update._ === "updateAuthorizationState") {
    const state = update.authorization_state;
    console.log("🔐 AUTH STATE:", state._);

    // QR-код — единственный способ входа (без номера телефона)
    if (state._ === "authorizationStateWaitOtherDeviceConfirmation") {
      console.log("🔗 ============================================================");
      console.log("🔗  SCAN THIS QR CODE LINK IN TELEGRAM (Settings → Devices):");
      console.log("🔗 ", state.link);
      console.log("🔗 ============================================================");
    }

    if (state._ === "authorizationStateReady") {
      console.log("✅ ============================================================");
      console.log("✅  AUTHENTICATED — Bot is ready and listening for messages");
      console.log("✅ ============================================================");
      console.log("🤖 Агент VERTEX работает 24/7 и слушает каналы и личку...");
    }
  }

  if (update._ === "updateNewMessage") {
    const msg = update.message;
    if (msg.is_outgoing) return;
    const text = msg?.content?.text?.text || "";
    const chatId = msg.chat_id;
    console.log(`💬 Сообщение [chat_id=${chatId}] → ${text}`);
    const reply = detectIntent(text);
    await sendText(chatId, reply);
  }
});

// === СТАРТ КЛИЕНТА ===
(async () => {
  if (process.env.RESET_SESSION === 'true') {
    const fs = await import('fs');
    fs.rmSync('/data/td_database', { recursive: true, force: true });
    fs.rmSync('/data/td_files', { recursive: true, force: true });
    console.log("🗑️ Старая сессия удалена. Уберите RESET_SESSION и перезапустите.");
    process.exit(0);
  }
  await client.connect();
  console.log("✔ Клиент подключён. Жду QR-кода...");
})();
