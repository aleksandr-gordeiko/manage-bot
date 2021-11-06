import { addOrUpdateOptions, getOptions } from '../db';

const step1 = async (ctx) => {
  ctx.session.options = await getOptions();
  await ctx.reply(`Your current Github username is ${ctx.session.options.github_username}\n`
    + 'Send me a new one or "." to cancel');
};

const step2 = async (ctx) => {
  const newUsername = ctx.message.text;
  if (newUsername !== '.') {
    ctx.session.options.github_username = newUsername;
    await addOrUpdateOptions(ctx.session.options);
    await ctx.reply('Success!');
  } else {
    await ctx.reply('Canceled');
  }
};

const setGithub = async (ctx, stepNumber: number) => {
  const steps = [step1, step2];
  await steps[stepNumber - 1](ctx);
};

export default setGithub;
