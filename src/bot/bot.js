import TelegramBot from "node-telegram-bot-api";
import { config } from "dotenv";
config();

import onStart from "./handlers/onStart.js";

export const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const CHANNEL_ID = "-1003461954038";

const checkIfUserSubscribed = async (chatId) => {
  try {
    const chatMember = await bot.getChatMember(CHANNEL_ID, chatId);

    if (chatMember.status === "left" || chatMember.status === "kicked") {
      return false;
    }

    return true;
  } catch (e) {
    console.log("CATCH ERROR (getChatMember):", e);
    return false; // MUHIM!
  }
};

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const firstname = msg.chat.first_name;
  const text = msg.text;

  const subscription = await checkIfUserSubscribed(chatId);

  if (!subscription) {
    return bot.sendMessage(
      chatId,
      `Hurmatli ${firstname}\n\n❗ Botdan foydalanish uchun avval quyidagi kanalga obuna bo‘ling 👇`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 Kanalga o‘tish", url: "https://t.me/muhammad_kan" }],
            [{ text: "Obunani tekshirish ✅", callback_data: "confirm_sub" }],
          ],
        },
      }
    );
  }

  if (text === "/start") return onStart(msg);

  bot.sendMessage(chatId, `Assalomu alaykum, ${firstname}`);
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;

  if (query.data === "confirm_sub") {
    const ok = await checkIfUserSubscribed(chatId);

    if (!ok) {
      return bot.answerCallbackQuery(query.id, {
        text: "❌ Siz hali obuna bo‘lmagansiz!",
      });
    }

    bot.deleteMessage(chatId, query.message.message_id);
    return onStart(query.message);
  }
});

console.log("Bot ishga tushdi..."); 
