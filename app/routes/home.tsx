import prisma from "prisma/prisma";
import { Link, useLoaderData, useSearchParams } from "react-router";
import type { Post } from "~/generated/prisma";
import type { Route } from "./+types/home";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { buttonVariants } from "~/components/ui/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Blogzin - Curiosidades inúteis " },
    { name: "description", content: "Explore fatos interessantes e curiosidades inúteis" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const selectedCategory = url.searchParams.get("category");

  const categories = (await prisma.post.findMany({
    select: { category: true },
    distinct: ["category"],
    where: { category: { not: null } }, // Only non-null categories
  })).map(p => p.category!); // Ensure category is not null with '!'

  const posts = await prisma.post.findMany({
    where: selectedCategory ? { category: selectedCategory } : {},
    orderBy: {
      createdAt: 'desc',
    }
  });
  return { posts, categories, selectedCategory };
}

export default function Home() {
  const { posts, categories, selectedCategory } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  const currentCategory = searchParams.get("category");

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Bem-vindo ao Blogzin!</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore curiosidades ou deixe-se surpreender!
        </p>
      </header>

      <div className="mb-8 flex flex-wrap justify-center gap-2 items-center">
        <Link
          to="/random-post"
          className={buttonVariants({ variant: "default", size: "lg" }) + " font-semibold"}
          aria-label="Ser surpreendido com uma curiosidade aleatória"
        >
          ✨ Surprise Me! ✨
        </Link>
      </div>

      <div className="mb-8 text-center">
        <p className="text-sm text-muted-foreground">Ou filtre por categoria:</p>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <Link
          to="/home"
          className={buttonVariants({ variant: currentCategory === null ? "default" : "outline", size: "sm" })}
          aria-label="Ver todas as categorias"
        >
          Todas
        </Link>
        {categories.map((category: string) => (
          <Link
            key={category}
            to={`/home?category=${encodeURIComponent(category)}`}
            className={buttonVariants({ variant: currentCategory === category ? "default" : "outline", size: "sm" })}
            aria-current={currentCategory === category ? "page" : undefined}
          >
            {category}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <p className="text-xl mb-4">
            {selectedCategory
              ? `Nenhuma curiosidade encontrada na categoria "${selectedCategory}".`
              : "Ainda não há nenhuma curiosidade por aqui!"}
          </p>
          {selectedCategory ? (
            <Link
              to="/home"
              className={buttonVariants({ variant: "link" })}
            >
              Ver todas as categorias
            </Link>
          ) : (
            <Link
              to="/gerar"
              className={buttonVariants({ variant: "default" }) + " text-lg"}
              aria-label="Gerar a Primeira Curiosidade"
            >
              Gerar a Primeira Curiosidade
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: Post) => (
            <Card key={post.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="hover:text-primary">
                  <Link to={`/posts/${post.id}`} aria-label={`Ler a curiosidade: ${post.title}`}>{post.title}</Link>
                </CardTitle>
                {post.category && (
                  <p className="text-xs text-muted-foreground pt-1">
                    Categoria: {post.category}
                  </p>
                )}
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="line-clamp-4 text-sm text-muted-foreground">
                  {post.originalText} 
                </p>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                <p>Publicado em: {new Date(post.createdAt).toLocaleDateString('pt-BR')}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
