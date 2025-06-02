import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  NavLink,
  useRouteError
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { Button } from "~/components/ui/button";
import { PlusCircleIcon, HomeIcon } from "lucide-react";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

function NavHeader() {
  return (
    <header className="bg-slate-100 dark:bg-slate-800 shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          Blogzin
        </Link>
        <div className="flex items-center gap-x-2 sm:gap-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-700"
              }`
            }
            end
          >
            <HomeIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Início</span>
          </NavLink>
          <NavLink
            to="/gerar"
            className={({ isActive }) =>
              `flex items-center gap-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-700"
              }`
            }
          >
            <PlusCircleIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Gerar Post</span>
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PDD4MS4T');`,
          }}
        />
        {/* End Google Tag Manager */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-background text-foreground antialiased font-sans">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PDD4MS4T"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <NavHeader />
        <main className="flex-grow">
          {children}
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  let message = "Oops!";
  let details = "Ocorreu um erro inesperado.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "Página Não Encontrada (404)" : "Erro Inesperado";
    details =
      error.status === 404
        ? "A página que você tentou acessar não existe."
        : error.data?.message || error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <html lang="pt-BR" className="h-full">
      <head>
        <title>{message}</title>
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-background text-foreground antialiased font-sans flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-destructive mb-4">{message}</h1>
          <p className="text-xl text-muted-foreground mb-8">{details}</p>
          {stack && (
            <pre className="w-full max-w-2xl bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto text-left text-sm">
              <code>{stack}</code>
            </pre>
          )}
          <Button asChild variant="outline" className="mt-8">
            <Link to="/">Voltar para a Página Inicial</Link>
          </Button>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
