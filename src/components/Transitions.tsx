import { Transition } from "@headlessui/react";
import { h, VNode } from "preact";

export const fadeInProps = {
  enter: "transition-opacity duration-150",
  enterFrom: "opacity-0",
  enterTo: "opacity-100",
  leave: "transition-opacity duration-150",
  leaveFrom: "opacity-100",
  leaveTo: "opacity-0",
};

export const FadeIn = ({
  children,
  show,
}: {
  children: VNode;
  show: boolean;
}) => {
  return (
    <Transition show={show} appear {...fadeInProps}>
      {children as any}
    </Transition>
  );
};

export const slideOverProps = {
  enter: "transform transition ease-in-out duration-300",
  enterFrom: "-translate-y-12 opacity-0",
  enterTo: "translate-y-0 opacity-100",
  leave: "transform transition ease-in-out duration-300",
  leaveFrom: "translate-y-0 opacity-100",
  leaveTo: "-translate-y-12 opacity-0",
};

export const SlideOver = ({
  children,
  show,
}: {
  children: VNode;
  show: boolean;
}) => {
  return (
    <Transition show={show} appear {...slideOverProps}>
      {children as any}
    </Transition>
  );
};
