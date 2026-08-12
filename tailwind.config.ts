import type { Config } from 'tailwindcss';

/**
 * Tailwind config — extended with TechSur / USWDS 3 derived design tokens.
 * CSS custom properties defined in globals.css are the source of truth;
 * these Tailwind aliases make token-based classes available inline.
 */
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary blue ramp (USWDS blue-*)
        'hub-blue-5':  '#d9e8f6',
        'hub-blue-10': '#aacdec',
        'hub-blue-30': '#73b3e7',
        'hub-blue-50': '#2378c3',
        'hub-blue-60': '#005ea2',  // default action
        'hub-blue-70': '#1a4480',  // hover
        'hub-blue-80': '#162e51',  // active / dark surface

        // Neutral ramp
        'hub-ink':        '#1b1b1b',
        'hub-darkest':    '#2d2e2f',
        'hub-darker':     '#454545',
        'hub-muted':      '#565c65',
        'hub-base':       '#71767a',
        'hub-border':     '#a9aeb1',
        'hub-hairline':   '#dfe1e2',
        'hub-sunken':     '#f0f0f0',
        'hub-surface':    '#f9f9f9',
        'hub-card':       '#ffffff',
        'hub-dark-surf':  '#162e51',
        'hub-focus':      '#2491ff',

        // Semantic
        'hub-success':    '#4d8055',
        'hub-warning':    '#ffbe2e',
        'hub-error':      '#b50909',
        'hub-info':       '#00687d',

        // Maturity (for inline use)
        'maturity-poc':       '#ffbe2e',
        'maturity-pilot':     '#00687d',
        'maturity-validated': '#4d8055',

        // Review status — indigo family
        'review-security-bg': '#3d4076',
        'review-standard-bg': '#e5e4fa',
        'review-standard-fg': '#2b2c5e',
      },
      fontFamily: {
        ui:   ['Public Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['Roboto Mono', 'Courier New', 'Courier', 'monospace'],
      },
      fontSize: {
        // Type scale from mockup
        'page-title':    ['2.5rem',   { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.01em' }],
        'section-title': ['1.875rem', { lineHeight: '1.2', fontWeight: '700' }],
        'record-head':   ['1.375rem', { lineHeight: '1.3', fontWeight: '600' }],
        'card-title':    ['1.0625rem',{ lineHeight: '1.3', fontWeight: '600' }],
        'body':          ['1rem',     { lineHeight: '1.6' }],
        'helper':        ['0.875rem', { lineHeight: '1.5' }],
        'meta':          ['0.8125rem',{ lineHeight: '1.4' }],
        'badge':         ['0.75rem',  { lineHeight: '1.4', fontWeight: '600' }],
        'review-badge':  ['0.6875rem',{ lineHeight: '1.4', fontWeight: '700', letterSpacing: '0.06em' }],
      },
      borderRadius: {
        'badge':   '2px',
        'control': '4px',
        'card':    '8px',
        'pill':    '9999px',
      },
      spacing: {
        '1':  '4px',
        '2':  '8px',
        '3':  '16px',
        '4':  '24px',
        '5':  '32px',
        '6':  '40px',
        '7':  '48px',
        '8':  '56px',
        '9':  '72px',
        '10': '80px',
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
      maxWidth: {
        'prose': '68ch',
        'container': '1200px',
      },
      boxShadow: {
        'card':     '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.12)',
        'focus':    '0 0 0 2px #2491ff',
      },
    },
  },
  plugins: [],
};

export default config;
