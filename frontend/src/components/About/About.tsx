import FeedbackForm from "@/components/Feedback/FeedbackForm";

const About = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full flex flex-col">
      <h1 className="text-3xl font-bold text-text-primary dark:text-gray-100 mt-8 md:mt-28 mb-8">Sobre</h1>
      
      <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 max-w-4xl">
        <p>
          Esse site consiste em um repositório de artigos que eu escreverei com o intuito de compartilhar meus aprendizados e experiências, sejam na área tech, nas finanças, livros que li, ou qualquer outro assunto que eu ache interessante. O objetivo é criar um espaço onde eu possa documentar meu conhecimento e, quem sabe, ajudar outras pessoas que estejam buscando informações sobre esses temas.
        </p>
      </div>

      <section className="mt-20 pt-12 border-t border-gray-200/60 dark:border-gray-800/60">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 font-heading">
            Tem algo a dizer?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xl">
            Envie um feedback sobre um artigo, sugira um tema, ou simplesmente mande uma mensagem. Sua mensagem será enviada diretamente para mim.
          </p>
        </div>
        <FeedbackForm />
      </section>
    </main>
  );
};

export default About;
