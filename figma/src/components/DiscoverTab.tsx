import {
  Button,
  Divider,
  LoadingIndicator,
  Muted,
  SearchTextbox,
  Text,
  Toggle,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import {
  CheckIcon,
  CopyIcon,
  ImageIcon,
  NoteIcon,
} from "@primer/octicons-react";
import { useDebouncedEffect } from "@react-hookz/web";
import copy from "copy-to-clipboard";
import { Fragment, h } from "preact";
import { useCallback, useState } from "preact/hooks";
import spacetime from "spacetime";
import { ExportHandler, Image, NotifyHandler } from "../types";
import { apiClient } from "../utils/api";
import { convertDataURIToBinary, urlToBase64 } from "../utils/image";
import NotFound from "./NotFound";
import { Tooltip } from "./Tooltip";
import { FadeIn, SlideOver } from "./Transitions";

const Image = ({ url, prompt, avatar_url, created_at, name }: Image) => {
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

  const handleCopy = useCallback(() => {
    copy(prompt);
    setCopied(true);

    emit<NotifyHandler>("NOTIFY", "Prompt copied to clipboard.");

    setTimeout(() => setCopied(false), 2000);
  }, [prompt]);

  const handleExport = useCallback(async () => {
    const base64 = await urlToBase64(url);
    const image = await convertDataURIToBinary(base64);

    emit<ExportHandler>("EXPORT", image);
    setExported(true);

    setTimeout(() => setExported(false), 2000);
  }, [url]);

  return (
    <div key={url} className="image-container">
      <div className="image-actions">
        <Tooltip message="Copy prompt to clipboard">
          <button
            id="copy-button"
            className="btn secondary icon-only"
            onClick={handleCopy}
          >
            {copied ? <CheckIcon size={16} /> : <NoteIcon size={16} />}
          </button>
        </Tooltip>
        <Tooltip message="Export image to Figma">
          <button className="btn secondary icon-only" onClick={handleExport}>
            {exported ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
          </button>
        </Tooltip>
      </div>
      <img src={url} alt={prompt} width="172" height="172" />
      <div className="image-info">
        <Muted className="w-fit">{spacetime().since(created_at).rounded}</Muted>
        <img width="24" height="24" src={avatar_url} alt={name} />
      </div>
    </div>
  );
};

const ImageSkeleton = () => (
  <div className="image-skeleton">
    <ImageIcon size={24} />
  </div>
);

type DiscoverTabProps = {
  userId?: string | null;
};

export const DiscoverTab = ({ userId }: DiscoverTabProps) => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useDebouncedEffect(() => getImages({ page, reset: true }), [search], 300);

  const getImages = useCallback(
    ({
      page,
      reset,
      initialLooading = true,
      showHistory,
    }: {
      page: number;
      reset?: boolean;
      initialLooading?: boolean;
      showHistory?: boolean;
    }) => {
      setLoading(initialLooading);
      apiClient
        .getImages({
          page,
          search,
          user_id: showHistory ? (userId as string) : undefined,
        })
        .then(({ count, images: newImages }) => {
          setImages(reset ? newImages : [...images, ...newImages]);
          setCount(count);
        })
        .finally(() => {
          setLoading(false);
          setLoadingMore(false);
        });
    },
    [images, userId, search]
  );

  const handleSearch = useCallback((search: string) => {
    setSearch(search);
    setPage(1);
  }, []);

  const handleToggleShowHistory = useCallback(() => {
    setShowHistory(!showHistory);
    setPage(1);
    getImages({ page: 1, reset: true, showHistory: !showHistory });
  }, [showHistory]);

  const handleLoadMore = useCallback(() => {
    setPage(page + 1);
    setLoadingMore(true);
    getImages({ page: page + 1, initialLooading: false });
  }, [images, page]);

  const handleResetSearch = useCallback(() => {
    setSearch("");
    setPage(1);
  }, []);

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
        <Text>
          {!loading
            ? count > 0
              ? `Found ${count} ${
                  count === 1 ? "image" : "images"
                } matching your search`
              : "No images found"
            : "Searching..."}
        </Text>
        <VerticalSpace space="medium" />
        <Toggle value={showHistory} onClick={handleToggleShowHistory} size={48}>
          <Text>
            <Muted>Show history (images generated by you)</Muted>
          </Text>
        </Toggle>
        <VerticalSpace space="small" />
        <Divider />
        <VerticalSpace space="medium" />
        <FadeIn show={loading}>
          <div className="image-grid">
            {[...Array(9)].map((_, index) => (
              <ImageSkeleton key={index} />
            ))}
          </div>
        </FadeIn>
        <FadeIn show={!loading && images.length > 0}>
          <div className="image-grid">
            {images.map((image) => (
              <Image key={image.url} {...image} />
            ))}
          </div>
        </FadeIn>
        <FadeIn show={!loading && images.length == 0}>
          <NotFound onReset={handleResetSearch} />
        </FadeIn>
        {count > images.length && (
          <div className="flex mx-auto w-fit">
            <Button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="load-more"
            >
              {loadingMore && <LoadingIndicator color="disabled" />}
              {!loadingMore && "Load more"}
            </Button>
          </div>
        )}
      </Fragment>
    </SlideOver>
  );
};
