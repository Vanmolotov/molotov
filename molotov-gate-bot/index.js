import { Telegraf, Markup } from "telegraf";

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;          // @mltv_brnd
const CHANNEL_USERNAME = process.env.CHANNEL_USERNAME; // mltv_brnd
const WEBAPP_URL = process.env.WEBAPP_URL;          // https://.../tg/
const PORT = Number(process.env.PORT || 3000);

if (!BOT_TOKEN || !CHANNEL_ID || !WEBAPP_URL) {
  throw new Error("Set BOT_TOKEN, CHANNEL_ID, WEBAPP_URL in env");
}

const bot = new Telegraf(BOT_TOKEN);

async function isMember(ctx, userId) {
  const cm = await ctx.telegram.getChatMember(CHANNEL_ID, userId);
  return ["creator", "administrator", "member"].includes(cm.status);
}

function kbGate() {
  const subUrl = CHANNEL_USERNAME ? `https://t.me/${CHANNEL_USERNAME.replace("@","")}` : null;
  const rows = [];
  if (subUrl) rows.push([Markup.button.url("Подписаться", subUrl)]);
  rows.push([Markup.button.callback("Проверить доступ", "recheck")]);
  return Markup.inlineKeyboard(rows);
}

function kbOk() {
  return Markup.inlineKeyboard([
    [Markup.button.webApp("Открыть плеер", WEBAPP_URL)]
  ]);
}

async function replyGate(ctx) {
  return ctx.reply(
    "Плеер доступен только подписчикам @mltv_brnd.\n\nПодпишись и нажми «Проверить доступ».",
    kbGate()
  );
}

async function replyOk(ctx) {
  return ctx.reply("Доступ открыт 👇", kbOk());
}

bot.start(async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  try {
    const ok = await isMember(ctx, userId);
    return ok ? replyOk(ctx) : replyGate(ctx);
  } catch (e) {
    // чаще всего: бот не админ в канале или неверный CHANNEL_ID
    return ctx.reply("Не могу проверить подписку. Проверь, что бот добавлен админом в канал.");
  }
});

bot.action("recheck", async (ctx) => {
  await ctx.answerCbQuery();
  const userId = ctx.from?.id;
  if (!userId) return;

  try {
    const ok = await isMember(ctx, userId);
    return ok ? replyOk(ctx) : replyGate(ctx);
  } catch (e) {
    return ctx.reply("Не могу проверить подписку. Проверь, что бот добавлен админом в канал.");
  }
});

// Render webhook mode
bot.launch({
  webhook: process.env.WEBHOOK_URL
    ? { domain: process.env.WEBHOOK_URL, port: PORT }
    : undefined
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
