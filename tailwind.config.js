/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fdf7f0',
                    100: '#f7e6d3',
                    200: '#edc9a3',
                    300: '#e1a373',
                    400: '#d4834d',
                    500: '#c4692d',
                    600: '#a85628',
                    700: '#8b4423',
                    800: '#6f351e',
                    900: '#5a2a19',
                },
                secondary: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                },
                sage: {
                    50: '#f6f7f6',
                    100: '#e3e7e3',
                    200: '#c7d0c7',
                    300: '#a3b2a3',
                    400: '#7d8f7d',
                    500: '#5f7a5f',
                    600: '#4a5f4a',
                    700: '#3d4f3d',
                    800: '#334133',
                    900: '#2b362b',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['Playfair Display', 'Georgia', 'serif'],
                body: ['Source Sans Pro', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}