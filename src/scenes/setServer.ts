import { SessionContext } from '../types';
import { addOrUpdateOptions, getOptions } from '../db';

const step1 = async (ctx: SessionContext) => {
  ctx.session.options = await getOptions();
  await ctx.reply(`Your current CI server username is "${ctx.session.options.ci_username}"\n`
    + 'Send me a new one or "." to go next');
  ctx.session.step = 'server_settings_step2';
};

const step2 = async (ctx: SessionContext) => {
  const userReply = ctx.message.text;
  if (userReply !== '.') {
    ctx.session.options.ci_username = userReply;
    await addOrUpdateOptions(ctx.session.options);
  }
  await ctx.reply('Very good!\n'
    + `Your current CI path is "${ctx.session.options.ci_path}"\n`
    + 'Send me a new one or "." to finish');
  ctx.session.step = 'server_settings_step3';
};

const step3 = async (ctx: SessionContext) => {
  const userReply = ctx.message.text;
  if (userReply !== '.') {
    ctx.session.options.ci_path = userReply;
    await addOrUpdateOptions(ctx.session.options);
  }
  await ctx.reply('Success!');
  ctx.session.step = 'idle';
};

const setServer = async (ctx: SessionContext, stepNumber: number) => {
  const steps = [step1, step2, step3];
  await steps[stepNumber - 1](ctx);
};

export default setServer;
