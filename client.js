// ========== ДИАГНОСТИКА ПЕРЕМЕННЫХ ==========
console.log("=== DIAGNOSTICS ===");
console.log("TELEGRAM_API_ID:", process.env.TELEGRAM_API_ID);
console.log("TELEGRAM_API_HASH:", process.env.TELEGRAM_API_HASH ? "***present***" : "MISSING");
console.log("RESET_SESSION:", process.env.RESET_SESSION);
console.log("All env keys:", Object.keys(process.env).join(", "));
console.log("===================");

// ОСТАЛЬНОЙ ВАШ КОД ИДЁТ ЗДЕСЬ (detectIntent, sendText, и т.д.)
// НО ПОКА ОСТАВЬТЕ ТОЛЬКО ДИАГНОСТИКУ ДЛЯ ПРОВЕРКИ

import { Client } from "tdl";
import { TDLib } from "tdl-tdlib-addon";

console.log("🚀 === VERTEX ULTIMATE TELEGRAM AGENT v3.3 (Stable TDLib) ===");
console.log("⏳ Запуск клиента...");

// ... остальной ваш код ...
