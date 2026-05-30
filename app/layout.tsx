import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Next.js 15 + @mostajs/orm — Blog Starter',
  description: 'One API, 13 databases, zero codegen. Boots in the browser via WASM (sqljs).',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container">
            <Link href="/" className="brand">
              ◐ @mostajs/orm <span className="dim">· Blog</span>
            </Link>
            <a href="https://github.com/apolocine/mosta-orm" className="ghlink">GitHub ↗</a>
          </div>
        </header>

        <div className="container">{children}</div>

        <footer className="site-footer">
          <div className="container">
            Built with <code>@mostajs/orm</code> — one API, 13 databases, runs in the browser
            via WASM (<code>sqljs</code> / <code>pglite</code>).
          </div>
        </footer>
      </body>
    </html>
  );
}
