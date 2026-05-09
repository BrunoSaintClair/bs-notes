import { FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/50 dark:bg-gray-950/50 py-8 px-6 border-t border-gray-200/60 dark:border-gray-800/60 backdrop-blur-sm">
      <div className="max-w-[1120px] mx-auto flex items-center justify-between">
        <p className="text-gray-400 dark:text-gray-500 text-xs font-medium tracking-wide">
          &copy; {currentYear} Bruno Saint Clair.
        </p>
        
        <div className="flex gap-5">
          <a
            href="https://www.linkedin.com/in/bruno-saint-clair"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 dark:text-gray-500 hover:text-sky-blue dark:hover:text-sky-blue transition-colors duration-200"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={20} />
          </a>
          <a
            href="https://github.com/BrunoSaintClair"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 dark:text-gray-500 hover:text-sky-blue dark:hover:text-sky-blue transition-colors duration-200"
            aria-label="GitHub"
          >
            <FaGithub size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
