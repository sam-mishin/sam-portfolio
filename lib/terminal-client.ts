/**
 * lib/terminal-client.ts — recognises command-line HTTP clients, so
 * proxy.ts can answer `curl <site>` with the terminal résumé instead of a
 * wall of HTML.
 *
 * Matched by the User-Agent each tool sends by default:
 * - curl/8.7.1
 * - Wget/1.21.4
 * - HTTPie/3.2.2
 * - PowerShell: Invoke-WebRequest / Invoke-RestMethod (`iwr`, `irm`) send
 *   "... WindowsPowerShell/5.1..." or "... PowerShell/7.4.6"
 * Browsers never send these, so normal visitors always get the web page.
 */

const TERMINAL_CLIENTS = /^(curl|wget|httpie)\/|\b(Windows)?PowerShell\/\d/i;

/** True if this User-Agent belongs to a terminal HTTP client. */
export function isTerminalClient(userAgent: string | null | undefined): boolean {
  return Boolean(userAgent && TERMINAL_CLIENTS.test(userAgent));
}
