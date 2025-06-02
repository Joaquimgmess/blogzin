import prisma from "prisma/prisma";
import { Link, useLoaderData } from "react-router";
import type { Post } from "~/generated/prisma";
import type { Route } from "./+types/home";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { buttonVariants } from "~/components/ui/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Blogzin - Curiosidades Divertidas" },
    { name: "description", content: "Explore fatos interessantes e curiosidades inuteis" },
  ];
}

export async function loader() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc',
    }
  });
  return { posts };
}

export default function Home() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Bem-vindo ao Blogzin!</h1>
      </header>

      {posts.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <p className="text-xl mb-4">Ainda não há nenhuma curiosidade por aqui!</p>
          <Link to="/gerar" className={buttonVariants({ variant: "default" }) + " text-lg"}>
            Gerar a Primeira Curiosidade
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: Post) => (
            <Card key={post.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="hover:text-primary">
                  <Link to={`/posts/${post.id}`}>{post.title}</Link>
                </CardTitle>
                <CardDescription>Fonte: {post.source}</CardDescription>
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
