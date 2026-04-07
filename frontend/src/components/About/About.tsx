const About = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full flex flex-col">
      <h1 className="text-3xl font-bold text-text-primary dark:text-gray-100 mt-8 md:mt-28 mb-8">Sobre</h1>
      
      <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 max-w-4xl">
        <p>
          Esse site consiste em um repositório de artigos que eu escreverei com o intuito de compartilhar meus aprendizados e experiências, sejam na área tech, nas finanças, livros que li, ou qualquer outro assunto que eu ache interessante. O objetivo é criar um espaço onde eu possa documentar meu conhecimento e, quem sabe, ajudar outras pessoas que estejam buscando informações sobre esses temas.
        </p>
      </div>
    </main>
  );
};

export default About;
