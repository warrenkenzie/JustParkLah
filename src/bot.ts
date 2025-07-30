import dotenv from "dotenv";
import { Bot } from "grammy";
dotenv.config();

// Create a bot object
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!); // <-- place your bot token in this string


// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("Welcome to parking analysis! Please share your current location"));

// Handle other messages.
bot.on("message", (ctx) => console.log(ctx.update.message.location));

// Start the bot (using long polling)
bot.start();