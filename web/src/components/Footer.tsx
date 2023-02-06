import { MarkGithubIcon } from "@primer/octicons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export interface FooterProps {
  className?: string;
  isDark?: boolean;
}

const socialLinks = [
  {
    href: "https://twitter.com/alex_streza",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.162 5.65599C21.3985 5.99368 20.589 6.21546 19.76 6.31399C20.6337 5.79142 21.2877 4.969 21.6 3.99999C20.78 4.48799 19.881 4.82999 18.944 5.01499C18.3146 4.34157 17.4804 3.89495 16.5709 3.74457C15.6615 3.59419 14.7279 3.74848 13.9153 4.18344C13.1026 4.6184 12.4564 5.30967 12.0771 6.14978C11.6978 6.98989 11.6067 7.93177 11.818 8.82899C10.1551 8.74564 8.52832 8.31351 7.04328 7.56065C5.55823 6.80779 4.24812 5.75104 3.19799 4.45899C2.82628 5.09744 2.63095 5.82321 2.63199 6.56199C2.63199 8.01199 3.36999 9.29299 4.49199 10.043C3.828 10.0221 3.17862 9.84277 2.59799 9.51999V9.57199C2.59819 10.5377 2.93236 11.4736 3.54384 12.221C4.15532 12.9685 5.00647 13.4815 5.95299 13.673C5.33661 13.84 4.6903 13.8646 4.06299 13.745C4.32986 14.5762 4.85 15.3032 5.55058 15.8241C6.25117 16.345 7.09712 16.6338 7.96999 16.65C7.10247 17.3313 6.10917 17.835 5.04687 18.1322C3.98458 18.4293 2.87412 18.5142 1.77899 18.382C3.69069 19.6114 5.91609 20.2641 8.18899 20.262C15.882 20.262 20.089 13.889 20.089 8.36199C20.089 8.18199 20.084 7.99999 20.076 7.82199C20.8949 7.23016 21.6016 6.49701 22.163 5.65699L22.162 5.65599Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    href: "https://www.figma.com/community/plugin/1172891596048319817",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M6.95036 2H5.47536C5.08416 2 4.70899 2.1554 4.43237 2.43202C4.15576 2.70863 4.00036 3.08381 4.00036 3.475C4.00036 3.86619 4.15576 4.24137 4.43237 4.51798C4.70899 4.7946 5.08416 4.95 5.47536 4.95H6.95036V2ZM6.95036 1H9.42536C9.94414 0.999925 10.4498 1.16287 10.871 1.4658C11.2921 1.76874 11.6074 2.19635 11.7723 2.68822C11.9372 3.18009 11.9434 3.71135 11.79 4.20692C11.6366 4.7025 11.3313 5.13734 10.9174 5.45C11.4429 5.84345 11.7906 6.42955 11.884 7.07936C11.9774 7.72917 11.8088 8.38947 11.4154 8.915C11.0219 9.44053 10.4358 9.78823 9.786 9.88163C9.13618 9.97502 8.47588 9.80645 7.95036 9.413V11.375C7.95031 11.7965 7.84262 12.211 7.63749 12.5792C7.43237 12.9474 7.1366 13.2572 6.77823 13.479C6.41986 13.7009 6.01077 13.8276 5.58972 13.8471C5.16867 13.8666 4.74962 13.7782 4.3723 13.5903C3.99498 13.4025 3.67189 13.1214 3.43364 12.7737C3.1954 12.426 3.04991 12.0232 3.01095 11.6035C2.97199 11.1838 3.04087 10.7611 3.21104 10.3755C3.38122 9.98986 3.64706 9.65409 3.98336 9.4C3.6777 9.16945 3.4298 8.87104 3.25921 8.52829C3.08862 8.18555 3.00001 7.80785 3.00036 7.425C3.00036 6.618 3.38636 5.902 3.98336 5.45C3.56938 5.13734 3.26412 4.7025 3.1107 4.20692C2.95728 3.71135 2.96347 3.18009 3.12838 2.68822C3.2933 2.19635 3.6086 1.76874 4.02975 1.4658C4.45089 1.16287 4.95658 0.999925 5.47536 1H6.95036ZM7.95036 2V4.95H9.42536C9.81655 4.95 10.1917 4.7946 10.4683 4.51798C10.745 4.24137 10.9004 3.86619 10.9004 3.475C10.9004 3.08381 10.745 2.70863 10.4683 2.43202C10.1917 2.1554 9.81655 2 9.42536 2H7.95036ZM5.47536 8.9H6.95036V5.95H5.47536C5.08416 5.9492 4.70867 6.10384 4.4315 6.3799C4.15432 6.65595 3.99815 7.03081 3.99736 7.422C3.99656 7.81319 4.1512 8.18868 4.42725 8.46586C4.70331 8.74304 5.07816 8.8992 5.46936 8.9H5.47536ZM4.00036 11.375C4.00036 10.562 4.65736 9.903 5.47036 9.9H6.95036V11.375C6.95036 11.7662 6.79496 12.1414 6.51834 12.418C6.24172 12.6946 5.86655 12.85 5.47536 12.85C5.08416 12.85 4.70899 12.6946 4.43237 12.418C4.15576 12.1414 4.00036 11.7662 4.00036 11.375ZM7.95036 7.422C7.95115 7.03107 8.10711 6.65644 8.38396 6.38043C8.66082 6.10442 9.03592 5.9496 9.42685 5.95C9.81779 5.9504 10.1926 6.10598 10.4689 6.38255C10.7452 6.65912 10.9004 7.03407 10.9004 7.425C10.9004 7.81593 10.7452 8.19088 10.4689 8.46745C10.1926 8.74403 9.81779 8.8996 9.42685 8.9C9.03592 8.9004 8.66082 8.74558 8.38396 8.46957C8.10711 8.19356 7.95115 7.81893 7.95036 7.428V7.422Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    href: "https://github.com/alex-streza/summon-ai",
    icon: <MarkGithubIcon />,
  },
];

const Footer = ({ isDark, className = "bg-white" }: FooterProps) => {
  const { data: session } = useSession();

  const isLoggedIn = session?.user;

  return (
    <footer
      className={`
        ${className} z-10 mt-auto flex w-full items-center justify-between border-t ${
        isDark ? "border-white" : "border-gray-900"
      } py-5 md:py-6`}
    >
      <a
        className="hidden md:block"
        href="https://www.producthunt.com/posts/summon-ai?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-summon&#0045;ai"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=366943&theme=dark"
          alt="Summon&#0046;AI - Generate&#0032;beautiful&#0032;images&#0032;with&#0032;DALL&#0045;E&#0045;2&#0032;in&#0032;Figma | Product Hunt"
          width="250"
          height="54"
        />
      </a>
      <ul
        className={`grid grid-cols-3 items-center gap-4 text-sm ${
          isDark ? "text-white" : "text-gray-800"
        } uppercase md:mx-auto md:flex md:gap-16`}
      >
        <li>
          <Link href="/showcase">Showcase</Link>
        </li>
        <li>
          <Link href="/guide">Guide</Link>
        </li>
        <li>
          <a href="https://www.figma.com/community/plugin/1172891596048319817">
            Figma
          </a>
        </li>
        <li>
          <a
            className="flex items-center gap-1"
            href="https://github.com/alex-streza/summon-ai"
          >
            Contribute
          </a>
        </li>
        {isLoggedIn && (
          <li>
            <Link href="/account">Account</Link>
          </li>
        )}
      </ul>
      <div className="flex h-full flex-col justify-between">
        {socialLinks.map(({ href, icon }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex scale-90 rounded-full bg-gray-700 py-1.5 px-3 text-xxs text-white transition-transform peer-hover:rotate-12 peer-hover:scale-100 hover:rotate-12 hover:scale-100"
          >
            {icon}
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
