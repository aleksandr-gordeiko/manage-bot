import { addOrUpdateOptions, getOptions } from '../db';
import { SessionContext } from '../types';

const step1 = async (ctx: SessionContext) => {
  ctx.session.options = await getOptions();
  await ctx.reply(`Your current Github username is "${ctx.session.options.github_username}"\n`
    + 'Send me a new one or "." to cancel');
  ctx.session.step = 'github_settings_step2';
};

const step2 = async (ctx: SessionContext) => {
  const newUsername = ctx.message.text;
  if (newUsername !== '.') {
    ctx.session.options.github_username = newUsername;
    await addOrUpdateOptions(ctx.session.options);
    await ctx.reply('Success!');
  } else {
    await ctx.reply('Canceled');
  }
  ctx.session.step = 'idle';
};

const setGithub = async (ctx: SessionContext, stepNumber: number) => {
  const steps = [step1, step2];
  await steps[stepNumber - 1](ctx);
};

export default setGithub;
