import {
  Button,
  Divider,
  SearchTextbox,
  Text,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  ImageIcon,
} from "@primer/octicons-react";
import { useDebouncedEffect } from "@react-hookz/web";
import copy from "copy-to-clipboard";
import { Fragment, h } from "preact";
import { useCallback, useState } from "preact/hooks";
import { DownloadHandler, Image } from "../types";
import { apiClient } from "../utils/api";
import { convertDataURIToBinary, urlToBase64 } from "../utils/image";
import { FadeIn, SlideOver } from "./Transitions";

type DiscoverTabProps = {};

const Image = ({ url, prompt }: Image) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    copy(prompt);
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
          <DownloadIcon size={20} />
        </button>
        <button className="btn secondary icon-only" onClick={handleCopy}>
          {copied ? <CheckIcon size={20} /> : <CopyIcon size={20} />}
        </button>
      </div>
      <img src={url} alt={prompt} width="172" height="172" />
    </div>
  );
};

const ImageSkeleton = () => (
  <div className="image-skeleton">
    <ImageIcon size={24} />
  </div>
);

export const DiscoverTab = ({}: DiscoverTabProps) => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useDebouncedEffect(() => getImages(true), [search], 300);

  const getImages = useCallback(
    (reset?: boolean) => {
      setLoading(true);
      apiClient
        .getImages({ page, search })
        .then(({ count, images: newImages }) => {
          setImages(reset ? newImages : [...images, ...newImages]);
          setCount(count);
        })
        .finally(() => setLoading(false));
    },
    [page, search, images]
  );

  const handleSearch = useCallback((search: string) => {
    setSearch(search);
  }, []);

  const handleLoadMore = useCallback(() => {
    setPage(page + 1);
    getImages();
  }, [page]);

  return (
    <SlideOver show>
      <Fragment>
        <VerticalSpace space="medium" />
        <h1 className="text-[28px] font-black leading-10">Discover</h1>
        <VerticalSpace space="extraSmall" />
        <Text as={"p"}>See what images you and others have generated</Text>
        <VerticalSpace space="extraLarge" />
        <SearchTextbox
          placeholder="Search by prompt keywords"
          onValueInput={handleSearch}
          value={search}
        />
        <VerticalSpace space="extraSmall" />
        {!loading && (
          <Text>
            Found {count} {count === 1 ? "image" : "images"} matching your
            search
          </Text>
        )}
        <VerticalSpace space="medium" />
        <Divider />
        <VerticalSpace space="medium" />
        <FadeIn show={loading}>
          <div className="image-grid">
            {[...Array(9)].map((_, index) => (
              <ImageSkeleton key={index} />
            ))}
          </div>
        </FadeIn>
        <FadeIn show={!loading}>
          <div className="image-grid">
            {images.map((image) => (
              <Image key={image.url} {...image} />
            ))}
          </div>
        </FadeIn>
        {count > images.length && (
          <Button onClick={handleLoadMore} className="mx-auto mb-5">
            Load more
          </Button>
        )}
      </Fragment>
    </SlideOver>
  );
};
