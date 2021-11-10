import { Context } from 'grammy/out/context';
import { getOptions } from '../db';

const getsettings = async (ctx: Context) => {
  const options = await getOptions();
  await ctx.reply(
    `Github username:\n\`\`\`${options.github_username}\`\`\`\n`
    + `CI path:\n\`\`\`${options.ci_path}\`\`\`\n`
    + `CI server username:\n\`\`\`${options.ci_username}\`\`\`\n`,
    { parse_mode: 'MarkdownV2' },
  );
};

export default getsettings;
