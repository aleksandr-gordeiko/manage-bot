import { exec } from 'child_process';
import { SessionContext } from '../types';
import { getOptions } from '../db';

const step1 = async (ctx: SessionContext) => {
  await ctx.reply('Please, specify your repository name');
  ctx.session.step = 'deploy_node_step2';
};

const step2 = async (ctx: SessionContext) => {
  const options = await getOptions();
  const runCommand = './scripts/install.s'
    + `${options.github_username} ${ctx.message.text} ${options.ci_path} ${options.ci_username}`;
  await exec(runCommand);
  ctx.session.step = 'idle';
};

const deployNode = async (ctx: SessionContext, stepNumber: number) => {
  const steps = [step1, step2];
  await steps[stepNumber - 1](ctx);
};

export default deployNode;
