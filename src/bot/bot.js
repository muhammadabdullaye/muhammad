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
    return false;
  }
};

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const firstname = msg.chat.first_name;
  const text = msg.text?.trim();

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

  // /start
  if (text === "/start") {
    return onStart(msg);
  }

  // ===== MENYU TUGMALARI =====

  if (text === "📚 Kurslar") {
    return bot.sendMessage(
      chatId,
      `📚 Bizning kurslarimiz:

1️⃣ Web dasturlash
2️⃣ Backend (Node.js)
3️⃣ Telegram bot yaratish
4️⃣ Grafik dizayn`
    );
  }

  if (text === "✍️ Ro‘yxatdan o‘tish") {
    return bot.sendMessage(
      chatId,
      `✍️ Ro‘yxatdan o‘tish uchun:

Ism va familiyangizni yozing
📞 Telefon raqamingizni yuboring`
    );
  }

  if (text === "ℹ️ Markaz haqida") {
    return bot.sendMessage(
      chatId,
      `ℹ️ O‘quv markazimiz haqida:

🏫 Zamonaviy sinflar
👨‍🏫 Tajribali ustozlar
🎓 Sertifikat beriladi`
    );
  }

  if (text === "💬 Fikr bildirish") {
    return bot.sendMessage(
      chatId,
      `💬 Taklif yoki shikoyatingizni yozib qoldiring.
Biz albatta ko‘rib chiqamiz ✅`
    );
  }

  if (text === "❓ Yordam") {
    return bot.sendMessage(
      chatId,
      `❓ Yordam bo‘limi:

/start — botni qayta ishga tushirish
Menyudan kerakli bo‘limni tanlang`
    );
  }

  if (text === "👤 Profil") {
    return bot.sendMessage(
      chatId,
      `👤 Sizning profilingiz:

🆔 ID: ${msg.from.id}
👤 Ism: ${firstname}
🔗 Username: @${msg.from.username || "yo‘q"}`
    );
  }

  // Agar hech qaysi tugma bosilmasa
  return bot.sendMessage(chatId, `Assalomu alaykum, ${firstname}`);
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
