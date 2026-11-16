import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

import { createApp } from "./app";
import { connect } from "./db";
import {
  readHall,
  readMine,
  removeDraconoid,
  removeMine,
  saveDraconoid,
} from "./draconoids";
import { env } from "./env";
import {
  readBrewers,
  readBrews,
  readLatest,
  readSoloFinds,
  recordBrew,
  recordSoloBrew,
  resetSolo,
} from "./potions";
import { askAccountService, askAdminAccess } from "./session";

const pool = connect(env.databaseUrl);

const { app } = createApp({
  appOrigin: env.appOrigin,
  potions: {
    readBrewers: (potion) => readBrewers(pool, potion),
    readBrews: (userId) => readBrews(pool, userId),
    readLatest: () => readLatest(pool),
    readSoloFinds: (userId) => readSoloFinds(pool, userId),
    recordBrew: (potion, account) => recordBrew(pool, potion, account),
    recordSoloBrew: (userId, potion) => recordSoloBrew(pool, userId, potion),
    resetSolo: (userId) => resetSolo(pool, userId),
  },
  draconoids: {
    readHall: (limit) => readHall(pool, limit),
    readMine: (userId) => readMine(pool, userId),
    remove: (id) => removeDraconoid(pool, id),
    removeMine: (userId) => removeMine(pool, userId),
    save: (account, fields) => saveDraconoid(pool, account, fields),
  },
  isAdmin: askAdminAccess(env.authUrl),
  whoIs: askAccountService(env.authUrl),
});

// Production: the built site from the same origin as /api, so the session
// cookie and every request stay first-party. Any path that is not a file is
// a page of the app, which routes it itself.
if (env.staticDir) {
  const root = env.staticDir;

  app.use("/assets/*", (c, next) => {
    // Vite names every built asset after its contents, so a cached copy is never stale.
    c.header("cache-control", "public, max-age=31536000, immutable");

    return next();
  });
  app.use("*", (c, next) => {
    // The page itself is always checked, so a deploy shows at once.
    if (!c.req.path.startsWith("/assets/")) {
      c.header("cache-control", "no-cache");
    }

    return next();
  });
  app.use("*", serveStatic({ root }));
  app.get("*", serveStatic({ path: "index.html", root }));
}

serve({ fetch: app.fetch, port: env.port }, (info) => {
  console.log(`realms listening on :${info.port}`);
});
