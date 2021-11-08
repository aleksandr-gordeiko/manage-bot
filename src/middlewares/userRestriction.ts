import { Context } from 'grammy/out/context';

const userRestriction = async (ctx: Context, next: () => any) => {
  if (ctx.msg.from.id.toString() !== process.env.USER_ID) {
    await ctx.reply('Only the Dungeon Master can use this bot!');
  } else {
    await next();
  }
};

export default userRestriction;
