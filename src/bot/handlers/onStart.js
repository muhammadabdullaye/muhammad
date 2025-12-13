import { bot } from "../bot.js";
import User from "../../models/User.js";

async function onStart(msg) {
  const chatId = msg.chat.id;
  const firstname = msg.chat.first_name;

  let user = await User.findOne({ chatId });

  if (!user) {
    user = new User({
      chatId,
      firstname,
      username: msg.chat.username,
    });

    await user.save();
  }

  await bot.sendMessage(
    chatId,
    `
👋 Assalomu alaykum, ${firstname}!
Quyidagi menyudan bo‘lim tanlang 👇
    `,
    {
      reply_markup: {
        keyboard: [
          [{ text: "📚 Kurslar" }, { text: "✍️ Ro‘yxatdan o‘tish" }],
          [{ text: "ℹ️ Markaz haqida" }, { text: "💬 Fikr bildirish" }],
          [{ text: "❓ Yordam" }, { text: "👤 Profil" }],
        ],
        resize_keyboard: true,
      },
    }
  );
}

export default onStart;
