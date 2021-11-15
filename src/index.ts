import { Bot } from 'grammy/out/bot';
import { session } from 'grammy/out/convenience/session';
import { Router } from '@grammyjs/router';
import { connectDB, closeConnection } from './db';
import { SessionContext, SessionData } from './types';

import error from './middlewares/error';
import userRestriction from './middlewares/userRestriction';

import deploy from './commands/deploy';
import settings from './commands/settings';
import getsettings from './commands/getsettings';

import setServer from './scenes/setServer';
import setGithub from './scenes/setGithub';
import deployNode from './scenes/deployNode';

const bot = new Bot<SessionContext>(process.env.BOT_API_TOKEN);
bot.use(session({ initial: (): SessionData => ({ step: 'idle' }) }));
const router = new Router<SessionContext>((ctx) => ctx.session.step);

router.route('github_settings_step2', async (ctx) => { await setGithub(ctx, 2); });

router.route('server_settings_step2', async (ctx) => { await setServer(ctx, 2); });
router.route('server_settings_step3', async (ctx) => { await setServer(ctx, 3); });

router.route('deploy_node_step2', async (ctx) => { await deployNode(ctx, 2); });

bot.use(error);
bot.use(userRestriction);
bot.use(router);

bot.command('deploy', deploy);
bot.command('settings', settings);
bot.command('getsettings', getsettings);

bot.callbackQuery('settings-server', async (ctx) => {
  await ctx.answerCallbackQuery();
  await setServer(ctx, 1);
});

bot.callbackQuery('settings-github', async (ctx) => {
  await ctx.answerCallbackQuery();
  await setGithub(ctx, 1);
});

bot.callbackQuery('deploy-node', async (ctx) => {
  await ctx.answerCallbackQuery();
  await deployNode(ctx, 1);
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
  .then(() => bot.start())
  .catch((err) => console.log(err));
