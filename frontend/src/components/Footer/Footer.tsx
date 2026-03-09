import { FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-primary dark:bg-gray-950 py-8 px-6 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          &copy; {currentYear} Bruno Saint Clair.
        </p>
        
        <div className="flex gap-6">
          <a
            href="https://www.linkedin.com/in/bruno-saint-clair"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-400 dark:hover:text-gray-300 transition-colors"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={28} />
          </a>
          <a
            href="https://github.com/BrunoSaintClair"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-400 dark:hover:text-gray-300 transition-colors"
            aria-label="GitHub"
          >
            <FaGithub size={28} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
