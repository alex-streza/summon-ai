import { Link, Text, VerticalSpace } from "@create-figma-plugin/ui";
import { Fragment, h } from "preact";
import { SlideOver } from "./Transitions";

export const SettingsTab = () => {
  return (
    <SlideOver show>
      <Fragment>
        <VerticalSpace space="medium" />
        <h1 className="text-[28px] font-black leading-10">Settings</h1>
        <VerticalSpace space="medium" />
      </Fragment>
    </SlideOver>
  );
};
