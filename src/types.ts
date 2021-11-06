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
  'server_settings_step3';
  options?: Options;
}
type SessionContext = Context & SessionFlavor<SessionData>;

export { Options, SessionData, SessionContext };
