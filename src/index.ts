import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { join } from "path";

const app = new Hono();

// Define the report endpoint group name
const REPORT_GROUP = "document-isolation-reports";

// Middleware to add Document-Isolation-Policy and report-to headers to all responses
app.use("*", async (c, next) => {
  // Call the next handler first
  await next();

  // Add the Document-Isolation-Policy header
  c.header("Document-Isolation-Policy", `isolate-and-require-corp; report-to="https://paperweight.page/report"`);
  c.header("Permissions-Policy", "cross-origin-isolated=(self)");
  c.header("Origin-Trial", "ApUqBGz0zGOYTRQD37/FMYHmTUemOv7wEGDjxFEJVPF9wijLe8eCB3WYhAdUsDYtqjubPn/1spil9Rl5PqP2bQAAAABheyJvcmlnaW4iOiJodHRwczovL3BhcGVyd2VpZ2h0LnBhZ2U6NDQzIiwiZmVhdHVyZSI6IkRvY3VtZW50SXNvbGF0aW9uUG9saWN5IiwiZXhwaXJ5IjoxNzUzMTQyNDAwfQ==")
});

// Handler for the report endpoint
app.post("/report", async (c) => {
  try {
    // Parse the report JSON from the request body
    const reports = await c.req.json();

    // Log the reports
    console.log("Document Isolation Policy Report:", JSON.stringify(reports, null, 2));

    // Return a success response
    return c.json({ success: true });
  } catch (error) {
    console.error("Error processing report:", error);
    return c.json({ success: false, error: "Failed to process report" }, 400);
  }
});

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
