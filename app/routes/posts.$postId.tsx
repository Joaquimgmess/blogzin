import { ArrowLeftIcon } from "lucide-react";
import prisma from "prisma/prisma";
import { isRouteErrorResponse, Link, useLoaderData, useNavigate, useParams, useRouteError } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import type { Route } from "./+types/posts.$postId";

export async function loader({ params }: Route.LoaderArgs) {
  const postId = params.postId;
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new Response("Post não encontrado", { status: 404 });
  }
  return { post };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data || !data.post) {
    return [
      { title: "Post Não Encontrado" },
      { name: "description", content: "A curiosidade que você buscou não foi encontrada." },
    ];
  }
  const { post } = data;
  return [
    { title: post.title },
    { name: "description", content: post.content.substring(0, 160) + "..." },
  ];
}

export default function PostPage() {
  const { post } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      <Button variant="outline" size="sm" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
          <CardDescription>Fonte: {post.source}</CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed">{post.content}</p>
          <hr className="my-6" />
          <details>
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-primary">
              Ver fato original em inglês
            </summary>
            <blockquote className="mt-2 p-3 bg-slate-50 dark:bg-slate-800 border-l-4 border-slate-300 dark:border-slate-600 text-sm text-muted-foreground">
              {post.originalText}
            </blockquote>
          </details>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Publicado em: {new Date(post.createdAt).toLocaleDateString('pt-BR')}
        </CardFooter>
      </Card>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const params = useParams();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Post Não Encontrado</h1>
        <p className="text-muted-foreground mb-6">
          A curiosidade com o ID "{params.postId}" não existe ou foi removida.
        </p>
        <Link to="/" className="text-primary hover:underline">
          Voltar para a Página Inicial
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Ocorreu um Erro</h1>
      <p className="text-muted-foreground mb-6">
        Não foi possível carregar o post. Tente novamente mais tarde.
      </p>
      <Link to="/" className="text-primary hover:underline">
        Voltar para a Página Inicial
      </Link>
    </div>
  );
}