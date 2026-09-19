# What's new

## 2.5.5 — 2026-09-19

### What's new
- **Play on the canvas**: “Play” walks the dialogue as a player right on the graph — the current node and the path taken are highlighted, the camera follows, choices are picked in the bottom panel or with keys 1–9, conditions and variables work. “Play from here” in the node menu starts anywhere. The detailed simulator with a log is in the Graph menu.
- **Playable version of the project** (“File → Export and import → Playable version (HTML)”): one small file where the dialogues can be played in any browser without Narrata — with a scene picker, a step back and speaker colours. Handy for a client or a tester.

### Look and feel
- **Speaker portraits** on line nodes, and playing through looks like a game: a scene with the location picture, a large portrait, text typed out letter by letter. The same in the playable HTML.
- **Start screen**: recent projects are cards with a thumbnail of the main graph. **Project colour** — a thin stripe along the top of the window and a dot by the name (click the dot, or “Project colour” in the card menu): projects open side by side are easy to tell apart.
- **Focus mode** for documents (the “Focus” button above the text): just the text in the middle, no panels, full-screen window, a words-this-session counter; Esc to leave.
- **Daily goal ring** in the status bar — fills as you write and flashes briefly when the goal is reached.
- An empty graph, canvas, character base and task board now greet you with a picture and a button for the first step. Nodes and links appear smoothly, tabs switch softly; with animations turned off in the system you won't see any of it.

## 2.5.4 — 2026-09-19

### Fixes
- **Update checks without a GitHub sign-in** no longer hit “GitHub has temporarily limited requests”: without a sign-in GitHub allows 60 requests an hour per address, which a VPN or a shared network used up. The app now reads the version list from a backup file in the releases repository.
- **Bug fixes** and small improvements.

## 2.5.3 — 2026-09-18

### Fixes
- A character card opened from the **relationship diagram** no longer hides under it: a window opened later is always on top.
- Relationship diagram: characters can be **dragged**, the canvas moves smoothly, and after a two-finger pinch the remaining finger keeps panning instead of getting stuck.
- Android: GitHub sign-in no longer fails with “Unable to resolve host” while you confirm the code in the browser — the app waits for the network and checks again.
- Android: the status bar is hidden and no longer pushes the interface down (swipe from the top to show it); the screen height follows the visible area, so the bottom no longer slides under the system bars.

### Improvements
- **“Place on canvas”** in the file menu (long press on a phone): the canvas opens and a tap on an empty spot places the document card — instead of dragging with a finger.
- **Updates your way** (“Settings → Updates”): automatic checks, automatic downloads and, on Android, downloads over mobile data. If your version is no longer supported, the app asks you to update anyway.
- Android: app data no longer goes into the Google backup or moves to a new phone — the GitHub access went along with it. Projects are protected by their own copies in “Documents/Narrata/Backups”.

## 2.5.2 — 2026-09-16

### What's new
- **Text goals** (“Project → Text goals…”, a counter in the status bar): words in the project and written today, a daily and a project goal, the last week as bars, each file’s share. Graph lines and choices plus Markdown documents are counted; history stays on this device.
- **“The Lighthouse” demo** on the start screen: a small finished story — a graph with choices, a condition and a variable, three characters with relationships, tags and a palette, documents with wiki links, a canvas. Opens with one button, as a fresh project every time.
- **Import dialogues from Ink, Yarn Spinner and Twine** (“File → Export and import”): each file becomes a graph — nodes, labelled and conditional choices, variables (into the project list), “Condition” and “Variable” nodes, speakers into the character base. Anything left unparsed is listed in the report.

### Improvements and fixes
- Bug fixes and small improvements.

## 2.5.1 — 2026-09-16

### Character base
- **References** in the card: link a project folder with concepts and sketches — the pictures show up as a grid in the card, a click opens the file (previews in a folder project on the desktop).
- **Tags** (“alive”, “chapter 2”) and the character **palette** (up to six colours for the artist): tags are shown and searched in the panel, a click on a tag filters everyone with it; colours appear as dots in the row.

### Interface
- The publisher is filled in the `Narrata.exe` properties and the installer.
- **Light theme** now uses an inverted colour scale: grey panels, cards and lists (settings, the new-project window, the guide, the activity bar) are light, and new screens look right from the start.
- Submenus of the top menu (“View → Theme”, “Workspace”) open sideways even at the left edge of the screen; stacked only on phones.

### Phones and tablets
- **A phone in landscape** no longer gets the desktop layout (menu bar, environment strip, side inspector): a touch screen up to 520 px tall counts as a narrow screen. Tablets keep the desktop layout.
- A two-finger pinch no longer scales the whole app — the scale lives in settings; graph and diagram canvases zoom on their own.
- “Interface scale” on Android no longer pushes the layout past the screen edge: the whole interface grows while the screen width stays the same. The system font scale is not applied — use this setting to go larger.
- Character relations diagram: a tap on a character opens the card on the first try (a wider touch zone, a slight finger jitter is not a drag), a two-finger pinch zooms. The click on a character is more reliable on desktop too.
- The sidebar, inspector and docked windows resize by finger on the first try: a wider grab zone, scrolling no longer steals the gesture.
- Android no longer shows “Help with translation”, “Check your translation” or the “Get beta versions” toggle: betas ship for Windows only, phones get stable versions.

## 2.5.0 — 2026-09-15

### Relationship map, actors, branch playthrough
- **Character relationships** (World environment, Project menu): a map of the base with relationships from the cards and dashed lines for characters who share scenes. Click to open the card.
- **Voice actor** in the character card: the voice-over script can be built for one actor who voices several characters.
- **Branch playthrough**: the script check plays graphs with the starting variable values and shows nodes that conditions never let the player reach and places where every option is closed.
- **Timeline** shows locations by scene, endings and transitions between scenes through [[links]] in nodes; the notes graph now sees such links from graphs too.
- **Before exporting to engines** the export window warns about script errors and opens the check with one button.

### Scenes instead of nested sub-graphs
- **A sub-graph is now a separate file.** Ctrl+G collapses the selected nodes into a new `*.graph.json` next to the graph: it gets a Start and **Exit** nodes, and a **Scene** node linking to the file stays in the graph. Every Exit is its own handle on the Scene node, so branches inside a scene continue outside it.
- The script check, reading mode, timeline, localization, voice-over, version history and team merging see scenes as ordinary files — nested nodes used to be invisible to them. The simulator and engine export walk straight through a scene.
- A Scene node can be added by hand (+ Node → Scene) with the file picked in the properties; double-click opens the scene in a tab.
- Old graphs with nested sub-graphs open as before; a button **“Extract into files”** above the graph converts them in one go.

### Canvas and notes graph
- **The canvas is complete**: undo and redo, copying, cutting, pasting and duplicating cards, website link cards, pasting pictures, text and links from the clipboard or dropping them from disk, picture captions and full-size view, search on the canvas, saving as PNG and SVG, align and distribute, bring to front and send to back, snap to grid.
- Canvas lines: label, colour, arrow, dashes and shape.
- Pictures from the project folder show right in the file card; a note can be turned into a document.
- New cards no longer land on top of each other, and an empty canvas does not zoom in on the first card.
- **The notes graph comes alive**: dots spread out smoothly and can be dragged, linked documents follow, as in Obsidian. Repulsion, link length and pull to the centre can be tuned; groups no longer fly off to the corners.
- The notes graph no longer lags on large projects: dots and lines move without re-rendering the interface, the graph spreads out from the centre, and the view does not jump while you drag a dot.

### Small things that got in the way
- **Characters**: right-click (a long press on a phone) a card to open it, insert it into a graph, copy the name or delete it.
- **Selecting several nodes on a phone**: long-press a node, then tap to add or remove nodes.
- **File and folder icons** are picked from sets: story, characters, world, items, work, media, colours.
- A **translation language** can be deleted in localization.
- Pictures zoom with the mouse wheel and a two-finger pinch.
- The voice-over script and other files save without the “invalid file name” error: the colon and other forbidden characters are replaced.
- **Build channels**: beta builds show a small blue “BETA” badge in the title bar, dev builds a yellow “DEV” badge with the version; the tooltip carries the build name and date, and a click opens Settings → Updates. Version, channel, build date and a single “Check for updates” button live there; the About window points there too.
- **New message sound** in the team chat: a short chime when someone writes to a channel or direct conversation that is not open right now. Turn it off with the speaker button in the chat header or in Settings → Chat.
- **Feedback** simplified: “Send to the developer” (the feedback server) and a “Contact support” line at the bottom of the window; GitHub issues and the uninstall survey are gone. The license in the README and on the releases page: closed-source software.
- The canvas minimap no longer sticks out past the right edge of the window.
- If a window's code fails to load (no network, or after a web-version update), the app no longer shows the error screen: everything else keeps working and the hint has a reload button.
- The character relationship map and a notes graph with a few dots no longer stretch across the whole window.
- **Team**: unsaved task edits are not lost when an update arrives from GitHub (your own comment, logged time, a colleague's change); a sprint deadline shows the day you picked; a long sprint name no longer squeezes the board search; a menu item with a badge stays on one line.

### Easier interface
- A new **Project** menu: script check, statistics, timeline, reading mode, story map, voice-over, localization, characters and variables. The Graph menu keeps the actions for the open graph.
- Writer tools open as **tabs** next to documents and stay open after a restart.
- **Search in Settings**.

### Word and Excel documents
- **Word, ODT, RTF** documents and **Excel** spreadsheets in a folder project can be edited right in the app: text with headings, lists and tables, the first sheet for Excel. Word and Excel are saved into the same file, and the previous one stays as a copy in `.narrata/backups`.
- File → Export and import: a Word, ODT, RTF or Excel document into a note (on every device), a note into Word.

### Feedback
- A shorter window: the error log is collapsed into one line and expands on click (it is still attached to the report), the main button is “Send to the developer”, “Copy” sits in the corner.

### Phones and tablets
- **The Back gesture** (side swipe or button) no longer closes the app: it closes a window, a menu, node properties, the sidebar or a tab. Only a second gesture sends the app to the background.
- **A bottom bar** on phones: files, characters, tools, search and More. Node properties open as a sheet at the bottom, the graph toolbar is more compact, note formatting buttons sit in the header, windows take the whole screen.
- **Resizing nodes with a finger** works: the gesture used to stop after the first move. Resize handles are larger and the node text no longer jumps while you drag.
- On phones the first tap selects a node, a second tap or the Open node button opens its properties, so the canvas is no longer covered right away.
- The Android app always uses the touch layout.
- The license agreement window on first launch on Android is gone: the text is in About.

### Faster and more accurate
- The app starts faster: the main file is almost half the size, the English dictionary and the changelog load only when needed.
- Script import finds the name in lines like “Dima appears:” or “The dog comes in:”.

## 2.4.2 — 2026-09-13

### Work environments
- Four environments on the left: **Script**, **World**, **Production** and **Team**. Each has its own panels and tools, project files are shared. Switch there or in View → Work environment.

### Character base
- All project characters in one place (the World environment): name and other names, role, archetype, faction, goal, arc, speech manner, biography, relationships, portrait and colour. Stored in `characters.json` and synced with the team.
- Each card shows how many lines the character has and in which scenes. Speakers without a card are listed separately and can be added with one button.
- Drag a card into a graph for a character node linked to the base, or hold Alt for a line of theirs. Card changes reach every linked node, and renaming a character renames the speaker in every line.
- The line inspector suggests names from the base and links to the card or offers Add to the base. A card can be exported as an image through the card generator.

### Check, timeline and reading
- **Script check** across the whole project: lines without a speaker, dead ends, condition errors, unused variables, string IDs repeated in different graphs, speakers outside the base. Jump to the node and quick fixes.
- **Story timeline**: scenes in order with their length and who speaks in which scene.
- **Reading mode**: a scene as a play — name, stage direction, line, narration and choices; whole or line by line (Space for next). The page can be saved for printing.

### Reliability and phones
- Open in program no longer starts programs and scripts from the project folder (.exe, .bat, .ps1 and similar): the folder may come from the team, and clicking someone else's file must not run anything.
- Network requests of the desktop app go over HTTPS only.
- On phones and tablets, where drag and drop is unavailable, insert a character into the open graph with the buttons in the Characters panel.
- Script import, script check and character card windows fit narrow screens.

### Script import from a document
- File → Export and import → Import a script: Word (.docx), Google Docs (downloaded as .docx), .txt and .md. Scenes become graphs, “Name: text” lines become nodes with a speaker, text in parentheses becomes a stage direction.
- Before creating you see every scene and speaker: fix and merge names, mark extra ones as not a line. Speakers go straight into the character base.

### Files and links
- **Links follow renames**: rename a file or folder and `[[links]]`, `![[…]]` embeds and regular links in notes are fixed automatically.
- **Where to create new notes**: in the root, next to the open file or in a chosen folder.
- **Images and files in notes**: paste from the clipboard or drop into the text — the file is saved into the project (next to the note, in the root or in a chosen folder) and `![[name]]` is inserted.
- The service folder of a folder project is now `.narrata` and hidden in File Explorer; the old `.gamedevbrain` moves automatically.

### Editor
- Line numbers, readable line length, folding headings in the preview with a click.
- Properties at the top of a note (the `---` block) show as a table — or as is, or hidden.
- Markdown can open straight in Side by side mode; font size is a slider.
- **Fonts**: separately for the interface, note text and code.

### Tablets and Android
- The interface scale on Android is applied by the WebView itself: at 85% there is no empty strip at the bottom anymore.
- In touch mode switches, colour circles and round icons are no longer stretched into ovals.
- Signing in with GitHub on Android: the code can be copied and the page opens in a separate browser — you choose which.

### Install and uninstall
- When uninstalling, the app asks whether to erase its data on the computer (no by default). Project folders and backups in Documents are not deleted.
- The Full screen item is removed on Android: the app already fills the screen.

### Feedback without GitHub
- The Feedback window has a Send to the developer button: the request goes straight to the issue list with the right label — bug, feature, idea or question. No GitHub account needed.

### For game engines
- **Export the whole project to game engines** (File → Export project to game engines…): all graphs in one ZIP archive as Yarn Spinner, Ink, Ren'Py, Twine, JSON for Unity and Godot, code for Unity, Godot and Unreal, or localization tables — one file per graph, folders kept.
- **XLIFF for translators and voice-over studios**: the Localization tab exports lines to XLIFF 1.2 with string IDs, speaker and context and imports them back (XLIFF 1.2 and 2.0) together with their status.

### Nodes do not overlap
- Drop, resize or add a node on top of others and the neighbouring nodes smoothly move away. Turn it off in the graph view menu: Push overlapping nodes apart.

### Notes graph
- New Notes graph window (Graph → Notes graph…): documents, graphs and canvases are dots; `[[links]]`, regular links and canvas cards are lines. Colours by folder, search, highlighted neighbours, click to open a document.

### Beta versions
- Turn on Receive beta versions in settings to get pre-release versions on Windows and Android before everyone else. Turn it off and you stay on your version until the next regular release.

### License agreement
- The Windows installer shows the license agreement and asks you to accept it.
- On Android the agreement appears on first launch; the text is always available in the About window.

### Community translations
- The interface language is no longer limited to Russian and English: community translations are downloaded from the releases repository, no new version needed.
- Untranslated strings are shown in English; settings have a Help translate link.
- Translators can test their file before sending it: Test your translation… in the language settings shows the interface in their language right away.

### Protection
- The installed app has developer tools closed, the main process code is minified and the package is checked for integrity: a modified app will not start.

### Fixes
- Graph nodes with long text no longer grow huge and overlap each other.
- A resized node no longer collapses or jumps while being resized, links stay attached, and it can be made smaller again.
- The license agreement window is no longer cut off inside the About window.
- If the app version is below the minimum, the update window cannot be closed until you update.
- The Android icon is larger: the logo fills the icon instead of a third of it.
- Project export and import are grouped in the File → Export and import submenu.
- The Supporters window loads its list again in the installed app: the network policy was blocking raw.githubusercontent.com.

### Version history
- Settings for how many seconds after an edit a snapshot is taken, how many automatic snapshots to keep and after how many days to delete old ones.

## 2.4.1 — 2026-09-13

The first public release of the 2.4 line — see the 2.4.0 section below for all details.

### Highlights
- **Folder projects show every file**: images, Word, PSD, fonts, audio and video; images, audio and video open right in the app.
- **Obsidian-style embeds in notes**: `![[image.png]]`, `![[image.png|300]]` and `![caption](folder/image.png)`.
- The border between text and preview in Side by side mode can be dragged.
- **In-app updates on Android**: the new version downloads in the background (on Wi‑Fi), then an Install update button appears.
- Project-wide search (Ctrl+Shift+F), node templates, project export as a document, groups on the canvas.
- Support the author button, Telegram and Discord in About, a Thanks list with tiers and colors.


## 2.4.0 — 2026-09-12

### Calmer and clearer
- The start screen is centred: icon, name and three equal cards.
- **The GitHub account moved to the top right corner**: profile, team administration, settings and sign-out in one menu. The duplicated buttons left the activity bar.
- The team window is grouped into Work, Team and Administration.
- Menus are lighter: View keeps only what changes the window; Graph collects the writer tools and the exports into submenus; Team no longer repeats the whole team navigation.
- **Right-click** now works where it was missing: task cards and list rows, chat channels and messages, recent projects.

### Personal storage
- Connecting to GitHub asks what the repository is for. **Personal storage** syncs your files between your own devices with history and backups — no tasks, chat, members or extra icons. **Team project** works as before.

### Closed folders
- An administrator closes a folder or a file pattern and picks the roles that get the key. The contents are encrypted before they reach the repository.
- Without the key the files are invisible in the app and unreadable on GitHub, and syncing such a member neither deletes nor damages them.
- Keys can be saved to a file, and `decrypt-vault.mjs` is published next to them: the texts can be recovered without the app.

### Password lock
- The app can be locked with a password: a lock screen at startup, and the GitHub token and your keys encrypted with a key derived from it. The password cannot be recovered, and the app says so upfront.

### Admin home
- A new tab gathers members, roles, closed folders, changes in review and documents with numbers and shortcuts, invitations, and the GitHub pages an administrator needs.

### Chat
- Channel settings: a colour in the list and an **announcements only** mode (administrators and the owner write, everyone else reads).
- Notifications can be silenced per channel on your device; the silenced ones are listed in Settings / Chat.

### Polls in chat
- A channel can ask the team: the **Poll** button next to the paperclip — a question, up to ten options and a “several answers” checkbox.
- A vote is an ordinary message with a hidden block, so two people never overwrite each other, and changing or withdrawing your vote keeps it a single one.
- The card shows the shares, how many people voted and who picked what (hover an option). The author and an administrator can **close** the poll, and the results stay.
- In a private channel and in direct messages the poll and the votes are encrypted like everything else; in a public channel the question and the options read fine on GitHub.

### Feedback
- “Report a problem” became **Feedback**: first you pick what you are writing about — **a problem, a feature, a wish or a question** — and the prompt in the field follows that choice.
- The error journal is attached only to a problem: a wish or a question carries just your text, the app version and the size of the project.
- When the build settings name a GitHub issues page, an **Open an issue on GitHub** button appears and prefills the form with a title like “[Wish] …” and your text.

### Settings
- New sections: **Security** (password lock) and **Chat** (notifications, keys, how channels work).
- The GitHub section now carries auto-sync and what the repository is for.

### A name and focus
- The program is now called **Narrata**.
- **“Only mine”** in the file tree: one button leaves a member with the folders of their role and hides the rest, opening their own area. Administrators keep seeing everything.
- **“My nodes”** in the graph highlights the nodes with an open task assigned to you and dims the rest without hiding them.
- The banner on a read-only file explains itself: “This area belongs to Art: you can read and copy here, they do the editing.”
- The node inspector marks the non-obvious groups with a round “i”, and folds the empty ones (audio, images, localisation, attributes) until they hold something.
- The colour of a link between nodes can be set by hand, with a right-click on the line.
- An administrator can delete a team document instead of only archiving it.

### The canvas
- A new kind of file — the **canvas**: a board holding notes, pictures and cards of project documents. It is created like any other file (File / New file / Canvas).
- Notes are written in Markdown: a double-click on empty space creates one, a double-click on a card opens it for editing.
- A project file lands on the board by dragging it from the tree; the card shows the beginning of the document and a double-click opens the file itself.
- Cards connect with lines from any side, resize by the corners, take a colour from the right-click menu and leave the board without touching the original file.
- The canvas is an ordinary project file (`*.canvas.json`): it syncs with the team, merges card by card and lives in the history.

### Character cards
- **Role presets**: protagonist, antagonist, companion, mentor, quest giver, merchant, walk-on, enemy. A preset fills in status, goal, personality and the starting numbers without overwriting anything written by hand.
- New fields: **goal**, **faction**, **way of speaking**, **arc** and a biography — they reach the layout and the copied text.
- Appearance finally does something: **accent colour, paper (white, parchment, dark, neon) and font**, plus five ready-made styles in one click.
- A new **Portrait** layout: a large image, a quote, personality as tags and the key lines — for visual novels and wikis.
- The faction and motivation of a character node land in the card, and “Save to node” brings them back.
- **Empty fields never reach the card**: no dashes, no empty frames. A profile line appears only with text, the RPG sheet drops the attack column and the inventory box until they are filled, and the dossier and the trading card simply skip empty blocks.

### Interface modes
- The Writer / Developer switch finally changes the workspace. A writer gets the logic nodes tucked into a submenu, conditions opened in the block builder and technical fields folded. A developer gets the technical nodes first, conditions as code, node ids on the nodes, string ids and attributes unfolded, and the engine export in the graph toolbar.
- A mode can be attached to a role: the administrator picks it in Roles and access, and the member gets the matching workspace the first time they open the project. Switching by hand still works and is never overridden afterwards.

### Project search
- **Ctrl+Shift+F** (or Edit → Find in project…) searches everything at once: graph nodes, document lines, canvas notes, file names, variables and team tasks.
- Results are grouped by kind with matches highlighted; clicking a node opens the graph and brings you to it.
- Case and the Russian “е/ё” difference don’t matter, and query words may appear anywhere in the text.

### Node templates
- Right-click an empty spot of a graph → **Insert template**: a dialogue with a choice, a condition check, a quest chain “accept — complete — reward”.
- Any selection can become your own template: right-click a node → **Save as template…**. Assignees and localization string IDs are left out.

### The project as one document
- **File → Export project as a document (HTML, PDF)…**: a table of contents, all documents, graphs in story order with “Next” links, canvases and the variables table.
- It is a plain page: it opens in any browser, and the Print / PDF button saves it as a PDF.

### Groups on the canvas
- A named frame gathers cards into “Act 1”, “Characters”, “Locations”: the **Group** button on the toolbar, a right-click on an empty spot, or **Group together** for selected cards.
- Dragging the frame moves everything inside; deleting the frame leaves the cards alone.

### Forget a project
- **File → Forget project on this device…** and the same button in the team window: the project is disconnected from GitHub, and its copy, version history, in-app backups and chat data are removed from the device. Nothing changes in the repository.
- For a project folder on disk the folder itself stays — the app says so before you confirm.

### Android updates
- A new version **downloads in the background** inside the app; once it is ready, an **Install update** button opens the Android installer — no browser, no hunting for the file.
- Before installing, the app checks that it is an update of the same app, the version is newer and the signature matches, and explains clearly if not. The first time Android asks for permission, and Narrata opens the right screen.
- The build settings have a new `updates.androidSelfUpdate` switch for Google Play builds, where such updates are not allowed.

### Support and thanks buttons
- The Support the author (formerly Support the project) and Thanks buttons are now switched **independently**: `support.showSupportButton` and `support.showThanks`. You can close donations and keep the supporters list.

### Community and required updates
- The About window shows **Telegram** and **Discord** buttons when the build settings contain those links.
- If your version is too old (for example, the team data format changed), the update window **opens by itself** and such an update cannot be skipped.
- On Android the update downloads in the background **only on Wi-Fi**; on mobile data the app shows the size and asks before downloading.
- The Support the project button is now called **Support the author**.

### Small touches
- The What's new and Update available windows show only the latest version expanded; older ones collapse into a single line — click to open.
- The Thanks window highlights the most generous supporters with a color and a tier.
- When uninstalling, the installer offers to leave short feedback (if enabled in the build); updates never ask.
- The Windows installer got branded artwork.

### Every file in a project folder
- A folder project now shows **all files**: images, Word documents, PSD, fonts, audio, video, FL Studio projects — each with its own icon in the tree.
- Images open right in the app (fit to window or actual size, with pixel dimensions); audio and video play.
- Everything else opens as a card with Open in app and Show in folder buttons. Narrata never changes such files — it only renames, moves and deletes them with the folder; they are not synced to GitHub or exported.
- Notes show **embedded images, audio and video**: `![[image.png]]`, `![[image.png|300]]` (width) and a regular `![caption](folder/image.png)` link — just like Obsidian. `![[Note]]` becomes a jump button.
- In Markdown documents the border between text and preview in Side by side mode can be **dragged**; the width is remembered, double-click splits evenly.

### Fixes
- A file from a closed folder no longer stays unavailable after the key is granted.
- Connecting to an empty repository no longer shows an error instead of offering to push the project.
- Enter works in the password field.
- The “What's new” window after an update shows where you came from: “2.3.0 → 2.4.0”.
- A member whose profile had not loaded yet no longer ends up without a closed-folder key: the app reads profiles itself, and an administrator hands out the key automatically once the member signs in for the first time.
- On Android, backups are now stored in the phone memory (Documents/Narrata/Backups) and survive clearing the app data.

## 2.3.0 — 2026-09-11

### Roles and change review
- **Roles**: the administrator chooses which folders and files each member can change. Everything else opens read-only and is never sent to GitHub.
- **Change review**: a member's changes go to the administrator for review. They see the difference in every file and accept the changes or reject them with a reason.
- Authors see the status of their changes: in review, accepted or rejected. Rejected changes can be fixed and sent again, or discarded.

### Node comments
- Discussions right on graph nodes: questions, notes, replies and "Resolved". A badge on the node shows the number of open discussions.

### Chat
- Reply **threads**, **pinned** messages and **search** within a channel.
- **Files and images** in messages: drag and drop, paste or use the button. In private channels and direct messages files are encrypted.

### Writer tools
- **Project statistics**: scenes, lines, words, branches, endings and lines per character.
- **Voice-over script**: lines per character with context, exported to CSV or a printable file.
- **Localization**: a translation table with statuses, CSV import and export. Translations live in localization.json and sync with the team.
- **Story map**: scenes step by step from the start, with branches and endings.
- Spell checking in documents (Russian and English).

### Reliability
- **Backups**: once a day the app saves a copy of the project (the last 14 are kept). Restoring creates a separate project.
- **Report a problem**: an error log without project texts, messages or tokens is saved to a file for the developer.
- Faster start: rarely used windows load on demand.

### Fixes
- Sync no longer deletes local files when the GitHub repository was emptied or replaced.
- Two windows with the same project no longer undo each other's changes.
- When you and a teammate add text in the same place and one addition continues the other, they merge without a conflict.
- A file with an unresolved conflict (<<<<<<< blocks) is not sent to the team until you pick the right version.

### Other
- Support buttons (Boosty, Patreon, DonationAlerts) in the About window and a "Support the project" item in the Help menu — shown once the build settings contain the links.

## 2.2.0 — 2026-09-11

### Chat
- **Direct messages** with end-to-end encryption: only you and the other person can read them.
- **Private channels**: add and remove members; a removed member loses access to new messages.
- Public channels can be open to the whole team or only to selected people.
- The chat opens in a **floating window**, docks to the right or moves to a **separate window** next to your project.
- @mentions, reactions, message editing, links to graph nodes and new-message notifications.
- Password-protected backup of your encryption key to open your conversations on another computer.

### Interface
- A new **activity bar** on the left: files, variables, tasks, chat, documents, members, profile and settings in one place.
- Team tools open in windows you can move, resize, minimize to the status bar, maximize and dock.
- The graph toolbar is calmer: secondary tools moved to the "⋯" menu, and the toolbar can **collapse** into a compact pill.

### Profiles
- Cover, your own photo, headline and "Currently working on".
- Skill levels, a **portfolio** and links with icons (GitHub, YouTube, ArtStation and more).
- The "Message" button in a profile opens a direct conversation.

### Support the project
- Boosty, Patreon and DonationAlerts buttons in the About window.

## 2.1.0 — 2026-09-11

### Team profiles
- **Member profile**: position, level, bio, skills, tools, contacts, time zone, schedule and availability status.
- **Documents and signatures**: the admin publishes NDAs, contracts, licenses and guidelines; members read and sign them right in the app.
- A signature is bound to the GitHub account and to the exact version of the document; if the text changes, the app asks to sign again.
- Export the signature sheet of any document to a file or send members a reminder.

### Updates
- The app checks for new versions and shows what changed in them.
- An update downloads and installs in one click; projects are saved before the restart.
- After an update the "What's new" window opens.

### Language
- The interface is fully translated into English. Switch the language in Settings without restarting.

## 2.0.0 — 2026-09-10

- Desktop version for Windows: projects in regular folders on disk, deletion to the Recycle Bin, saving on close.
- Teamwork through GitHub: project sync, tasks, sprints, chat, members.
- New graph nodes: condition, variable change, event, subgraph.
- Dialogue simulator with real conditions and variables, graph validation, version comparison.
- Export to Yarn Spinner, Ink, Ren'Py, Twine, Unity, Godot, Unreal and localization tables.
