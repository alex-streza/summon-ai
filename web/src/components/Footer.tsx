import Link from "next/link";

export interface FooterProps {
  className?: string;
}

const Footer = ({ className = "bg-white" }: FooterProps) => {
  return (
    <footer
      className={`
        ${className} z-10 mt-auto flex w-full items-center justify-between border-t border-gray-900 py-5 md:py-12`}
    >
      <ul className="grid grid-cols-2 gap-5 text-gray-500 uppercase md:mx-auto md:flex md:gap-16">
        <li>
          <Link href="/showcase">Showcase</Link>
        </li>
        <li>
          <a href="https://www.figma.com/community/plugin/1172891596048319817">
            Figma
          </a>
        </li>
        <li>
          <span>Generator (Soon)</span>
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
