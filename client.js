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

// ВАЖНО: без пути!
const tdlib = new TDLib();

const client = new Client(tdlib, {
  apiId: Number(process.env.API_ID),
  apiHash: process.env.API_HASH,
  databaseDirectory: "_td_database",
  filesDirectory: "_td_files",
});

client.on("error", (err) => console.error("TDLib ERROR:", err));

client.on("auth-state-update", async (state) => {
  console.log("AUTH STATE:", state["@type"]);

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

  if (state["@type"] === "authorizationStateWaitOtherDeviceConfirmation") {
    console.log("=== QR LINK ===");
    console.log(state.link);
  }

  if (state["@type"] === "authorizationStateReady") {
    console.log("=== AUTH OK ===");
  }
});

(async () => {
  console.log("Клиент запускается...");
  await client.connect();
  console.log("Клиент запущен. Жду QR-код или новые сообщения...");
})();
