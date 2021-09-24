import { Context } from 'telegraf';
import { addOrUpdateOptions, getOptions } from '../db';
import Options from '../types';

const setGithub = async (ctx: Context, next) => {
  const options: Options = await getOptions();
  // @ts-ignore
  const newGithubUsername = await ctx.ask(`Your current Github username is ${options.github_username}\n`
    + 'Send me a new one or "." to cancel');
  if (newGithubUsername !== '.') {
    options.github_username = newGithubUsername;
    await addOrUpdateOptions(options);
  }
  await ctx.reply('Success!');
  next();
};

export default setGithub;
