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
    // --- Приветствия и общая поддержка ---
    {
      keys: [
        "привет", "здравствуйте", "салам", "hello", "hi", "как дела",
        "что нового", "помощь", "help", "поддержка", "support",
        "вопрос", "question", "информация", "info"
      ],
      reply: `Привет! 👋 Чем могу помочь? Напишите, что вас интересует — разработка, дизайн, боты, продвижение или что‑то другое.`
    },
    // --- Цены и заказ ---
    {
      keys: [
        "цена", "price", "стоимость", "cost", "сколько стоит",
        "как заказать", "order", "заказ", "контакты", "contacts"
      ],
      reply: `
Здравствуйте! 💬

Уточните, пожалуйста, что именно вас интересует — и я сразу назову стоимость и сроки:

• Сайт / лендинг / интернет‑магазин  
• Telegram‑бот или автоматизация  
• Дизайн, логотип, брендинг  
• Маркетинг, SEO, продвижение  

🌐 https://next-site-self-two.vercel.app
📱 @Fulstak_raz
      `
    },
    // --- Веб-разработка ---
    {
      keys: [
        "сайт", "разработка", "лендинг", "магазин", "web", "веб",
        "сайтик", "веб-сайт", "интернет-магазин", "e-commerce", "ecommerce",
        "онлайн-магазин", "портал", "приложение", "app",
        "мобильное приложение", "мобилка", "ios", "android",
        "flutter", "react", "vue", "angular", "next.js", "nuxt", "svelte"
      ],
      reply: `
Здравствуйте! 👋

Мы занимаемся профессиональной веб‑разработкой:

• Landing page — от 1500 ₽  
• Корпоративный сайт — от 3500 ₽  
• Интернет‑магазин — от 6000 ₽  
• Мобильное приложение (Flutter/React Native) — от 12 000 ₽  
• SaaS / Dashboard — от 9000 ₽  

Напишите, что именно нужно сделать и есть ли примеры — подберём стек и назовём точную цену.

🌐 https://next-site-self-two.vercel.app
📱 @Fulstak_raz
      `
    },
    // --- Telegram-боты и автоматизация ---
    {
      keys: [
        "бот", "telegram bot", "телеграм бот", "автоматизация", "crm",
        "бот для телеграма", "telegram", "tg", "автоответчик",
        "парсер", "скрейпер", "scraper", "parser",
        "автопост", "автопубликация", "рассылка", "mailing", "newsletter"
      ],
      reply: `
Здравствуйте! 🤖

Мы создаём Telegram‑ботов и системы автоматизации:

• Telegram‑бот — от 1200 ₽  
• CRM‑интеграция — от 2500 ₽  
• Парсер / скрейпер — от 2000 ₽  
• Авторассылка / автопубликация — от 1500 ₽  
• Автоматизация бизнес‑процессов — индивидуально  

Расскажите, какой бот или автоматизация нужны — подскажу по стоимости и срокам.

📱 @Fulstak_raz
      `
    },
    // --- Дизайн ---
    {
      keys: [
        "дизайн", "ui", "ux", "логотип", "брендинг", "графика",
        "иллюстрация", "макет", "mockup", "прототип", "prototype",
        "веб-дизайн", "мобильный дизайн", "иконки", "icons",
        "баннер", "poster", "флаер", "flyer", "презентация", "presentation"
      ],
      reply: `
Здравствуйте! 🎨

Мы делаем дизайн и брендинг:

• Логотип — от 1000 ₽  
• UI/UX дизайн сайта или приложения — от 2000 ₽  
• Брендинг / фирменный стиль — от 3000 ₽  
• Баннер, флаер, презентация — от 500 ₽  
• Иконки и иллюстрации — от 800 ₽  

Пришлите примеры, которые вам нравятся — подберём стиль и назовём точную цену.

📱 @Fulstak_raz
      `
    },
    // --- Маркетинг и SEO ---
    {
      keys: [
        "маркетинг", "seo", "продвижение", "реклама", "ads",
        "контент", "content", "копирайтинг", "copywriting", "smm",
        "социальные сети", "instagram", "facebook", "vk", "youtube",
        "tiktok", "блог", "blog", "статьи", "articles",
        "email marketing", "email"
      ],
      reply: `
Здравствуйте! 📈

Мы занимаемся маркетингом и продвижением:

• SEO‑оптимизация — от 3000 ₽/мес  
• Таргетированная реклама (VK, Instagram, TikTok) — от 2000 ₽/мес  
• SMM‑ведение — от 4000 ₽/мес  
• Копирайтинг / статьи — от 500 ₽/шт  
• Email‑рассылки — от 1500 ₽  

Расскажите о вашем проекте — подберём стратегию и назовём стоимость.

🌐 https://next-site-self-two.vercel.app
📱 @Fulstak_raz
      `
    },
    // --- Консалтинг и стратегия ---
    {
      keys: [
        "консультация", "консультирование", "стратегия", "strategy",
        "бизнес", "business", "план", "planning",
        "аналитика", "analytics", "аудит", "audit",
        "оптимизация", "optimization"
      ],
      reply: `
Здравствуйте! 💼

Мы предоставляем консалтинг и стратегическое сопровождение:

• Бизнес‑консультация — от 1500 ₽/час  
• Аудит сайта / рекламы — от 2000 ₽  
• Разработка стратегии продвижения — от 5000 ₽  
• Аналитика и оптимизация — индивидуально  

Опишите вашу задачу — обсудим и предложим решение.

📱 @Fulstak_raz
      `
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

    // Пропускаем исходящие сообщения самого бота
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
  await client.connect();
  console.log("✔ Клиент подключён. Жду QR или сообщения...");
})();
