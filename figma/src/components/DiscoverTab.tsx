import {
  IconSearch32,
  SearchTextbox,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { Fragment, h } from "preact";
import { useCallback, useEffect, useState } from "react";
import { Image } from "../types";
import { apiClient } from "../utils/api";
import { SlideOver } from "./Transitions";

type DiscoverTabProps = {};

export const DiscoverTab = ({}: DiscoverTabProps) => {
  const [search, setSearch] = useState("");
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    apiClient.getImages({ count: 9, search }).then((images) => {
      setImages(images);
    });
  }, []);

  const handleSearch = useCallback((search: string) => {
    setSearch(search);
  }, []);

  return (
    <SlideOver show>
      <Fragment>
        <VerticalSpace space="medium" />
        <h1 className="text-[28px] font-black leading-10">Discover</h1>
        <VerticalSpace space="small" />
        <SearchTextbox
          placeholder="Search by prompt keywords"
          onValueInput={handleSearch}
          value={search}
        />
        <VerticalSpace space="small" />

        <div>
          {images.map((image) => {
            return (
              <div>
                <img src={image.url} alt={image.prompt} />
              </div>
            );
          })}
        </div>
      </Fragment>
    </SlideOver>
  );
};
