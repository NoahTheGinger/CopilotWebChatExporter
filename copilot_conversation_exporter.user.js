// ==UserScript==
// @name         Copilot Conversation Exporter
// @author       NoahTheGinger
// @namespace    https://github.com/NoahTheGinger/Microsoft-Copilot-Web-Chat-Exporter-Userscript/
// @version      0.2
// @description  Adds a button to export a conversation from copilot.microsoft.com as a nicely formatted Markdown file.
// @match        https://copilot.microsoft.com/*
// @license      MIT
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // --------------------------------------------------------
    // Helper function: Recursively converts HTML nodes into Markdown.
    // This handles paragraphs, unordered lists, bold/italic text,
    // images, links, and line breaks.
    // --------------------------------------------------------
    function nodeToMarkdown(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
        }
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return '';
        }

        const tag = node.tagName.toLowerCase();
        let md = "";

        switch (tag) {
            case "br":
                return "\n";
            case "p": {
                // Convert <p> into a paragraph with a blank line afterward.
                const content = Array.from(node.childNodes).map(nodeToMarkdown).join("");
                return content.trim() + "\n\n";
            }
            case "ul": {
                // Process unordered lists and its list items.
                md += "\n";
                Array.from(node.children).forEach(li => {
                    md += "- " + nodeToMarkdown(li).trim() + "\n";
                });
                return md + "\n";
            }
            case "li": {
                // Process list items.
                return Array.from(node.childNodes).map(nodeToMarkdown).join("");
            }
            case "strong":
            case "b": {
                const content = Array.from(node.childNodes).map(nodeToMarkdown).join("");
                return `**${content.trim()}**`;
            }
            case "em":
            case "i": {
                const content = Array.from(node.childNodes).map(nodeToMarkdown).join("");
                return `_${content.trim()}_`;
            }
            case "a": {
                const href = node.getAttribute("href") || "";
                const content = Array.from(node.childNodes).map(nodeToMarkdown).join("");
                return `[${content.trim()}](${href})`;
            }
            case "img": {
                const alt = node.getAttribute("alt") || "";
                const src = node.getAttribute("src") || "";
                return `![${alt}](${src})`;
            }
            default:
                // Recursively process any other element’s child nodes.
                return Array.from(node.childNodes).map(nodeToMarkdown).join("");
        }
    }

    // --------------------------------------------------------
    // Function that traverses the conversation DOM, converts each
    // message to Markdown, and triggers a download of the resulting
    // Markdown (.md) file.
    // --------------------------------------------------------
    function exportConversation() {
        // Find conversation message nodes.
        const messages = document.querySelectorAll(
            '[data-content="user-message"], [data-content="ai-message"]'
        );

        if (!messages || messages.length === 0) {
            alert("No conversation messages found!");
            return;
        }

        let mdOutput = "# Copilot Conversation\n\n";

        messages.forEach(msg => {
            // Determine speaker based on the "data-content" attribute.
            const role = msg.getAttribute("data-content") === "user-message" ? "User" : "Copilot";
            let contentMarkdown = nodeToMarkdown(msg).trim();

            // For Copilot messages, remove the unwanted "Copilot said" prefix if present.
            if (role === "Copilot") {
                contentMarkdown = contentMarkdown.replace(/^Copilot said\s*/i, '');
            }

            mdOutput += `**${role}:**\n\n${contentMarkdown}\n\n---\n\n`;
        });

        // Create a Blob from the Markdown text and trigger download.
        const blob = new Blob([mdOutput], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "copilot_conversation.md";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
    }

    // --------------------------------------------------------
    // Inserts the export button into the page.
    // Now positioned in the bottom-right corner, with reduced dimensions,
    // a green background, and smaller font.
    // --------------------------------------------------------
    function addExportButton() {
        const button = document.createElement("button");
        button.textContent = "Export Chat (MD)";
        Object.assign(button.style, {
            position: "fixed",
            bottom: "10px",
            right: "10px",
            zIndex: "10000",
            padding: "8px 10px",
            backgroundColor: "#28a745", // Green color
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "12px"
        });
        button.addEventListener("click", exportConversation);
        document.body.appendChild(button);
    }

    // Wait until the page is fully loaded before inserting the button.
    window.addEventListener("load", addExportButton);
})();
