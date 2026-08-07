import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  // tinte's own design system, fetched by agents without a session.
  "/design.md",
  "/tokens.css",
  // Crawler surfaces. These were already unreachable behind auth before the
  // /legacy move; listing them here is what makes the new design.md entry in
  // robots.txt actually fetchable.
  "/robots.txt",
  "/sitemap.xml",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/themes/slug/(.*)",
  "/api/themes/public(.*)",
  "/api/figma(.*)",
  "/api/preset(.*)",
  "/api/skill(.*)",
  "/api/generate-vscode-theme(.*)",
  "/legacy(.*)",
  "/workbench(.*)",
  "/experiment(.*)",
  "/themes",
  "/themes/(.*)",
  "/bingo(.*)",
  "/vscode(.*)",
  "/r/(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
