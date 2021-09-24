import { Context, Markup } from 'telegraf';

const settings = async (ctx: Context) => {
  const settingsList = {
    'settings-server': 'Server 🧮',
    'settings-github': 'Github 🌍',
  };
  const buttons = [];
  for (const setting in settingsList) {
    buttons.push([Markup.button.callback(settingsList[setting], `${setting}`)]);
  }

  await ctx.reply('What do you want to configure?', Markup.inlineKeyboard(buttons));
};

export default settings;
