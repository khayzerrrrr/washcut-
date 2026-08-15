# The antislop guide

antislop is a rules file you give to the AI assistant you already talk to, like ChatGPT, Claude, or Gemini. It stops that AI from making slop: pages and text that look generic and obviously made by AI. It is a filter, not a style guide. It never picks your colors or fonts. It removes the slop and leaves the direction to you.

## What is slop?

Slop is the default AI look and sound:

- The same color-fading banner at the top, the same rounded cards, the same "Unlock the power of..." headline.
- Text that sounds excited and says nothing.
- Pages that look fine in a screenshot but fail real people: text that blends into its background, keyboard-only users locked out.

If you have used AI to build a page or write a line of copy, you have seen slop. antislop exists to remove it.

## What you can use it for

antislop is not only for building pages. Any AI output that can get sloppy benefits:

- Build a new page or app: layout, color, parts of the page, animation, structure.
- Write or rewrite copy: headlines, buttons, emails, and tone that do not sound AI-made.
- Keep the page usable by people: readable colors, keyboard use, clear focus, and button states.
- Check work you already have: it can list what to fix.

The main file (the core) covers all of it. Skills (see What is a skill?) go deeper into one concern when you want more.

## Why use it?

Without a filter, AI output looks and sounds the same everywhere. With antislop, the result is specific and alive, not just clean: every major choice needs a reason, written down.

One thing antislop does not do: make things pretty. It removes slop. If you have a specific look in mind, write it down in a file called DESIGN.md and the AI builds toward it. You don't have to make one. Without a DESIGN.md, the AI labels its work "draft without direction" instead of passing it off as finished (see Words used here).

## What you need

One file: `antislop.md`, and the AI assistant you already use.

The file holds all the rules the AI follows, plus the wizard that installs skills for you. Nothing else is required. Skills are optional add-ons; you do not need any to start.

## What is a skill?

A skill is an optional file that goes deeper into one concern. The core works alone; a skill adds depth for one topic.

- `antislop-ui`: look and feel. Layout, color, parts of the page, animation.
- `antislop-copywriting`: the text. Headlines, buttons, tone, made-up statistics.
- `antislop-human`: the people. Readable colors, keyboard use, clear focus, and button states.

Pick the one that matches your work. UI work means `antislop-ui`. Copy work means `antislop-copywriting`. People work means `antislop-human`. Mobile layout work means `antislop-layoutmobile`. More than one? Ask for "All". None? The core alone is enough.

## How to install

Three steps.

**1. Download `antislop.md` once.** Two ways:

- From the browser: open the repository page (the GitHub page where the product's files live, [here](https://github.com/miqdadbadjuber/anti-slop)), open `antislop.md`, and click the Download button.
- From the terminal (the black window where you type commands):

  ```bash
  curl -o antislop.md https://raw.githubusercontent.com/miqdadbadjuber/anti-slop/main/antislop.md
  ```

**2. Put the file where your AI can read it, then tell it what you want.**

`antislop.md` is a plain text file, so the AI can read it. If your AI works with files (like Claude, Gemini, or Cursor), save `antislop.md` in the same folder as your work. Not sure which folder? Ask your AI where to put it. If your AI is a chat window (like ChatGPT on the web), open `antislop.md` in a text editor (Notepad works), copy everything, and paste it into the chat.

Then tell it what you want. Say:

> Read `antislop.md` and follow its install instructions. I want the UI and copywriting skill.

If you pasted the contents instead of giving the file, say: "Follow the install instructions I pasted. I want the UI and copywriting skill." The AI follows the instructions, downloads the skills you asked for, and saves a note to use them next time. That is the whole setup. Say "core only" to skip skills.

**3. Answer the wizard's questions.**

It confirms which skills you want and asks when antislop should apply: while the AI is working (during), or after the work is done, to check it (after). Pick "during" for new work.

Done. Want to skip the wizard? There is a manual setup too; see the README, the product's main page, [here](README.md).

## Why is one file enough?

The main file holds everything: the rules and the wizard. Skills are optional depth, downloaded only when you need them. That keeps the filter light and your AI fast.

## Where is this going?

Every new version of antislop adds one skill. So far: UI, copywriting, people, and mobile layout. Next up: documentation and identity. The end goal is v3.0.0, the whole system packaged as an installable plugin (an add-on you install once, like an app). See the roadmap, the page that lists what is coming next, [here](ROADMAP.md).

## Words used here

- **Slop**: output that looks or reads generic and AI-made.
- **Agent**: another word for your AI assistant, like ChatGPT, Claude, or Gemini.
- **Core**: `antislop.md`, the main file that holds all the rules and the wizard.
- **Skill**: an optional file that goes deeper into one concern.
- **Copy**: the words on a page.
- **Contrast**: how clearly text stands out from its background.
- **Wizard**: the install instructions inside `antislop.md`. When you tell your AI to read the file, it follows them and asks you questions.
- **Filter**: removes the bad and keeps the good. antislop removes slop, not your direction.
- **UI**: the look of a page or app.
- **DESIGN.md**: a file you write with your UI direction: who it is for, the mood, the colors. antislop does not invent direction.

For the full product, see the [README](README.md).
