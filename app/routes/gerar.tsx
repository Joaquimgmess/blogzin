import { Form, useActionData, useNavigation } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";


import { GoogleGenerativeAI } from "@google/generative-ai";
import { json } from "@remix-run/node";
import prisma from "prisma/prisma";
import type { Route } from "./+types/gerar";

interface AiGeneratedPost {
  title: string;
  content: string;
  category: string; // Added category
}

const availableSources = [
  { id: "uselessfacts", name: "Useless Facts", url: "https://uselessfacts.jsph.pl/random.json?language=en" },
  { id: "factoftheday", name: "Fact of the Day (Numbers API)", url: "http://numbersapi.com/random/trivia?json" },
];

export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const selectedSourceId = formData.get("source") as string || availableSources[0].id;

    const selectedSource = availableSources.find(s => s.id === selectedSourceId);
    if (!selectedSource) {
      throw new Error("Fonte de fatos inválida selecionada.");
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const factResponse = await fetch(selectedSource.url);
    if (!factResponse.ok) throw new Error("Falha ao buscar fato da API externa.");
    
    const factData = await factResponse.json();
    // UselessFacts API returns `text`, NumbersAPI returns `text` (but it's the fact itself)
    const originalFactText = factData.text || factData.number + " is " + factData.type;


    const prompt = `
      Você é um assistente criativo para um blog de curiosidades. Sua tarefa é pegar um fato em inglês, traduzi-lo para o português brasileiro, escrever um parágrafo curto, divertido e envolvente sobre ele, e sugerir uma categoria para o post (ex: "Ciência", "História", "Tecnologia", "Animais", "Cultura Pop").

      Fato em inglês: "${originalFactText}"

      Sua resposta DEVE ser um objeto JSON válido, e nada mais, com a seguinte estrutura: {"title": "SUA_TRADUCAO_DO_FATO", "content": "SEU_PARAGRAFO_ELABORADO", "category": "CATEGORIA_SUGERIDA"}.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const cleanJsonString = responseText.replace(/```json|```/g, "").trim();
    const aiGeneratedContent: AiGeneratedPost = JSON.parse(cleanJsonString);
    const { title, content, category } = aiGeneratedContent;

    if (!title || !content || !category) {
      // Allow empty category for now, but log if missing
      // console.warn("IA não retornou título, conteúdo ou categoria no formato JSON esperado.");
      // For now, let's enforce category, but this could be relaxed if needed
      throw new Error("A IA não retornou título, conteúdo e categoria no formato JSON esperado.");
    }
    
    const newPost = await prisma.post.create({
      data: {
        title: title,
        content: content,
        originalText: originalFactText,
        source: selectedSource.id,
        category: category, // Save the category
      },
    });

    return json({ newPost });

  } catch (error: any) {
    console.error("Erro no processo de geração:", error);
    if (error.message.includes("Failed to fetch")) {
      return json({ error: "Falha ao buscar dados da API externa. Verifique a conexão ou a URL da API." }, { status: 502 });
    }
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
        <h1 className="text-3xl font-bold tracking-tight">Gerador de curiosidades</h1>
        <p className="text-muted-foreground mt-2">
          Selecione uma fonte e clique no botão para criar uma nova curiosidade.
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <Form method="post" className="space-y-6">
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                Fonte da Curiosidade
              </label>
              <Select name="source" defaultValue={availableSources[0].id}>
                <SelectTrigger id="source" className="w-full">
                  <SelectValue placeholder="Selecione uma fonte" />
                </SelectTrigger>
                <SelectContent>
                  {availableSources.map((source) => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <Button
                size="lg"
                type="submit"
                disabled={isSubmitting}
                aria-label={isSubmitting ? "Gerando curiosidade, por favor aguarde" : "Gerar nova curiosidade"}
              >
                {isSubmitting ? "Gerando, aguarde..." : "Gerar Novo Post"}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>

      {actionData?.newPost && (
        <Card 
          className="bg-green-50 border-green-200 animate-in fade-in"
          role="status"
          aria-live="polite"
        >
          <CardHeader>
            <CardTitle>{actionData.newPost.title}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <p>{actionData.newPost.content}</p>
          </CardContent>
        </Card>
      )}

      {actionData?.error && (
        <Card 
          className="bg-red-50 border-red-200 animate-in fade-in"
          role="status"
          aria-live="polite"
        >
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