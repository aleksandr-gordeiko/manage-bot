import { InlineKeyboard } from 'grammy/out/convenience/keyboard';
import { SessionContext } from '../types';

const deploy = async (ctx: SessionContext) => {
  const inlineKeyboard = new InlineKeyboard()
    .text('Node ☋', 'deploy-node');

  await ctx.reply('What type of application do you want to deploy?', { reply_markup: inlineKeyboard });
};

export default deploy;
