/** lib/terminal-client.test.ts — which User-Agents get the terminal résumé. */
import { describe, expect, it } from "vitest";
import { isTerminalClient } from "./terminal-client";

describe("isTerminalClient", () => {
  it.each([
    "curl/8.7.1",
    "Wget/1.21.4",
    "HTTPie/3.2.2",
    "Mozilla/5.0 (Windows NT 10.0; Microsoft Windows 10.0.26100; en-US) PowerShell/7.4.6",
    "Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.2161",
  ])("matches %s", (ua) => expect(isTerminalClient(ua)).toBe(true));

  it.each([
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1",
    "LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)",
    "Googlebot/2.1 (+http://www.google.com/bot.html)",
    "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)",
    "",
  ])("leaves browsers and link-preview bots alone: %s", (ua) => expect(isTerminalClient(ua)).toBe(false));

  it("handles a missing header", () => expect(isTerminalClient(null)).toBe(false));
});
