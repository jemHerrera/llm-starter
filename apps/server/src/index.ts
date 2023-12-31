import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mikroOrmConfig from "./db/_config/mikroOrmConfig";
import { MikroORM, RequestContext, EntityManager } from "@mikro-orm/core";
import router from "./router";

export const DI = {} as {
  server: http.Server;
  orm: MikroORM;
  em: EntityManager;
};

export const app = express();
const port = process.env.PORT || 4000;

export const init = (async () => {
  DI.orm = await MikroORM.init(mikroOrmConfig);
  DI.em = DI.orm.em;

  app.use(cors());
  app.use(compression());
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use((req, res, next) => RequestContext.create(DI.orm.em, next));

  DI.server = http.createServer(app);

  DI.server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });

  app.use("/", router());
})();
