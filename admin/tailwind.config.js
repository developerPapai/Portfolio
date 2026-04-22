/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a0a0f',
        secondary: '#111118',
        card: '#16161f',
        accent: '#06b6d4',
        'accent-light': '#22d3ee',
        'text-primary': '#f0f0f5',
        'text-muted': '#6b7280',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        border: 'rgba(6, 182, 212, 0.15)',
        'border-subtle': 'rgba(255, 255, 255, 0.06)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(6, 182, 212, 0.25)',
        'glow': '0 0 20px rgba(6, 182, 212, 0.35)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
