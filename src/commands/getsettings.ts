import { Context } from 'grammy/out/context';
import { getOptions } from '../db';

const getsettings = async (ctx: Context) => {
  const options = await getOptions();
  await ctx.reply(
    `Github username: \`\`\`${options.github_username}\`\`\``
    + `CI path: \`\`\`${options.ci_path}\`\`\``
    + `CI server username: \`\`\`${options.ci_username}\`\`\``,
    { parse_mode: 'MarkdownV2' },
  );
};

export default getsettings;
