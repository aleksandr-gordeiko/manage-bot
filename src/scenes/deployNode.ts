import { exec } from 'child_process';
import { SessionContext } from '../types';
import { getOptions } from '../db';

const getNullFieldKeys = (obj: object): string[] => {
  const res: string[] = [];
  for (const key in obj) {
    if (obj[key] === null) {
      res.push(key);
    }
  }
  return res;
};

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
    + ` ${ctx.session.options.ci_username}`
    + ` ${process.env.GITHUB_PAT}`;
  exec(runInstall1, (error, stdout) => {
    console.log(error);
    console.log(stdout);
    const out = stdout.slice(0, -1);

    if (error) {
      ctx.reply('❌ Could not download repository');
      ctx.session.step = 'idle';
    } else if (out === 'NOENV') {
      exec(`bash -x scripts/node/install2.sh ${ctx.session.repo_name} ${ctx.session.workdir} 0`,
        (error_, stdout_) => {
          console.log(error_);
          console.log(stdout_);
          if (error_) ctx.reply(`❌ Error: ${error_}`);
          else ctx.reply('✅ Deployment succeeded');
          ctx.session.step = 'idle';
        });
    } else {
      ctx.session.envvars = {};
      for (const envvar of out.split('\n')) {
        if (envvar.slice(-1) === '=') {
          ctx.session.envvars[envvar.slice(0, -1)] = null;
        } else {
          const split = envvar.split('=');
          ctx.session.envvars[split[0]] = split
            .slice(1)
            .join('=');
        }
      }

      ctx.reply(`Please, provide environment variable:\n\`\`\`${getNullFieldKeys(ctx.session.envvars)[0]}\`\`\``,
        { parse_mode: 'MarkdownV2' });
      ctx.session.step = 'deploy_node_step3';
    }
  });
};

const step3 = async (ctx: SessionContext) => {
  const missingEnvvars = getNullFieldKeys(ctx.session.envvars);
  if (missingEnvvars.length > 0) {
    ctx.session.envvars[missingEnvvars[0]] = ctx.message.text;
    if (missingEnvvars.length > 1) {
      await ctx.reply(`Please, provide environment variable:\n\`\`\`${missingEnvvars[1]}\`\`\``,
        { parse_mode: 'MarkdownV2' });
      return;
    }
  }

  const envFileLines: string[] = [];
  for (const envvar in ctx.session.envvars) {
    envFileLines.push(`${envvar}=${ctx.session.envvars[envvar]}`);
  }

  let runInstall2 = 'bash -x scripts/node/install2.sh'
    + ` ${ctx.session.repo_name}`
    + ` ${ctx.session.workdir}`
    + ` ${envFileLines.length}`;
  for (const line of envFileLines) {
    runInstall2 += ` ${line}`;
  }
  exec(runInstall2, (error, stdout) => {
    console.log(error);
    console.log(stdout);
    if (error) ctx.reply(`❌ Error: ${error}`);
    else ctx.reply('✅ Deployment succeeded');
    ctx.session.step = 'idle';
  });
};

const deployNode = async (ctx: SessionContext, stepNumber: number) => {
  const steps = [step1, step2, step3];
  await steps[stepNumber - 1](ctx);
};

export default deployNode;
