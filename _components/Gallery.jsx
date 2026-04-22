import {
  IconCalendarEvent,
  IconCaretDownFilled,
  IconDownload,
  IconEye,
  IconHeart,
  IconImageInPicture,
  IconLoader2,
  IconMovie,
  IconNews,
  IconPolaroid,
  IconRocket,
  IconVideo,
} from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";

function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("On Trending");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSticky, setIsSticky] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState("image");

  const dropdownRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const filterRef = useRef(null);
  const observerRef = useRef(null);
  const LIMIT = 20;

  const filters = [
    {
      label: "On Trending",
      icon: <IconRocket size={18} className="hidden md:block" />,
    },
    {
      label: "Today",
      icon: <IconCalendarEvent size={18} className="hidden md:block" />,
    },
    {
      label: "Top Likes",
      icon: <IconHeart size={18} className="hidden md:block" />,
    },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sticky filter on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsSticky(scrollTop > 60);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show toast helper
  const showError = (msg) => {
    Toastify({
      text: msg,
      duration: 2000,
      close: true,
      position: "center",
      stopOnFocus: true,
      escapeMarkup: true,
      className: "ibn-error",
      style: {
        background:
          "linear-gradient( 109.6deg,  rgba(217,67,67,1) 11.2%, rgba(242,106,75,1) 100.6% )",
      },
    }).showToast();
  };

  // Fetch images
  const getImages = useCallback(
    async (pageNum, isReset = false) => {
      if (loading) return;
      setLoading(true);

      try {
        const response = await axios.get("/api/gallery/getAll", {
          params: {
            filter: selectedFilter,
            content_type: selectedContentType,
            page: pageNum,
            limit: LIMIT,
          },
        });

        if (response.data.error === 0) {
          const newData = response.data.data;
          const pagination = response.data.pagination;

          if (isReset) {
            setGallery(newData);
          } else {
            setGallery((prev) => [...prev, ...newData]);
          }

          setHasMore(pagination.hasMore);
          setPage(pageNum);
        }
      } catch (err) {
        console.error(err);
        // Show Joi validation errors if returned
        const details = err.response?.data?.details;
        if (details && Array.isArray(details)) {
          details.forEach((msg) => showError(msg));
        } else {
          showError(err.response?.data?.message || "Failed to fetch images");
        }
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [selectedFilter, selectedContentType, loading],
  );

  // Reset when filter changes
  useEffect(() => {
    setGallery([]);
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);
    getImages(1, true);
  }, [selectedFilter, selectedContentType]);

  // Infinite scroll — Intersection Observer on sentinel
  const lastImageRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loading) {
            getImages(page + 1, false);
          }
        },
        {
          root: scrollContainerRef.current,
          rootMargin: "300px",
          threshold: 0,
        },
      );

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, page, getImages],
  );

  // Lazy image component
  const LazyImage = ({ src, alt, width, height }) => {
    const [loaded, setLoaded] = useState(false);
    const [inView, setInView] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        },
        { rootMargin: "200px", threshold: 0 },
      );

      if (imgRef.current) observer.observe(imgRef.current);
      return () => observer.disconnect();
    }, []);

    const LogoPlaceholder = () => (
      <div className="absolute inset-0 flex items-center justify-center bg-mainColor/20 backdrop-blur-sm z-[5]">
        <img
          src="/assets/images/logo-ibn.png"
          alt="Loading..."
          className="w-12 h-12 object-contain animate-pulse-slow opacity-50"
        />
      </div>
    );

    return (
      <div
        ref={imgRef}
        className="relative w-full overflow-hidden bg-secondaryColor/50"
      >
        {inView ? (
          <>
            {!loaded && <LogoPlaceholder />}
            <Image
              src={src}
              className={`h-auto max-w-full transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
              alt={alt || "AI generated art"}
              width={width}
              height={height}
              style={{ width: "100%", height: "auto" }}
              onLoad={() => setLoaded(true)}
              loading="lazy"
            />
          </>
        ) : (
          <div className="w-full aspect-[3/4] relative bg-secondaryColor/30 rounded-lg">
            <LogoPlaceholder />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="w-full p-3 md:p-5 relative">
        {/* NEWS BANNER */}
        {/* <div className="w-full p-1 px-4 absolute top-0 left-0 bg-yellow-400 text-gray-700 text-sm font-semibold z-[50]">
          <div className="w-full flex items-center justify-center gap-2">
            <p className="font-bold flex items-center gap-1">
              <IconNews size={16} /> UPDATE NEWS:{" "}
            </p>
            <p className="flex items-center gap-0">
              We just pop up!, let's create something amazing!{" "}
              <IconRocket size={16} />
            </p>
          </div>
        </div> */}

        {/* STICKY FILTER SECTION */}
        <div
          ref={filterRef}
          className={`w-full p-3 mb-3 flex items-center justify-between gap-2 transition-all ease-in duration-500 z-[90] border border-acsentColor/20 ${
            isSticky
              ? "sticky -top-0 left-0 my-0 bg-acsentColor/10 backdrop-blur-md shadow-lg shadow-mainColor/50 rounded-b-lg px-5 py-3 -mx-0"
              : "bg-secondaryColor rounded-lg"
          }`}
        >
          {/* DROPDOWN FILTER */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 px-4 bg-gradient-to-br from-acsentColor to-[#3387ae] rounded-full text-white font-bold text-xs md:text-sm hover:opacity-90 cursor-pointer transition-all flex items-center gap-2"
            >
              {filters.find((f) => f.label === selectedFilter)?.icon}
              {selectedFilter}
              <IconCaretDownFilled
                size={16}
                className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </div>

            {isOpen && (
              <div className="absolute top-full left-0 p-2 mt-2 w-48 bg-secondaryColor border border-acsentColor/20 rounded-lg shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {filters.map((filter) => (
                  <div
                    key={filter.label}
                    onClick={() => {
                      setSelectedFilter(filter.label);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-2 my-1 rounded-md text-sm cursor-pointer transition-colors ${
                      selectedFilter === filter.label
                        ? "bg-acsentColor/20 text-acsentColor"
                        : "text-thirdColor hover:bg-mainColor hover:text-acsentColor"
                    }`}
                  >
                    {filter.icon}
                    <span className="font-semibold">{filter.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-fit flex items-center gap-2">
            <div
              onClick={() =>
                setSelectedContentType(
                  selectedContentType === "image" ? "all" : "image",
                )
              }
              className={`p-2 px-4 rounded-full font-bold text-sm hover:opacity-90 cursor-pointer transition-all flex justify-center items-center gap-2 ${
                selectedContentType === "image"
                  ? " bg-acsentColor/10 border border-acsentColor text-acsentColor"
                  : "bg-acsentColor/10 text-thirdColor border border-acsentColor/20"
              }`}
            >
              <IconPolaroid size={18} className="hidden md:block" />
              Images
            </div>

            <div
              onClick={() =>
                setSelectedContentType(
                  selectedContentType === "video" ? "all" : "video",
                )
              }
              className={`p-2 px-4 rounded-full font-bold text-sm hover:opacity-90 cursor-pointer transition-all flex justify-center items-center gap-2 ${
                selectedContentType === "video"
                  ? "bg-acsentColor/10 border border-acsentColor text-acsentColor"
                  : "bg-acsentColor/10 text-thirdColor border border-acsentColor/20"
              }`}
            >
              <IconMovie size={18} className="hidden md:block" />
              Videos
            </div>
          </div>
        </div>

        {/* INITIAL LOADING */}
        {initialLoading && (
          <div className="w-full py-20 flex justify-center items-center">
            <IconLoader2 size={32} className="animate-spin text-acsentColor" />
            <span className="ml-3 text-thirdColor text-sm italic animate-pulse">
              Loading gallery...
            </span>
          </div>
        )}

        {/* EMPTY STATE */}
        {!initialLoading && gallery.length === 0 && (
          <div className="w-full py-20 flex flex-col justify-center items-center text-thirdColor">
            <IconImageInPicture size={48} className="mb-3 opacity-50" />
            <p className="text-sm italic">No Media found for this filter.</p>
          </div>
        )}

        {/* MASONRY GRID */}
        {!initialLoading && gallery.length > 0 && (
          <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-0 space-y-2 w-full h-auto">
            {gallery.map((item, x) => {
              const isLast = x === gallery.length - 1;
              return (
                <Link href={`/details/${item.uid}`} key={item.uid || x}>
                  <div
                    ref={isLast ? lastImageRef : null}
                    className="group w-auto h-auto relative shadow-lg"
                  >
                    <LazyImage
                      src={item.media_thumb || item.media_path}
                      alt={item.media_name || "AI Art"}
                      width={350}
                      height={500}
                    />
                    <div className="hidden bg-secondaryColor/60 w-full h-full absolute top-0 left-0 group-hover:flex justify-center items-center">
                      <div className="flex-col">
                        <div className="text-sm text-center mb-3">
                          <span className="mr-3">
                            <IconEye className="inline-block mr-1" size={14} />
                            {item.media_views}
                          </span>
                          <span className="mr-3">
                            <IconHeart
                              className="inline-block mr-1"
                              size={14}
                            />
                            {item.media_likes}
                          </span>
                          <IconDownload
                            className="inline-block mr-1"
                            size={14}
                          />
                          {item.media_download}
                        </div>
                        <div className="flex gap-2 justify-center mb-3">
                          <div className="text-xs text-center p-2 px-4 bg-mainColor text-acsentColor rounded-full ">
                            by {""}
                            <span className="font-bold underline cursor-pointer">
                              {item.created_by}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* LOADING MORE */}
        {loading && !initialLoading && (
          <div className="w-full py-8 flex justify-center items-center">
            <IconLoader2 size={24} className="animate-spin text-acsentColor" />
            <span className="ml-2 text-thirdColor text-sm italic">
              Loading more...
            </span>
          </div>
        )}

        {/* END OF LIST */}
        {!hasMore && gallery.length > 0 && !loading && (
          <div className="w-full py-8 flex justify-center items-center">
            <p className="text-thirdColor/50 text-xs italic">
              — You've reached the end —
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default Gallery;
