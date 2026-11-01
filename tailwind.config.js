/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)', // Fondo general de la app
        primary: 'var(--color-primary)', // Color principal (botones, cabeceras)
        secondary: 'var(--color-secondary)', // Color secundario (acentos, bordes)
        surface: 'var(--color-surface)', // Fondo de tarjetas o inputs
        text: 'var(--color-text)', // Texto principal
        textinput: 'var(--color-textinput)', // Texto input
        textbutton: 'var(--color-textbutton)', // Texto button
        muted: 'var(--color-muted)', // Texto secundario o placeholders
        error: 'var(--color-error)', // Alertas y validaciones
      },
    },
  },
  plugins: [],
};
