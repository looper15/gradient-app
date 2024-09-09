/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background1: '#1E1E1E',
        background2: '#2E2E2E',
        background3: '#383838',
        background4: '#373737',
        background5: '#444444',
        backgroundInactive: '#2E2E2E',
        backgroundInverse: '#EBEBEB',
        backgroundInput: 'rgba(0, 0, 0, 0.15)',
        actionPrimaryBackground: '#006ACC',
        actionPrimaryBackgroundHover: '#187CD9',
        actionPrimaryText: '#FFFFFF',
        actionSecondaryText: '#E0E0E0',
        text1: '#F5F5F5',
        text2: '#BDBDBD',
        text3: '#A3A3A3',
        textInactive: '#757575',
        textInverse: '#1E1E1E',
        border1: 'rgba(255, 255, 255, 0.13)',
        border2: 'rgba(255, 255, 255, 0.14)',
        border3: 'rgba(255, 255, 255, 0.19)',
      },
      backgroundImage: {
        'action-secondary': 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.10) 100%)',
        'action-secondary-hover': 'linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.16) 100%)',
      },
      boxShadow: {
        'action-colored': '0px 0.5px 1px 0px rgba(0, 0, 0, 0.8), 0px 0.5px 0.5px 0px rgba(255, 255, 255, 0.20) inset',
        'action-secondary': '0px 0.5px 1px rgba(0, 0, 0, 0.8), inset 0px 0.5px 0.5px rgba(255, 255, 255, 0.12)',
        'input-inner': '0px 1px 1px -1px rgba(0, 0, 0, 0.13) inset, 0px 3px 3px -3px rgba(0, 0, 0, 0.17) inset, 0px 4px 4px -4px rgba(0, 0, 0, 0.17) inset, 0px 8px 8px -8px rgba(0, 0, 0, 0.17) inset, 0px 12px 12px -12px rgba(0, 0, 0, 0.13) inset, 0px 16px 16px -16px rgba(0, 0, 0, 0.13) inset',
        'menu': '0px 0.5px 0.5px 0px rgba(255, 255, 255, 0.12) inset, 0px 12px 24px 8px rgba(0, 0, 0, 0.04), 0px 8px 16px 4px rgba(0, 0, 0, 0.04), 0px 4px 8px 2px rgba(0, 0, 0, 0.04), 0px 2px 6px 0px rgba(0, 0, 0, 0.04), 0px 0px 1px 0px rgba(0, 0, 0, 0.25)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'small': '11.5px',
        'large': '12.5px',
      },
      fontWeight: {
        normal: 400,
        medium: 600,
      },
      letterSpacing: {
        'small': '-0.115px',
      },
      borderRadius: {
        DEFAULT: '4px',
      },
    },
  },
  plugins: [],
}