"use client";

/**
 * components/TerminalPrompt.tsx — the live prompt at the bottom of the
 * winfetch card. Visitors can click it and type commands (`help`, `ls`,
 * `whoami`, `cd ~/work`, `sudo hire sam`…), press Enter, and see the
 * output right there in the card, like a real terminal.
 *
 * - Commands are the same ones as the palette (content/commands.ts), run
 *   by the shared useCommandRunner. Typos and habits are forgiven
 *   (`cls`, `cd work`, `neofetch`; see lib/shell.ts and commandAliases).
 * - Tab completes, ↑/↓ recall earlier lines, Ctrl+C cancels the line.
 *   Tab is only taken over when there's something to complete, so it still
 *   moves focus for keyboard users otherwise.
 * - It's a real <input> with a visible label, so it works with screen
 *   readers, autofill off and mobile keyboards; output goes into a polite
 *   role="log" region. The native text caret is replaced by a block cursor
 *   positioned by character count, which works because the font is
 *   monospaced. Unfocused, the cursor is hollow, like Windows Terminal.
 */
import { useId, useRef, useState } from "react";
import { commandAliases, commands, terminalText as text } from "@/content/commands";
import { site } from "@/content/site";
import { complete, resolveInput } from "@/lib/shell";
import styles from "./TerminalPrompt.module.css";
import { useCommandRunner } from "./useCommandRunner";

/** How many past commands stay on screen. */
const OUTPUT_LIMIT = 8;

/** One line typed and what it printed. */
interface Entry {
  id: number;
  echo: string;
  lines: string[];
  error?: boolean;
}

const LABELS = commands.map((c) => c.label);

/** Props for {@link TerminalPrompt}. */
export interface TerminalPromptProps {
  /** Spacing class from the card (the same padding as its other prompt lines). */
  className?: string;
}

/** An interactive `PS C:\sam>` prompt with its own output. */
export function TerminalPrompt({ className }: TerminalPromptProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [column, setColumn] = useState(0);
  const [scroll, setScroll] = useState(0);
  const [focused, setFocused] = useState(false);
  const typed = useRef<string[]>([]);
  const recall = useRef(-1);
  const nextId = useRef(0);
  // The line being run, so output echoes what the visitor typed rather
  // than the command's canonical name, and whether it printed anything.
  const current = useRef({ echo: "", printed: false });
  const id = useId();

  function add(echo: string, lines: string[], error = false) {
    current.current.printed = true;
    setEntries((all) => [...all, { id: nextId.current++, echo, lines, error }].slice(-OUTPUT_LIMIT));
  }

  const run = useCommandRunner({
    kind: "terminal",
    print: (_command, lines) => add(current.current.echo, lines),
    clear: () => {
      current.current.printed = true;
      setEntries([]);
    },
    status: (_command, message) => add(current.current.echo, [message]),
    close: () => {},
    themeOrigin: () => {
      const box = inputRef.current?.getBoundingClientRect();
      return box ? { x: box.left + 8, y: box.top + box.height / 2 } : undefined;
    },
  });

  /** Keep the block cursor where the text caret is. */
  function syncCursor() {
    const input = inputRef.current;
    if (!input) return;
    setColumn(input.selectionStart ?? input.value.length);
    setScroll(input.scrollLeft);
  }

  function setLine(next: string) {
    setValue(next);
    // After React updates the input, put the caret at the end.
    requestAnimationFrame(() => {
      const input = inputRef.current;
      if (!input) return;
      input.setSelectionRange(next.length, next.length);
      syncCursor();
    });
  }

  async function submit() {
    const line = value.trim();
    setLine("");
    recall.current = -1;
    if (!line) {
      add("", []);
      return;
    }
    typed.current.push(line);
    current.current = { echo: line, printed: false };
    const command = resolveInput(line, commands, commandAliases);
    if (!command) {
      add(line, [text.notFound.replaceAll("{input}", line)], true);
      return;
    }
    await run(command);
    // Commands that only navigate (cd ~/work) still leave the line behind.
    if (!current.current.printed) add(line, []);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    if (event.key === "Enter") {
      event.preventDefault();
      void submit();
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      const history = typed.current;
      if (history.length === 0) return;
      event.preventDefault();
      const up = event.key === "ArrowUp";
      let i = recall.current === -1 ? (up ? history.length - 1 : -1) : recall.current + (up ? -1 : 1);
      i = Math.max(-1, Math.min(history.length - 1, i));
      recall.current = i;
      setLine(i === -1 ? "" : history[i]);
    } else if (event.key === "Tab" && !event.shiftKey) {
      const completed = complete(value, LABELS);
      if (completed) {
        event.preventDefault();
        setLine(completed);
      }
    } else if (event.key.toLowerCase() === "c" && event.ctrlKey && input.selectionStart === input.selectionEnd) {
      // Ctrl+C with nothing selected cancels the line, like a terminal.
      // With a selection it still copies.
      event.preventDefault();
      add(`${value}^C`, []);
      setLine("");
    }
  }

  return (
    <div className={className ? `${styles.terminal} ${className}` : styles.terminal}>
      {entries.length > 0 && (
        <div className={styles.output} role="log" aria-label={text.outputLabel}>
          {entries.map((entry) => (
            <div key={entry.id}>
              <p className={styles.echo}>
                <span className={styles.path}>{site.promptPath}</span>
                {entry.echo && <span className={styles.typed}> {entry.echo}</span>}
              </p>
              {entry.lines.map((line, i) => (
                <p key={i} className={entry.error ? styles.error : styles.line}>
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* The <label> makes the whole line clickable to focus the input. */}
      <label className={`${styles.prompt} ${focused ? styles.focused : ""}`}>
        <span className={styles.path} aria-hidden="true">
          {site.promptPath}
        </span>
        <span className={styles.field}>
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            value={value}
            aria-label={text.inputLabel}
            aria-describedby={`${id}-hint`}
            // A leading space keeps the hint clear of the block cursor.
            placeholder={` ${text.placeholder}`}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
            maxLength={80}
            onChange={(event) => {
              setValue(event.target.value);
              recall.current = -1;
            }}
            onKeyDown={onKeyDown}
            onSelect={syncCursor}
            onKeyUp={syncCursor}
            onFocus={() => {
              setFocused(true);
              syncCursor();
            }}
            onBlur={() => setFocused(false)}
          />
          <span
            className={styles.cursor}
            aria-hidden="true"
            style={{ "--col": column, "--scroll": `${scroll}px` } as React.CSSProperties}
          />
        </span>
      </label>
      <p id={`${id}-hint`} className="sr-only">
        {text.hint}
      </p>
    </div>
  );
}
