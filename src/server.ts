import Koa from 'koa';
import { Update } from './types';

const cors = require('@koa/cors');

const sleep = (ms: number) => new Promise((resolve) => { setTimeout(resolve, ms); });

const Server = class {
  private updates: Update[];

  private server: Koa;

  constructor() {
    this.updates = [];
    this.server = new Koa();
    this.server.use(cors());

    this.server.use(async (ctx) => {
      const data: Update = ctx.request.query;
      this.updates.push(data);
    });
  }

  runServer(port: number) {
    this.server.listen(port);
    console.log(`Server running on port ${port}`);
  }

  async getUpdate(): Promise<Update> {
    while (this.updates.length === 0) {
      await sleep(3000);
    }
    return this.updates.pop();
  }
};

export default Server;
