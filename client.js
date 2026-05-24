import { Client } from "tdl";
import { TDLib } from "tdl-tdlib-addon";
import fs from "fs";

console.log("=== CLIENT.JS STARTED ===");

if (process.env.RESET_AUTH === "true") {
  console.log("RESET_AUTH=true detected — clearing TDLib database...");
  try {
    fs.rmSync("_td_database", { recursive: true, force: true });
    console.log("Database cleared successfully.");
  } catch (err) {
    console.log("Warning: Could not delete database folder:", err.message);
  }
}

// Инициализация TDLib
const tdlib = new TDLib();

// Создаём клиент (tdl 7.1.0)
const client = new Client(tdlib, {
  apiId: Number(process.env.TELEGRAM_API_ID),
  apiHash: process.env.TELEGRAM_API_HASH,
  databaseDirectory: "_td_database",
  filesDirectory: "_td_files",
});

// Ловим ошибки
client.on("error", (err) => console.error("TDLib ERROR:", err));

// Ловим ВСЕ обновления (важно!)
client.on("update", async (update) => {
  // Логируем полную структуру объекта, чтобы видеть реальный формат от TDLib
  console.log("UPDATE:", JSON.stringify(update));

  // tdl переименовывает @type -> _ внутри библиотеки перед эмитом события,
  // поэтому используем "_" вместо "@type"
  // Если вдруг пришёл массив — обрабатываем каждый элемент отдельно
  if (Array.isArray(update)) {
    console.log("UPDATE is an array, processing each item...");
    for (const item of update) {
      await handleUpdate(item);
    }
    return;
  }

  await handleUpdate(update);
});

async function handleUpdate(update) {
  const updateType = update["_"] || update["@type"];
  console.log("UPDATE TYPE:", updateType);

  if (updateType !== "updateAuthorizationState") return;

  const state = update.authorization_state;
  if (!state) {
    console.log("AUTH STATE: missing authorization_state field, full update:", JSON.stringify(update));
    return;
  }

  const stateType = state["_"] || state["@type"];
  console.log("AUTH STATE:", stateType);

  // Примечание: setTdlibParameters и checkDatabaseEncryptionKey уже
  // обрабатываются внутри tdl автоматически — дублировать не нужно.

  // Если TDLib запросил номер телефона — переключаемся на QR-код
  if (stateType === "authorizationStateWaitPhoneNumber") {
    console.log("Phone number requested, requesting QR code instead...");
    await client.invoke({
      "@type": "requestQrCodeAuthentication",
    });
  }

  // QR-код
  if (stateType === "authorizationStateWaitOtherDeviceConfirmation") {
    console.log("=== QR LINK ===");
    console.log(state.link);
  }

  // Успешная авторизация
  if (stateType === "authorizationStateReady") {
    console.log("=== AUTH OK ===");
  }
}

// Запуск клиента
(async () => {
  console.log("Клиент запускается...");
  await client.connect();
  console.log("Клиент запущен. Жду QR-код или новые сообщения...");
})();
