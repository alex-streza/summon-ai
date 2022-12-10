import {
  IconCheckCircleFilled32,
  SearchTextbox,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { Fragment, h } from "preact";
import { useCallback, useEffect, useState } from "react";
import { DownloadHandler, Image } from "../types";
import { apiClient } from "../utils/api";
import { SlideOver } from "./Transitions";
import copy from "copy-to-clipboard";
import { convertDataURIToBinary, urlToBase64 } from "../utils/image";
import { emit } from "@create-figma-plugin/utilities";

type DiscoverTabProps = {};

const Image = ({ url, prompt }: Image) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    copy(prompt, {
      debug: true,
      message: "Press #{key} to copy",
    });
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  }, [prompt]);

  const handleDownload = useCallback(async () => {
    const base64 = await urlToBase64(url);
    const image = await convertDataURIToBinary(base64);

    emit<DownloadHandler>("DOWNLOAD", image);
  }, [url]);

  return (
    <div key={url} className="image-container">
      <div className="image-actions">
        <button className="btn secondary icon-only" onClick={handleDownload}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path
              d="M4.97 11.03a.75.75 0 111.06-1.06L11 14.94V2.75a.75.75 0 011.5 0v12.19l4.97-4.97a.75.75 0 111.06 1.06l-6.25 6.25a.75.75 0 01-1.06 0l-6.25-6.25zm-.22 9.47a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H4.75z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
        <button className="btn secondary icon-only" onClick={handleCopy}>
          {copied ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                fill-rule="evenodd"
                fill="currentColor"
                d="M21.03 5.72a.75.75 0 010 1.06l-11.5 11.5a.75.75 0 01-1.072-.012l-5.5-5.75a.75.75 0 111.084-1.036l4.97 5.195L19.97 5.72a.75.75 0 011.06 0z"
              ></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                fill-rule="evenodd"
                fill="currentColor"
                d="M7.024 3.75c0-.966.784-1.75 1.75-1.75H20.25c.966 0 1.75.784 1.75 1.75v11.498a1.75 1.75 0 01-1.75 1.75H8.774a1.75 1.75 0 01-1.75-1.75V3.75zm1.75-.25a.25.25 0 00-.25.25v11.498c0 .139.112.25.25.25H20.25a.25.25 0 00.25-.25V3.75a.25.25 0 00-.25-.25H8.774z"
              ></path>
              <path d="M1.995 10.749a1.75 1.75 0 011.75-1.751H5.25a.75.75 0 110 1.5H3.745a.25.25 0 00-.25.25L3.5 20.25c0 .138.111.25.25.25h9.5a.25.25 0 00.25-.25v-1.51a.75.75 0 111.5 0v1.51A1.75 1.75 0 0113.25 22h-9.5A1.75 1.75 0 012 20.25l-.005-9.501z"></path>
            </svg>
          )}
        </button>
      </div>
      <img src={url} alt={prompt} width="180" height="180" />
    </div>
  );
};

export const DiscoverTab = ({}: DiscoverTabProps) => {
  const [search, setSearch] = useState("");
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    apiClient.getImages({ count: 9, search }).then((images) => {
      setImages(images);
    });
  }, [search]);

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
        <div className="image-grid">
          {images.map((image) => (
            <Image key={image.url} {...image} />
          ))}
        </div>
      </Fragment>
    </SlideOver>
  );
};
