import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { join } from "path";

const app = new Hono();

// Serve the index.html file at the root route
app.get("/", serveStatic({ path: join(process.cwd(), "public/index.html") }));

// Serve other static files from the public directory
app.use("/*", serveStatic({ root: "./public" }));

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
