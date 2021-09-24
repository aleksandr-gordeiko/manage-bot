import { Telegraf } from 'telegraf';
import TelegrafQuestion from 'telegraf-question';
import { connectDB, closeConnection } from './db';

import error from './middlewares/error';

import deploy from './commands/deploy';

import setServer from './functions/setServer';
import setGithub from './functions/setGithub';
import settings from './commands/settings';

const bot: Telegraf = new Telegraf(process.env.BOT_API_TOKEN);

bot.use(error);
// @ts-ignore
bot.use(TelegrafQuestion());

bot.command('deploy', deploy);
bot.command('settings', settings);

bot.action('settings-server', async (ctx) => {
  ctx.answerCbQuery();
  await setServer(ctx);
});

bot.action('settings-github', async (ctx) => {
  ctx.answerCbQuery();
  await setGithub(ctx);
});

process.once('SIGINT', () => {
  closeConnection()
    .then(() => console.log('SIGINT occurred, exiting'))
    .catch(() => console.log('SIGINT occurred, exiting with no db connection closed'));
});
process.once('SIGTERM', () => {
  closeConnection()
    .then(() => console.log('SIGTERM occurred, exiting'))
    .catch(() => console.log('SIGTERM occurred, exiting with no db connection closed'));
});

connectDB()
  .then(() => bot.launch())
  .catch((err) => console.log(err));
