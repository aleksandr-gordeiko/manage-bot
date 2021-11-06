import { Context } from 'grammy/out/context';
import { InlineKeyboard } from 'grammy/out/convenience/keyboard';

const settings = async (ctx: Context) => {
  const inlineKeyboard = new InlineKeyboard()
    .text('Server 🧮', 'settings-server').row()
    .text('Github 🌍', 'settings-github');

  await ctx.reply('What do you want to configure?', { reply_markup: inlineKeyboard });
};

export default settings;
