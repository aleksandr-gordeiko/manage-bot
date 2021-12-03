import { Context } from 'grammy/out/context';
import { SessionFlavor } from 'grammy/out/convenience/session';

interface Options {
  github_username?: string,
  ci_path?: string,
  ci_username?: string
}

interface SessionData {
  step:
  'idle' |
  'github_settings_step1' |
  'github_settings_step2' |
  'server_settings_step1' |
  'server_settings_step2' |
  'server_settings_step3' |
  'deploy_node_step1' |
  'deploy_node_step2' |
  'deploy_node_step3';
  options?: Options;
  repo_name?: string;
  workdir?: string;
  envvars?: object;
}
type SessionContext = Context & SessionFlavor<SessionData>;

interface Update {
  repository: string
  status: string
}

export {
  Options,
  SessionData,
  SessionContext,
  Update,
};
