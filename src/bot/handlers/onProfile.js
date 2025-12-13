import { bot } from "../bot.js";
import User from "../../models/User.js";

async function onProfile(msg) {
  const chatId = msg.chat.id;
  const user = await User.findOne({ chatId });

  if (!user) return bot.sendMessage(chatId, "Profil topilmadi ❌");

  bot.sendMessage(
    chatId,
    `
👤 SHAXSIY PROFIL:

• CHAT-ID: ${user.chatId}
• ISM: ${user.firstname}
• USERNAME: @${user.username ?? "yo‘q"}
• HOLATI: ${user.active ? "FAOL" : "FAOL EMAS"}
• BALANCE: ${user.balance} so‘m
    `
  );
}

export default onProfile;
