import { Client, TDLib } from "tdl";
import { TDLib as TDLibAddon } from "tdl-tdlib-addon";
import dotenv from "dotenv";

dotenv.config();

// === TDLib ===
// Railway использует /usr/local/lib/libtdjson.so
const tdlib = new TDLibAddon("/usr/local/lib/libtdjson.so");

// === Клиент ===
const client = new Client(tdlib, {
  apiId: Number(process.env.API_ID),
  apiHash: process.env.API_HASH,
  databaseDirectory: "_td_database",
  filesDirectory: "_td_files",
});

// === Логирование TDLib ===
client.on("error", (err) => {
  console.error("TDLib ERROR:", err);
});

client.on("update", (update) => {
  console.log("UPDATE:", update);
});

// === Авторизация ===
client.on("auth-state-update", async (state) => {
  console.log("AUTH STATE:", state);

  if (state["@type"] === "authorizationStateWaitTdlibParameters") {
    console.log("Передаю TDLib параметры...");
    await client.invoke({
      "@type": "setTdlibParameters",
      parameters: {
        "@type": "tdlibParameters",
        use_test_dc: false,
        api_id: Number(process.env.API_ID),
        api_hash: process.env.API_HASH,
        system_language_code: "en",
        device_model: "Railway",
        system_version: "Linux",
        application_version: "1.0",
        enable_storage_optimizer: true,
        database_directory: "_td_database",
        files_directory: "_td_files",
      },
    });
  }

  if (state["@type"] === "authorizationStateWaitOtherDeviceConfirmation") {
    console.log("=== QR LINK ===");
    console.log(state.link);
  }

  if (state["@type"] === "authorizationStateReady") {
    console.log("=== АВТОРИЗАЦИЯ УСПЕШНА ===");
    console.log("Агент активен и слушает сообщения.");
  }
});

// === Логика лидов ===
const leadKeywords = [
  "нужен сайт",
  "нужен разработчик",
  "ищем программиста",
  "нужен бот",
  "нужен телеграм бот",
  "нужен сайт срочно",
  "нужен лендинг",
  "нужен фронтенд",
  "нужен backend",
  "нужен fullstack",
];

client.on("update", async (update) => {
  if (update["@type"] !== "updateNewMessage") return;

  const msg = update.message;
  if (!msg || !msg.content || msg.content["@type"] !== "messageText") return;

  const text = msg.content.text.text.toLowerCase();
  const chatId = msg.chat_id;

  const isLead = leadKeywords.some((k) => text.includes(k));
  if (!isLead) return;

  console.log("=== ЛИД НАЙДЕН ===");
  console.log("Чат:", chatId);
  console.log("Текст:", text);

  await client.invoke({
    "@type": "sendMessage",
    chat_id: chatId,
    input_message_content: {
      "@type": "inputMessageText",
      text: {
        "@type": "formattedText",
        text:
          "Привет! 👋\n" +
          "Я увидел, что вам нужен разработчик.\n" +
          "Готов обсудить задачу и приступить к работе!",
      },
    },
  });

  console.log("Ответ отправлен.");
});

// === Запуск ===
(async () => {
  console.log("Клиент запускается...");
  await client.connect();
  console.log("Клиент запущен. Жду QR-код или новые сообщения...");
})();
