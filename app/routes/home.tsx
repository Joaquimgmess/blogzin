import prisma from "prisma/prisma";
import { useLoaderData } from "react-router";
import type { Post } from "~/generated/prisma";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  const posts = await prisma.post.findMany();
  return { posts };
}

export default function Home() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Posts</h1>
      {posts.map((post: Post) => (
      <div key={post.id}>
        <h1>{post.title}</h1>
        <p>{post.originalText}</p>
        <p>{post.source}</p>
          <p>{post.createdAt.toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
