import { exec } from 'child_process';
import { SessionContext } from '../types';
import { getOptions } from '../db';

const step1 = async (ctx: SessionContext) => {
  await ctx.reply('Please, specify your repository name');
  ctx.session.step = 'deploy_node_step2';
};

const step2 = async (ctx: SessionContext) => {
  ctx.session.options = await getOptions();
  ctx.session.repo_name = ctx.message.text;
  ctx.session.workdir = `/home/${ctx.session.options.ci_username}/${ctx.session.repo_name}`;

  const runInstall1 = 'bash -x scripts/node/install1.sh'
    + ` ${ctx.session.options.github_username}`
    + ` ${ctx.session.repo_name}`
    + ` ${ctx.session.options.ci_path}`
    + ` ${ctx.session.options.ci_username}`;
  exec(runInstall1, (error, stdout) => {
    console.log(error);
    console.log(stdout);
    if (stdout === 'NOENV\n') {
      exec(`bash -x scripts/node/install2.sh ${ctx.session.repo_name} ${ctx.session.workdir} 0`);
      ctx.reply('Success!');
      ctx.session.step = 'idle';
    } else {
      ctx.reply('Please, provide environment variables');
      ctx.session.step = 'deploy_node_step3';
    }
  });
};

const step3 = async (ctx: SessionContext) => {
  const env = ctx.message.text.split('\n');
  let runInstall2 = `bash -x scripts/node/install2.sh ${ctx.session.repo_name} ${ctx.session.workdir} ${env.length}`;
  for (const envvar of env) {
    runInstall2 += ` ${envvar}`;
  }
  exec(runInstall2, (error, stdout) => {
    console.log(error);
    console.log(stdout);
    ctx.reply('Success!');
    ctx.session.step = 'idle';
  });
};

const deployNode = async (ctx: SessionContext, stepNumber: number) => {
  const steps = [step1, step2, step3];
  await steps[stepNumber - 1](ctx);
};

export default deployNode;
