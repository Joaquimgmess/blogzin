import { redirect } from "@remix-run/node";
import prisma from "prisma/prisma";
import type { LoaderFunctionArgs } from "@remix-run/node"; // For type safety

export async function loader({}: LoaderFunctionArgs) {
  const allPosts = await prisma.post.findMany({
    select: { id: true },
  });

  if (allPosts.length === 0) {
    // No posts in the database, redirect to home or show a message.
    // For now, redirecting to home.
    return redirect("/home");
  }

  const randomIndex = Math.floor(Math.random() * allPosts.length);
  const randomPostId = allPosts[randomIndex].id;

  return redirect(`/posts/${randomPostId}`);
}

// No default export is needed for a resource route that only has a loader/action.
// This route is only for handling the server-side logic and redirecting.
