/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chat-bg': '#212121',
        'chat-sidebar': '#171717',
        'chat-user': '#2f2f2f',
        'chat-bot': '#212121',
        'chat-border': '#424242'
      }
    },
  },
  plugins: [],
}
