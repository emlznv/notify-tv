# NotifyTV

NotifyTV is a Google Chrome extension that allows users to add their favorite TV series
and receive notifications for upcoming episodes.

Available on Chrome Web store: [NotifyTV](https://chrome.google.com/webstore/detail/notifytv/opbfjpihggojpgkmoogkleafoalpbbfn)


## Features 

- Browsing of TV series and adding them to your list
- Main details about TV series including days until next episode
- Notifications for upcoming episodes
- Options for when to be notified before a new episode
- Light or dark mode based on operating system settings


## Tech Stack

This project is built using React with TypeScript and uses TV series data provided by [TV Maze API](https://www.tvmaze.com/)
(licensed by [CC BY-SA](https://creativecommons.org/licenses/by-sa/4.0/)).


## Build The Project

Clone the project

```bash
  git clone https://github.com/emlznv/notify-tv.git 
```

Go to the project directory

```bash
  cd notify-tv
```

Install dependencies

```bash
  npm install
```

Build the project

```bash
  npm run build
```
Open Chrome, go to: ```chrome://extensions/``` and enable developer mode.
Then, click ```Load unpacked``` and select the build folder in the project directory.
The extension will now be visible on the extensions page and toolbar.
