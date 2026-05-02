# Moul7anout — GitHub Team Guide

**For teammates with zero coding experience. Every step is spelled out.**

---

## Part 1 — Understanding What GitHub Is (and Why We Use It)

GitHub is the shared folder where all of Moul7anout's code lives. Think of it like Google Drive, but for code. Every change anyone makes is recorded, labelled, and reversible. If someone breaks something, we can undo it in one click. If two people edit the same file, GitHub merges the changes automatically.

The repo (short for "repository") is at:
**https://github.com/7ossam-II/Moul-L7anout**

It is currently **public**, which means anyone can see it. Only people Hossam invites as collaborators can make changes.

---

## Part 2 — The Three Branches (What They Are and Who Touches Them)

A branch is like a separate copy of the project that you can edit without affecting anyone else. We have three permanent branches:

| Branch | Think of it as | Rule |
|---|---|---|
| `main` | The published version. What investors see. | **Never touch directly.** Only Hossam merges here. |
| `develop` | The shared working version. Where features come together. | **Never push directly.** Always open a Pull Request. |
| `frontend-mvp` | The live interactive prototype. The demo you show people. | Hossam and Claude work here. |

When you want to add something, you create a **new branch** from `develop`, do your work there, and then ask to merge it back. This is called a Pull Request (PR).

---

## Part 3 — How to Get Access (Collaborator Setup)

**Hossam does this once per teammate:**

1. Go to https://github.com/7ossam-II/Moul-L7anout
2. Click **Settings** (top menu)
3. Click **Collaborators** (left sidebar)
4. Click **Add people**
5. Type each teammate's GitHub username or email
6. Set their role to **Write**
7. Click **Add [name] to this repository**

Each teammate will receive an email invitation. They must click **Accept invitation** before they can contribute.

**Each teammate does this once:**

1. Go to https://github.com and create a free account if you do not have one
2. Use your real name as the username (e.g., `fatima-moul7anout`)
3. Send your GitHub username to Hossam on WhatsApp

---

## Part 4 — Installing the Tools (One-Time Setup)

Every teammate needs two tools installed on their laptop. This takes about 10 minutes.

### Step 1: Install Git

Git is the program that talks to GitHub from your computer.

- **Windows:** Go to https://git-scm.com/download/win → click the first download link → run the installer → click Next on every screen
- **Mac:** Open Terminal, type `git --version`, press Enter. If it asks you to install, click Install.

### Step 2: Install GitHub Desktop

GitHub Desktop is a visual app that lets you use Git without typing commands.

1. Go to https://desktop.github.com
2. Click **Download for [your OS]**
3. Install it and open it
4. Click **Sign in to GitHub.com**
5. Log in with your GitHub account

That is all you need. You will never need to type `git` commands manually.

---

## Part 5 — How to Clone the Repository (Get the Code on Your Computer)

"Cloning" means downloading the project to your laptop so you can work on it.

**In GitHub Desktop:**

1. Open GitHub Desktop
2. Click **File** → **Clone Repository**
3. Click the **URL** tab
4. Paste: `https://github.com/7ossam-II/Moul-L7anout.git`
5. Choose where to save it on your computer (e.g., Desktop or Documents)
6. Click **Clone**

The project is now on your computer. You will see a folder called `Moul-L7anout`.

**To see the live prototype running on your computer:**

1. Install Node.js from https://nodejs.org (click the LTS version)
2. Install pnpm: open Terminal (Mac) or Command Prompt (Windows), type `npm install -g pnpm`, press Enter
3. In GitHub Desktop, click **Repository** → **Open in Terminal**
4. Type these commands one by one:
   ```
   git checkout frontend-mvp
   pnpm install
   pnpm dev
   ```
5. Open your browser and go to http://localhost:3000

You will see the full Moul7anout prototype running on your own computer.

---

## Part 6 — The Daily Workflow (How to Contribute Without Breaking Anything)

This is the process every teammate follows every time they want to add or change something.

### Step 1 — Always start by updating your copy

Before you do anything, make sure you have the latest version of the code.

In GitHub Desktop:
1. Make sure you are on the `develop` branch (check the dropdown at the top that says "Current Branch")
2. Click **Fetch origin** (top right)
3. Click **Pull origin** if it appears

### Step 2 — Create your own branch

Never work directly on `develop`. Always create a personal branch.

In GitHub Desktop:
1. Click the **Current Branch** dropdown
2. Click **New Branch**
3. Name it using this format: `feature/your-name-what-you-are-doing`
   - Examples: `feature/fatima-product-descriptions`, `feature/youssef-market-research-casablanca`
4. Make sure it says "From: develop"
5. Click **Create Branch**

You are now on your own branch. You cannot break anything for anyone else.

### Step 3 — Make your changes

For non-coders, your changes will mostly be in text files, spreadsheets, or documents inside the project folder. Open the `Moul-L7anout` folder on your computer and edit the files relevant to your role (see Part 7 below for what each person edits).

### Step 4 — Commit your changes

A "commit" is like saving your work with a label explaining what you did.

In GitHub Desktop:
1. You will see your changed files listed on the left
2. At the bottom left, type a short description in the **Summary** box
   - Good: `Add product descriptions for electronics category`
   - Bad: `changes` or `update`
3. Click **Commit to feature/your-branch-name**

### Step 5 — Push your branch to GitHub

"Pushing" sends your saved work from your computer up to GitHub so others can see it.

In GitHub Desktop:
1. Click **Publish branch** (or **Push origin** if you have pushed before)

### Step 6 — Open a Pull Request

A Pull Request (PR) is a formal request to merge your work into `develop`. It lets Hossam review it before it goes in.

1. After pushing, GitHub Desktop will show a button: **Create Pull Request** — click it
2. Your browser will open GitHub
3. Make sure the PR says: **base: develop** ← **compare: your-branch-name**
4. Write a title: what did you add or change?
5. In the description, write 2–3 sentences explaining what you did and why
6. Click **Create pull request**
7. Send the PR link to Hossam on WhatsApp

Hossam will review it, leave comments if needed, and merge it when it is ready.

---

## Part 7 — What Each Teammate Does on GitHub

### Teammate 1 — Content & Copywriting

**Your branch naming:** `feature/content-[what you wrote]`

**What you edit:** Create a folder called `docs/copy/` in the repo. Inside it, create Markdown files (`.md`) for each piece of content:
- `home-page-copy.md` — hero text, category names, button labels
- `store-page-copy.md` — store description templates
- `product-listing-guide.md` — how sellers should write their listings

**How to create a Markdown file:** Open Notepad (Windows) or TextEdit (Mac), write your text, save it with a `.md` extension. Use `#` for headings, `**bold**` for bold text.

**Your first task this week:**
1. Create the file `docs/copy/home-page-copy.md`
2. Write the hero banner text (2 lines), the 7 category names in Arabic + French + English, and the placeholder text for the search bar in all 3 languages
3. Commit, push, and open a PR

---

### Teammate 2 — Market Research

**Your branch naming:** `feature/research-[topic]`

**What you edit:** Create a folder called `docs/research/`. Inside it, create files like:
- `casablanca-competitors.md` — list of existing apps/platforms in Morocco doing similar things
- `target-users.md` — who are the buyers and sellers? Age, neighborhood, phone type, income
- `store-categories.md` — what types of stores should be on the map first? (food, electronics, clothing, etc.)

**Your first task this week:**
1. Open ChatGPT and ask: *"List the top 10 local marketplace apps used in Morocco in 2025, with their main features and weaknesses"*
2. Save the answer into `docs/research/casablanca-competitors.md`
3. Add your own notes: which ones are missing a map feature? Which ones have no C2C selling?
4. Commit, push, and open a PR

---

### Teammate 3 — Product Testing & QA

**Your branch naming:** `feature/qa-[what you tested]`

**What you edit:** Create a folder called `docs/testing/`. Inside it:
- `bug-reports.md` — every bug you find, described clearly
- `test-checklist.md` — a list of things to check on every screen

**How to test:** Open the live prototype at https://moul7anout.manus.space (once published). Go through every screen. For each bug, write:
- **Screen:** (e.g., Home Feed)
- **What I did:** (e.g., tapped the search bar)
- **What happened:** (e.g., keyboard appeared but nothing was typed)
- **What should have happened:** (e.g., I should be able to type and see results)

**Your first task this week:**
1. Open the prototype on your phone
2. Go through all 6 screens and write down every bug or confusing thing you find
3. Save them in `docs/testing/bug-reports.md`
4. Commit, push, and open a PR

---

### Teammate 4 — Social Media & Community

**Your branch naming:** `feature/social-[what you created]`

**What you edit:** Create a folder called `docs/social/`. Inside it:
- `launch-posts.md` — draft social media posts for Instagram, TikTok, and WhatsApp groups
- `seller-pitch.md` — a short message to send to local shop owners asking them to list on Moul7anout
- `beta-user-list.md` — names and contacts of people willing to test the app

**Your first task this week:**
1. Write 3 Instagram caption drafts for the app launch — one in Arabic, one in French, one in Darija
2. Save them in `docs/social/launch-posts.md`
3. Commit, push, and open a PR

---

## Part 8 — Rules Everyone Must Follow

These are not suggestions. They protect the project.

**Rule 1: Never push directly to `main` or `develop`.** Always work on a feature branch and open a PR. Both branches are now protected — GitHub will block direct pushes automatically.

**Rule 2: Always pull before you start working.** If you do not pull first, you might be editing an old version of the file and create conflicts.

**Rule 3: Commit often with clear messages.** A commit every 30 minutes is better than one commit at the end of the day. If something breaks, you can go back to any commit.

**Rule 4: One PR per task.** Do not put 5 different things in one PR. One task = one branch = one PR. This makes review fast and easy.

**Rule 5: Never delete a branch until the PR is merged.** GitHub Desktop will ask if you want to delete the branch after merging — you can say yes at that point, not before.

---

## Part 9 — What to Do When Something Goes Wrong

**"I accidentally edited the wrong branch"**
In GitHub Desktop: click **Branch** → **Discard All Changes**. This undoes everything since your last commit. Then switch to the correct branch and start again.

**"I pushed something wrong"**
Tell Hossam immediately on WhatsApp. Do not try to fix it yourself. He can revert the commit in 30 seconds.

**"I have a merge conflict"**
This means two people edited the same part of the same file. Tell Hossam — he will resolve it. Do not try to fix merge conflicts yourself until you are comfortable with Git.

**"GitHub Desktop says my branch is behind"**
Click **Fetch origin**, then **Pull origin**. This downloads the latest changes from GitHub and merges them into your branch.

**"I cannot push — it says I don't have permission"**
You have not accepted the collaborator invitation yet. Check your email for an invitation from GitHub and click Accept.

---

## Part 10 — Quick Reference Card

Print this and keep it at your desk.

```
BEFORE YOU START:
  1. Open GitHub Desktop
  2. Switch to develop branch
  3. Click Fetch origin → Pull origin

TO DO YOUR WORK:
  4. Create a new branch: feature/yourname-task
  5. Edit your files in the Moul-L7anout folder
  6. In GitHub Desktop: write a commit message → Commit
  7. Click Push origin

TO SUBMIT YOUR WORK:
  8. Click Create Pull Request
  9. Set base: develop
  10. Write a title and description
  11. Click Create pull request
  12. Send the link to Hossam on WhatsApp
```

---

## Part 11 — Inviting Claude and Impeccable (AI Tools)

When Hossam works with Claude or Impeccable on the UI, the changes are committed directly to `frontend-mvp` by the AI tool. You do not need to do anything for this — just pull the latest version of `frontend-mvp` in GitHub Desktop to see the new screens.

To see what changed: in GitHub Desktop, click **History** (top menu). Each commit shows exactly which files were changed and what was added or removed.

---

*Last updated: April 2026 — Moul7anout Team*
