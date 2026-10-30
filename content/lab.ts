/**
 * content/lab.ts — text for the temporary /lab page, which shows the
 * terminal building blocks and the winfetch card on their own.
 *
 * HOW TO EDIT: nothing to edit here. This file and app/lab/ are deleted
 * once the home page is built (milestone 4).
 */

export const lab = {
  heading: "Terminal building blocks",
  intro: "Prompt, KeyValue, TerminalWindow, Cursor and the winfetch card, in both themes and in a phone-width column.",
  themes: [
    { theme: "dark", label: "Dark" },
    { theme: "light", label: "Light" },
  ],
  eyebrows: ["whoami", "ls .\\work", "git log --career", "cat skills.json", "contact --sam"],
  phoneLabel: "358px column (390px phone minus gutters)",
} as const;
