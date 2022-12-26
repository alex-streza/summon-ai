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
      <a
        className="hidden md:block"
        href="https://www.producthunt.com/posts/summon-ai?utm_source=badge-top-post-topic-badge&utm_medium=badge&utm_souce=badge-summon&#0045;ai"
        target="_blank"
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=366943&theme=dark&period=weekly&topic=Artificial Intelligence"
          alt="Summon&#0046;AI - Generate&#0032;beautiful&#0032;images&#0032;with&#0032;DALL&#0045;E&#0045;2&#0032;in&#0032;Figma | Product Hunt"
          width="250"
          height="54"
        />
      </a>
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
