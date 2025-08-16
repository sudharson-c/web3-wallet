/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}", // Adjust this path if your source files are in a different directory
    ],
    darkMode: 'class', // Explicitly set to 'class' to match next-themes
    theme: {
        extend: {}, // Add custom theme extensions here if needed
    },
    plugins: [], // Add Tailwind plugins here if needed
};