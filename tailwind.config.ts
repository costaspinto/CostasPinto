import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { ink: '#10251D', forest: '#176B4D', mint: '#DDF7E8', paper: '#F7F9F7' }, boxShadow: { soft: '0 18px 60px rgba(16,37,29,.08)' } } }, plugins: [] };
export default config;
