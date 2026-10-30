/**
 * content/lab.ts — sample text for the temporary /lab page, which shows
 * the terminal building blocks on their own (milestone 2).
 *
 * HOW TO EDIT: nothing to edit here. The real winfetch rows live in
 * content/profile.ts from milestone 3; this file and app/lab/ are deleted
 * once the home page is built (milestone 4).
 */

export const lab = {
  heading: "Terminal building blocks",
  intro: "Prompt, KeyValue, TerminalWindow and Cursor, shown in both themes and at phone width.",
  themes: [
    { theme: "dark", label: "Dark" },
    { theme: "light", label: "Light" },
  ],
  eyebrows: ["whoami", "ls .\\work", "git log --career", "cat skills.json", "contact --sam"],
  command: "winfetch",
  user: "sam@mishin",
  rows: [
    { label: "OS", value: "Windows, Webflow, Vercel" },
    { label: "Host", value: "14 Acres Vineyard & Winery" },
    { label: "Kernel", value: "Marketing & Technology Lead" },
    { label: "IDE", value: "VS Code" },
    { label: "Languages", value: "JavaScript, TypeScript, Python, SQL" },
  ],
  phoneLabel: "390px wide",
} as const;
