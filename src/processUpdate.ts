import { Bot } from 'grammy/out/bot';
import { Update } from './types';

const processUpdate = async (update: Update, bot: Bot) => {
  let message;
  switch (update.status) {
    case 'deployed':
      message = `✅ ${update.repository} successfully deployed`;
      break;
    default:
      message = 'An unidentified update received';
  }
  return bot.api.sendMessage(process.env.USER_ID, message);
};

export default processUpdate;
