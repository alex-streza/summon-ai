import { useEffect, useRef } from "react";
import CircleType from "circletype";
import { ArrowUpRightIcon } from "@primer/octicons-react";

const CircleButton = () => {
  const circleInstance = useRef<HTMLDivElement>(null);
  const circleTypeRef = useRef<CircleType>();

  useEffect(() => {
    if (circleInstance.current) {
      circleTypeRef.current = new CircleType(circleInstance.current);

      return () => circleTypeRef.current?.destroy();
    }
  }, []);

  return (
    <a
      href="https://www.figma.com/community/plugin/1172891596048319817"
      target="_blank"
      rel="noopener noreferrer"
      className="h-[100px] w-[100px] "
    >
      <button className="relative ml-4 grid h-[100px] w-[100px] place-content-center rounded-full border-2 border-gray-900 bg-white">
        <h5
          className="absolute inset-0 -top-6 text-sm uppercase"
          ref={circleInstance}
        >
          Summon Art * Summon Art * Summon Art *
        </h5>
        <ArrowUpRightIcon size={60} />
      </button>
    </a>
  );
};

export default CircleButton;
