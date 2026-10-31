"use client";

/**
 * components/CommandPalette.tsx — the "Search /" button in the header and
 * the Windows Terminal–style command palette it opens. Press / or
 * Ctrl+K (⌘K on a Mac) anywhere to open it, except while typing in a
 * field. Commands and wording come from content/commands.ts; filtering
 * and arrow-key logic live in lib/palette.ts (unit-tested).
 *
 * Accessibility, following the ARIA combobox pattern:
 * - The palette is a native <dialog> opened with showModal(), so focus is
 *   trapped inside, Esc closes it, the page behind is inert, and focus
 *   returns to whatever had it before.
 * - Focus stays in the text box the whole time. ↑/↓ move a highlight
 *   through the results, announced via aria-activedescendant, and Enter
 *   runs the highlighted command.
 * - Results of actions ("✓ copied to clipboard") are printed in a polite
 *   live region, like a terminal printing output.
 * - Shell commands (`ls`, `git log --oneline`, `history`…) print into an
 *   output pane above the results, a role="log" region, so screen readers
 *   hear new output. The output and history last for the visit.
 */
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { commands, paletteText as text } from "@/content/commands";
import { site } from "@/content/site";
import { filterCommands, flatten, isPaletteShortcut, moveIndex } from "@/lib/palette";
import styles from "./CommandPalette.module.css";
import { useCommandRunner } from "./useCommandRunner";

/** How many past commands the output pane keeps. */
const OUTPUT_LIMIT = 6;

/** One command and what it printed. */
interface OutputEntry {
  id: number;
  command: string;
  lines: string[];
}

/** Header search button plus the command palette dialog. */
export function CommandPalette() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState("");
  const [output, setOutput] = useState<OutputEntry[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const id = useId();

  const groups = useMemo(() => filterCommands(commands, query), [query]);
  const items = flatten(groups);
  const optionId = (index: number) => `${id}-option-${index}`;

  function show() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    // Every open starts fresh, like a new prompt.
    setQuery("");
    setActive(0);
    setStatus("");
    dialog.showModal();
    setOpen(true);
    inputRef.current?.focus();
  }

  const close = () => dialogRef.current?.close();

  // The global shortcut. Listening on document (not window) lets a field
  // that handles "/" itself call preventDefault and keep its keystroke.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) return;
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (!isPaletteShortcut({ ...pick(event), target })) return;
      event.preventDefault();
      show();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);


  // Keep the highlighted row visible when arrowing through a long list.
  useEffect(() => {
    if (!open) return;
    document.getElementById(optionId(active))?.scrollIntoView({ block: "nearest" });
    // optionId only depends on `id`, which never changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, open]);

  // Keep the newest output in view.
  useEffect(() => {
    const pane = outputRef.current;
    if (pane) pane.scrollTop = pane.scrollHeight;
  }, [output]);

  /** Add a command and its lines to the output pane, like a shell would. */
  function print(command: string, lines: string[]) {
    const entry = { id: nextId.current++, command, lines };
    setOutput((current) => [...current, entry].slice(-OUTPUT_LIMIT));
  }

  // What running a command does lives in useCommandRunner, shared with the
  // prompt in the winfetch card; this says how the palette shows results.
  const run = useCommandRunner({
    kind: "palette",
    print,
    clear: () => {
      setOutput([]);
      setStatus("");
    },
    status: (_command, message) => setStatus(message),
    close,
    showAll: () => {
      setQuery("");
      setActive(0);
      inputRef.current?.focus();
    },
  });

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      // Stop the caret jumping to the start/end of the text.
      event.preventDefault();
      setActive((current) => moveIndex(current, event.key === "ArrowDown" ? 1 : -1, items.length));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const command = items[active];
      if (command) void run(command);
    }
  }

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-keyshortcuts="/ Control+K Meta+K"
        onClick={show}
      >
        <svg className={styles.searchIcon} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <span className={styles.triggerText}>
          {text.openButton} <kbd className={styles.kbd}>/</kbd>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={text.label}
        onClose={() => setOpen(false)}
        // A click whose target is the <dialog> itself landed on the
        // backdrop (the content fills the box), so treat it as "close".
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className={styles.inputRow}>
          <span className={styles.caret} aria-hidden="true">
            &gt;
          </span>
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            role="combobox"
            aria-label={text.inputLabel}
            aria-expanded={items.length > 0}
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            aria-activedescendant={items[active] ? optionId(active) : undefined}
            placeholder={text.placeholder}
            value={query}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
              setStatus("");
            }}
            onKeyDown={onInputKeyDown}
          />
          <button type="button" className={styles.close} aria-label={text.closeLabel} onClick={close}>
            <kbd className={styles.kbd}>{text.closeKey}</kbd>
          </button>
        </div>

        {output.length > 0 && (
          <div ref={outputRef} className={styles.output} role="log" aria-label={text.outputLabel}>
            {output.map((entry) => (
              <div key={entry.id} className={styles.entry}>
                <p className={styles.echo}>
                  <span className={styles.echoPath}>{site.promptPath}</span> {entry.command}
                </p>
                {entry.lines.map((line, i) => (
                  <p key={i} className={styles.outLine}>
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}

        <div id={`${id}-list`} role="listbox" aria-label={text.listLabel} className={styles.list}>
          {groups.map((group) => (
            <div key={group.name} role="group" aria-labelledby={`${id}-${group.name}`}>
              <div id={`${id}-${group.name}`} role="presentation" className={styles.groupName}>
                {group.name}
              </div>
              {group.items.map((item) => {
                const selected = item.index === active;
                return (
                  <div
                    key={item.label}
                    id={optionId(item.index)}
                    role="option"
                    aria-selected={selected}
                    className={selected ? `${styles.option} ${styles.active}` : styles.option}
                    // mousemove, not mouseenter: rows scrolling under a
                    // still pointer shouldn't steal the keyboard highlight.
                    onMouseMove={() => {
                      if (!selected) setActive(item.index);
                    }}
                    onClick={() => void run(item)}
                  >
                    <span className={styles.icon} aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className={styles.label}>{item.label}</span>
                    <span className={styles.hint}>
                      {item.hint}
                      {selected && <span aria-hidden="true"> {text.enterHint}</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
          {items.length === 0 && (
            <p className={styles.empty}>
              {text.notFound.replace("{query}", query.trim())}{" "}
              <button
                type="button"
                className={styles.helpLink}
                onClick={() => {
                  setQuery("");
                  setActive(0);
                  inputRef.current?.focus();
                }}
              >
                {text.notFoundHelp}
              </button>
            </p>
          )}
        </div>

        <div className={styles.footer}>
          <p role="status" aria-live="polite" className={styles.status}>
            {status}
          </p>
          {!status && (
            <p className={styles.hints} aria-hidden="true">
              {text.hints.map((hint) => (
                <span key={hint}>{hint}</span>
              ))}
              <span className={styles.try}>{text.tryLine}</span>
            </p>
          )}
        </div>
      </dialog>
    </>
  );
}

/** The modifier-key fields of a keyboard event. */
function pick(event: KeyboardEvent) {
  return { key: event.key, ctrlKey: event.ctrlKey, metaKey: event.metaKey, altKey: event.altKey };
}
