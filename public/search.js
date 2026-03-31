"use strict";

/**
 * Advanced search/URL parser with HTTPS-first logic.
 * @param {string} input - User input string.
 * @param {string} template - Search engine template (e.g., "https://duckduckgo.com/?q=%s").
 * @returns {string}
 */
function search(input, template) {
    const cleanInput = input.trim();
    if (!cleanInput) return "";

    // 1. If it already has a protocol, return as-is
    if (/^[a-z][a-z0-9+\-.]*:\/\//i.test(cleanInput)) {
        try {
            return new URL(cleanInput).toString();
        } catch { /* Fall through */ }
    }

    // 2. Identify if the input "looks" like a website
    // - No spaces
    // - Has a dot (example.com) OR is 'localhost'
    // - Doesn't start with a special character
    const isDomain = !/\s/.test(cleanInput) && 
                     (cleanInput.includes(".") || cleanInput.toLowerCase() === "localhost");

    if (isDomain) {
        try {
            // We use HTTPS by default for a safer web experience
            // Localhost is the only common exception that often stays HTTP
            const protocol = cleanInput.startsWith("localhost") ? "http://" : "https://";
            const url = new URL(`${protocol}${cleanInput}`);
            
            // Validate the hostname isn't just a trailing dot
            if (url.hostname.length > 1) return url.toString();
        } catch { /* Fall through */ }
    }

    // 3. Fallback to Search Engine
    return template.replace("%s", encodeURIComponent(cleanInput));
}
