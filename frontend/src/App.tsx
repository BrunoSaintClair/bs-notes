import { useState } from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Blog from "./components/Blog/Blog";
import Dictionary from "./components/Dictionary/Dictionary";
import type { Post, Tag } from "./types";

const sampleTags: Tag[] = [
  { id: "1", name: "Investimentos" },
  { id: "2", name: "Desenvolvimento de Software" },
  { id: "3", name: "Geral" },
];

const samplePosts: Post[] = [
  {
    id: "1",
    title: "Guia 2024: Ações com Alto Rendimento",
    description:
      "Descubra quais empresas lideram em crescimento de dividendos e como construir uma carteira",
    image:
      "https://images.unsplash.com/photo-1579427669519-ca3fb1351794?w=400&h=300&fit=crop",
    tags: [sampleTags[0]],
    date: "24 de janeiro de 2024",
  },
  {
    id: "2",
    title: "Fundo de Emergência: Quanto É o Suficiente?",
    description:
      "A regra dos 3-6 meses pode não ser para todos. Aprenda a calcular sua rede de segurança",
    image:
      "https://images.unsplash.com/photo-1543269865-cbdf26effbad?w=400&h=300&fit=crop",
    tags: [sampleTags[1]],
    date: "27 de janeiro de 2024",
  },
  {
    id: "3",
    title: "Estratégias de Pagamento de Dívidas",
    description:
      "Comparamos os métodos snowball e avalanche para eliminar dívidas e reconstruir sua saúde",
    image:
      "https://images.unsplash.com/photo-1565373315234-82b98a01a7d5?w=400&h=300&fit=crop",
    tags: [sampleTags[2]],
    date: "15 de janeiro de 2024",
  },
];

function App() {
  const [currentPage, setCurrentPage] = useState<"blog" | "dictionary">("blog");

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      {currentPage === "blog" ? (
        <Blog posts={samplePosts} tags={sampleTags} />
      ) : (
        <Dictionary />
      )}
      <Footer />
    </div>
  );
}

export default App;
