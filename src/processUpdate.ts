import { Bot } from 'grammy/out/bot';
import { Update } from './types';

const processUpdate = async (update: Update, bot: Bot) => {
  let message;
  switch (update.status) {
    case 'deploy_success':
      message = `✅ ${update.repository} successfully deployed`;
      break;
    case 'deploy_fail':
      message = `❌ ${update.repository} deployment failed`;
      break;
    default:
      message = 'An unidentified update received';
  }
  return bot.api.sendMessage(process.env.USER_ID, message);
};

export default processUpdate;
