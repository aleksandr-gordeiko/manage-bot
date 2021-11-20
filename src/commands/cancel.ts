import { SessionContext } from '../types';

const cancel = async (ctx: SessionContext) => {
  ctx.session.step = 'idle';
  await ctx.reply('Cancelled');
};

export default cancel;
