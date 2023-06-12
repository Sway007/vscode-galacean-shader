import { commands } from 'vscode';
import { request } from '../utils/request';

export function Login() {
  return commands.registerCommand('galacean.login', async () => {
    await request({ url: '/api2/account/auth/buc/detail' });
  });
}
