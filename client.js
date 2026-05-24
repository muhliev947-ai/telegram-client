import fs from "fs";
import { Client } from "tdl";
import { TDLib } from "tdl-tdlib-addon";

console.log("=== CLIENT.JS STARTED ===");

// Удаляем старую базу
try {
  fs.rmSync("_td_database", { recursive: true });
  fs.rmSync("_td_files", { recursive: true });
  console.log("TDLib storage cleared.");
} catch (e) {
  console.log("No old TDLib storage.");
}

// Инициализация TDLib
const tdlib = new TDLib();

// Создаём клиент (tdl 7.1.0 использует класс Client)
const client = new Client(tdlib, {
  apiId: Number(process.env.API_ID),
  apiHash: process.env.API_HASH,
  databaseDirectory: "_td_database",
  filesDirectory: "_td_files",
});

// Ловим ошибки
client.on("error", (err) => console.error("TDLib ERROR:", err));

// Ловим обновления
client.on("update", async (update) => {
  if (update["@type"] !== "updateAuthorizationState") return;

  const state = update.authorization_state;
  console.log("AUTH STATE:", state["@type"]);

  // TDLib ждёт параметры
  if (state["@type"] === "authorizationStateWaitTdlibParameters") {
    await client.invoke({
      "@type": "setTdlibParameters",
      parameters: {
        "@type": "tdlibParameters",
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

  // QR-код
  if (state["@type"] === "authorizationStateWaitOtherDeviceConfirmation") {
    console.log("=== QR LINK ===");
    console.log(state.link);
  }

  // Успешная авторизация
  if (state["@type"] === "authorizationStateReady") {
    console.log("=== AUTH OK ===");
  }
});

// Запуск клиента
(async () => {
  console.log("Клиент запускается...");
  await client.connect();
  console.log("Клиент запущен. Жду QR-код или новые сообщения...");
})();
