import { Form, useActionData, useNavigation } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";


import { GoogleGenerativeAI } from "@google/generative-ai";
import { json } from "@remix-run/node";
import prisma from "prisma/prisma";
import type { Route } from "./+types/gerar";

interface AiGeneratedPost {
  title: string;
  content: string;
}

export async function action({ request }: Route.ActionArgs) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const factResponse = await fetch("https://uselessfacts.jsph.pl/random.json?language=en");
    if (!factResponse.ok) throw new Error("Falha ao buscar fato da API externa.");
    
    const factData = await factResponse.json();
    const originalFactText = factData.text;

    const prompt = `
      Você é um assistente criativo para um blog de curiosidades. Sua tarefa é pegar um fato em inglês, traduzi-lo para o português brasileiro e depois escrever um parágrafo curto, divertido e envolvente sobre ele.

      Fato em inglês: "${originalFactText}"

      Sua resposta DEVE ser um objeto JSON válido, e nada mais, com a seguinte estrutura: {"title": "SUA_TRADUCAO_DO_FATO", "content": "SEU_PARAGRAFO_ELABORADO"}.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const cleanJsonString = responseText.replace(/```json|```/g, "").trim();
    const aiGeneratedContent: AiGeneratedPost = JSON.parse(cleanJsonString);
    const { title, content } = aiGeneratedContent;

    if (!title || !content) {
      throw new Error("A IA não retornou o formato JSON esperado.");
    }
    
    const newPost = await prisma.post.create({
      data: {
        title: title,
        content: content,
        originalText: originalFactText,
        source: "uselessfacts.jsph.pl",
      },
    });

    return json({ newPost });

  } catch (error: any) {
    console.error("Erro no processo de geração:", error);
    if (error.code === 'P2002') { 
      return json({ error: "Este fato já foi processado! Tente gerar outro." }, { status: 409 });   
    }
    return json({ error: "Ocorreu um erro no processo. Verifique as APIs e tente novamente." }, { status: 500 });
  }
}

export default function Gerar() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Gerador de Posts com IA</h1>
        <p className="text-muted-foreground mt-2">
          Clique no botão para criar uma nova curiosidade.
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <Form method="post" className="flex justify-center">
            <Button size="lg" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Gerando, aguarde..." : "Gerar Novo Post"}
            </Button>
          </Form>
        </CardContent>
      </Card>

      {actionData?.newPost && (
        <Card className="bg-green-50 border-green-200 animate-in fade-in">
          <CardHeader>
            <CardTitle>{actionData.newPost.title}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <p>{actionData.newPost.content}</p>
          </CardContent>
        </Card>
      )}

      {actionData?.error && (
        <Card className="bg-red-50 border-red-200 animate-in fade-in">
          <CardHeader>
            <CardTitle className="text-red-800">Ocorreu um Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{actionData.error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}