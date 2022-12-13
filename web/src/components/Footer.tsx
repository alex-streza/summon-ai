import Link from "next/link";

const Footer = () => {
  return (
    <footer className="z-10 flex items-center justify-between w-full py-5 mt-auto bg-white border-t border-gray-900 md:py-12">
      <ul className="grid grid-cols-2 gap-5 text-gray-500 uppercase md:mx-auto md:flex md:gap-16">
        <li>
          <span>Showcase (Soon)</span>
        </li>
        <li>
          <a href="https://github.com/alex-streza/summon-ai">Figma</a>
        </li>
        <li>
          <span>All images (Soon)</span>
        </li>
        <li>
          <a href="https://github.com/alex-streza/summon-ai">Contribute</a>
        </li>
      </ul>
      <ul className="flex flex-col gap-3 text-gray-500 md:flex-row">
        <li>
          <a href="https://twitter.com/alex_streza">tw</a>
        </li>
        <li>
          <a href="https://www.figma.com/community/plugin/1172891596048319817">
            fi
          </a>
        </li>
        <li>
          <a href="https://github.com/alex-streza/summon-ai">gh</a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
