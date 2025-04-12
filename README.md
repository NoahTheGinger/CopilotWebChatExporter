# Copilot Conversation Exporter

A simple Tampermonkey userscript that adds an **Export Chat (MD)** button to [copilot.microsoft.com](https://copilot.microsoft.com). This button lets you quickly export your Copilot conversation as a nicely formatted Markdown file.

## Features

- **Automatic Export:** Scans the conversation for user and Copilot messages and converts them to Markdown.
- **Clean Formatting:** Strips out unnecessary text (like the "Copilot said" prefix) from Copilot messages.
- **Easy Access:** The export button is fixed in the bottom-right corner of the screen.
- **Lightweight & Customizable:** Utilizes a recursive HTML-to-Markdown converter that can be tweaked to match future DOM changes.

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net) (or another userscript manager) in your browser.
2. Create a new userscript and copy-paste the code from the repository into it.
3. Save the script.
4. Navigate to [copilot.microsoft.com](https://copilot.microsoft.com) and you should see the **Export Chat (MD)** button in the bottom-right corner.

## Usage

- **Start a Conversation:** Begin chatting with Copilot as you normally would.
- **Click the Button:** Hit the **Export Chat (MD)** button at the bottom-right.
- **Download:** The script will process the conversation and automatically download a Markdown file named `copilot_conversation.md`.

## Customization

If you need additional formatting or if Copilot’s DOM structure changes, simply update the helper function `nodeToMarkdown()` and adjust the element selectors (currently based on `data-content` attributes).

## License

This project is released under the [MIT License](LICENSE).

