import { Client } from "tdl";
import { TDLib } from "tdl-tdlib-addon";

const tdlib = new TDLib("/usr/local/lib/libtdjson.so");

const client = new Client(tdlib, {
  apiId: Number(process.env.API_ID),
  apiHash: process.env.API_HASH,
});

client.on("auth-state-update", async (state) => {
  console.log("AUTH:", state["@type"]);

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
        database_directory: "_db",
        files_directory: "_files",
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
  console.log("STARTING...");
  await client.connect();
  console.log("CONNECTED. WAITING FOR QR...");
})();
