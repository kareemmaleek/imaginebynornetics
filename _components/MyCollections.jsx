import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import moment from "moment";
import { useAuth } from "@/common/AuthContext";
import {
  IconEye,
  IconDownload,
  IconPhoto,
  IconHeart,
  IconCheck,
  IconLoader2,
  IconCalendarMonth,
  IconAspectRatio,
  IconBrain,
  IconFilter,
  IconChevronDown,
  IconX,
} from "@tabler/icons-react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import ImageZoom from "./ImageZoom";
import { IconZoomIn } from "@tabler/icons-react";

function MyCollections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [zoomImg, setZoomImg] = useState(null);
  const { user } = useAuth();

  // Filter states
  const [filterType, setFilterType] = useState({ image: true, video: false });
  const [selectedEngine, setSelectedEngine] = useState("all");
  const [selectedRatio, setSelectedRatio] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");

  // Filter option data from API
  const [availableEngines, setAvailableEngines] = useState([]);
  const [availableRatios, setAvailableRatios] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);

  // Dropdown open states
  const [engineOpen, setEngineOpen] = useState(false);
  const [ratioOpen, setRatioOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);

  const scrollContainerRef = useRef(null);
  const observerRef = useRef(null);
  const LIMIT = 20;

  const showError = (msg) => {
    Toastify({
      text: msg,
      duration: 2000,
      close: true,
      position: "center",
      stopOnFocus: true,
      className: "ibn-error",
      style: {
        background:
          "linear-gradient(109.6deg, rgba(217, 67, 67, 1) 11.2%, rgba(242, 106, 75, 1) 100.6%)",
      },
    }).showToast();
  };

  // Build content_type param from checkboxes
  const getContentType = () => {
    if (filterType.image && filterType.video) return "all";
    if (filterType.image) return "image";
    if (filterType.video) return "video";
    return "all";
  };

  // Fetch images with filters and pagination
  const getMyImages = useCallback(
    async (pageNum, isReset = false) => {
      const token = localStorage.getItem("ibn_token");
      if (!token) return;

      if (!isReset && loadingMore) return;
      if (isReset) setLoading(true);
      else setLoadingMore(true);

      try {
        const response = await axios.get("/api/gallery/getMyImages", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            content_type: getContentType(),
            ai_engine: selectedEngine,
            aspect_ratio: selectedRatio,
            month: selectedMonth,
            page: pageNum,
            limit: LIMIT,
          },
        });

        if (response.data.error === 0) {
          const newData = response.data.data;
          const pagination = response.data.pagination;
          const filterOpts = response.data.filterOptions;

          if (isReset) {
            setCollections(newData);
          } else {
            setCollections((prev) => [...prev, ...newData]);
          }

          setHasMore(pagination.hasMore);
          setPage(pageNum);

          // Update available filter options
          if (filterOpts) {
            if (filterOpts.engines) setAvailableEngines(filterOpts.engines);
            if (filterOpts.ratios) setAvailableRatios(filterOpts.ratios);
            if (filterOpts.months) setAvailableMonths(filterOpts.months);
          }
        }
      } catch (err) {
        console.error(err);
        const details = err.response?.data?.details;
        if (details && Array.isArray(details)) {
          details.forEach((msg) => showError(msg));
        } else {
          showError(
            err.response?.data?.message || "Failed to load collections",
          );
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filterType, selectedEngine, selectedRatio, selectedMonth, loadingMore],
  );

  // Reset and reload on filter change
  useEffect(() => {
    setCollections([]);
    setPage(1);
    setHasMore(true);
    getMyImages(1, true);
  }, [filterType, selectedEngine, selectedRatio, selectedMonth]);

  // Sticky filter sidebar on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Offset for mobile header (56px)
      setIsSticky(window.scrollY > (window.innerWidth < 1024 ? 40 : 60));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Infinite scroll — observe sentinel
  const lastImageRef = useCallback(
    (node) => {
      if (loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loadingMore) {
            getMyImages(page + 1, false);
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
    [loadingMore, hasMore, page, getMyImages],
  );

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest("[data-dropdown]")) {
        setEngineOpen(false);
        setRatioOpen(false);
        setMonthOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Group collections by month for display
  const groupedByMonth = collections.reduce((acc, item) => {
    const monthYear = moment(item.created_at).format("MMMM, YYYY");
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(item);
    return acc;
  }, {});
  const monthKeys = Object.keys(groupedByMonth);

  // Dropdown select component
  const FilterDropdown = ({
    label,
    icon,
    value,
    onChange,
    options,
    isOpen,
    setIsOpenFn,
    displayValue,
  }) => (
    <div className="w-full" data-dropdown>
      <span className="font-semibold uppercase tracking-widest text-thirdColor text-[10px] mb-2 flex items-center gap-1.5">
        {label}
      </span>
      <div className="relative mt-1">
        <div
          onClick={() => setIsOpenFn(!isOpen)}
          className="w-full p-2 px-3 bg-mainColor/60 border border-acsentColor/20 rounded-lg text-sm text-white cursor-pointer flex items-center justify-between hover:border-acsentColor/40 transition-colors"
        >
          <span className="truncate capitalize">{displayValue || value}</span>
          <IconChevronDown
            size={14}
            className={`text-thirdColor transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 p-2 mt-1 w-full bg-secondaryColor border border-acsentColor/20 rounded-lg shadow-2xl z-[100] max-h-48 overflow-y-auto">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpenFn(false);
                }}
                className={`px-3 py-2 text-sm cursor-pointer transition-colors capitalize rounded-lg ${
                  value === opt.value
                    ? "bg-acsentColor/20 text-acsentColor"
                    : "text-thirdColor hover:bg-mainColor hover:text-acsentColor"
                }`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Lazy-load image
  const LazyImage = ({ src, alt }) => {
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
          className="w-10 h-10 object-contain animate-pulse-slow opacity-50"
        />
      </div>
    );

    return (
      <div
        ref={imgRef}
        className="w-[180px] h-[180px] relative overflow-hidden bg-mainColor/50"
      >
        {inView ? (
          <>
            {!loaded && <LogoPlaceholder />}
            <img
              src={src}
              alt={alt || "AI Art"}
              className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setLoaded(true)}
              loading="lazy"
            />
          </>
        ) : (
          <LogoPlaceholder />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <IconLoader2 size={28} className="animate-spin text-acsentColor" />
        <span className="ml-3 text-sm text-thirdColor italic animate-pulse">
          Loading your collections...
        </span>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden sticky top-14 z-40 w-full p-3 bg-mainColor/80 backdrop-blur-md border-b border-acsentColor/10 flex justify-between items-center mb-3">
        <span className="text-sm font-bold text-acsentColor flex items-center gap-2">
          <IconFilter size={16} /> Filters
        </span>
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="px-3 py-1.5 bg-acsentColor/20 text-acsentColor rounded-lg text-xs font-semibold"
        >
          Options
        </button>
      </div>

      <div className="w-full p-3 md:p-10 flex flex-col lg:flex-row justify-between gap-6 relative">
        {/* MAIN CONTENT */}
        <div className="w-full lg:flex-1">
          <div className="mb-8">
            <h1 className="text-xl font-bold">My Collections</h1>
            <p className="text-sm italic text-thirdColor">
              all your uploaded ai arts in one place
            </p>
          </div>

          {monthKeys.length === 0 && !loadingMore ? (
            <div className="w-full h-[400px] flex flex-col justify-center items-center text-thirdColor">
              <IconPhoto size={48} className="mb-3 opacity-50" />
              <p className="text-sm italic">
                {filterType.image || filterType.video
                  ? "No arts found with selected filters."
                  : "You haven't uploaded any arts yet."}
              </p>
              <Link href="/upload-arts">
                <span className="text-acsentColor text-sm mt-2 underline cursor-pointer hover:text-thirdColor">
                  Upload your first art →
                </span>
              </Link>
            </div>
          ) : (
            <>
              {monthKeys.map((month, idx) => {
                const items = groupedByMonth[month];
                return (
                  <div key={idx} className="w-full h-auto mb-8">
                    <h2 className="text-lg font-bold mb-3">{month}</h2>
                    <div className="w-full h-auto flex flex-wrap gap-0">
                      {items.map((item, x) => {
                        // Calculate global index for sentinel placement
                        const globalIdx = collections.findIndex(
                          (c) => c.uid === item.uid,
                        );
                        const isLast = globalIdx === collections.length - 1;

                        return (
                          <Link
                            href={`/details/${item.uid}`}
                            key={item.uid || x}
                          >
                            <div
                              ref={isLast ? lastImageRef : null}
                              className="group relative"
                            >
                              <LazyImage
                                src={item.media_thumb || item.media_path}
                                alt={item.media_name}
                              />
                              {/* Approval Status Badge */}
                              {(!item.approval_status ||
                                item.approval_status !== "approved") && (
                                <div
                                  className={`absolute top-1 left-1 px-2 py-0.5 rounded-full text-[10px] font-semibold z-10 ${
                                    item.approval_status === "rejected"
                                      ? "bg-red-500/80 text-white"
                                      : "bg-yellow-500/80 text-gray-900"
                                  }`}
                                >
                                  {item.approval_status === "rejected"
                                    ? "Rejected"
                                    : "Pending"}
                                </div>
                              )}
                              <div className="hidden group-hover:flex absolute bottom-0 left-0 w-full bg-secondaryColor/70  p-2 justify-between items-center text-xs">
                                <span className="flex items-center gap-1">
                                  <IconEye size={12} /> {item.media_views}
                                </span>
                                <span className="flex items-center gap-1">
                                  <IconHeart size={12} />{" "}
                                  {item.media_likes || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                  <IconDownload size={12} />{" "}
                                  {item.media_download}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setZoomImg({
                                      src: item.media_path,
                                      alt: item.media_name,
                                    });
                                  }}
                                  className="p-1.5 bg-acsentColor/20 text-acsentColor rounded-full hover:bg-acsentColor hover:text-mainColor transition-all"
                                  title="Zoom"
                                >
                                  <IconZoomIn size={12} />
                                </button>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* IMAGE ZOOM */}
              {zoomImg && (
                <ImageZoom
                  src={zoomImg.src}
                  alt={zoomImg.alt}
                  onClose={() => setZoomImg(null)}
                />
              )}

              {/* LOADING MORE */}
              {loadingMore && (
                <div className="w-full py-6 flex justify-center items-center">
                  <IconLoader2
                    size={22}
                    className="animate-spin text-acsentColor"
                  />
                  <span className="ml-2 text-thirdColor text-sm italic">
                    Loading more...
                  </span>
                </div>
              )}

              {/* END OF LIST */}
              {!hasMore && collections.length > 0 && !loadingMore && (
                <div className="w-full py-6 flex justify-center items-center">
                  <p className="text-thirdColor/50 text-xs italic">
                    — You've reached the end —
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* FILTER SIDEBAR - sticky on desktop, drawer on mobile */}

        {/* Mobile Backdrop */}
        {mobileFilterOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] lg:hidden"
            onClick={() => setMobileFilterOpen(false)}
          />
        )}

        <div
          className={`
            w-[280px] lg:w-[250px] lg:min-w-[250px]
            fixed inset-y-0 right-0 z-[160] transform bg-secondaryColor p-6 shadow-2xl transition-transform duration-300 lg:static lg:h-fit lg:translate-x-0 lg:z-10 lg:rounded-xl lg:border lg:border-acsentColor/10 
            ${mobileFilterOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
            ${isSticky ? "lg:sticky lg:top-4 xl:top-20 self-start" : ""}
          `}
        >
          <div className="flex items-center justify-between lg:block mb-6">
            <h3 className="font-semibold text-sm text-acsentColor flex items-center gap-2">
              <IconFilter size={16} />
              Filters
            </h3>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="lg:hidden p-1 text-thirdColor"
            >
              <IconX size={20} />
            </button>
          </div>

          <div className="w-full h-auto flex flex-col gap-5">
            {/* CONTENT TYPE */}
            <div className="w-full">
              <span className="font-bold uppercase tracking-widest text-thirdColor text-[10px] mb-2 block">
                Content Type
              </span>

              {/* Image Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer group mt-2">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={filterType.image}
                    onChange={() =>
                      setFilterType({ ...filterType, image: !filterType.image })
                    }
                  />
                  <div
                    className={`w-4 h-4 rounded-md  transition-all duration-200 flex items-center justify-center ${
                      filterType.image
                        ? "bg-acsentColor border-2 border-acsentColor"
                        : "border-acsentColor/20 group-hover:border-acsentColor/60 bg-mainColor/50"
                    }`}
                  >
                    {filterType.image && (
                      <IconCheck
                        size={14}
                        className="text-mainColor stroke-[4]"
                      />
                    )}
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold transition-colors duration-200 ${
                    filterType.image
                      ? "text-acsentColor"
                      : "text-thirdColor group-hover:text-acsentColor/80"
                  }`}
                >
                  Image
                </span>
              </label>

              {/* Video Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer group mt-2">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={filterType.video}
                    onChange={() =>
                      setFilterType({ ...filterType, video: !filterType.video })
                    }
                  />
                  <div
                    className={`w-4 h-4 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                      filterType.video
                        ? "bg-acsentColor border-acsentColor"
                        : "border-acsentColor/20 group-hover:border-acsentColor/60 bg-mainColor/50"
                    }`}
                  >
                    {filterType.video && (
                      <IconCheck
                        size={14}
                        className="text-mainColor stroke-[4]"
                      />
                    )}
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold transition-colors duration-200 ${
                    filterType.video
                      ? "text-acsentColor"
                      : "text-thirdColor group-hover:text-acsentColor/80"
                  }`}
                >
                  Video
                </span>
              </label>
            </div>

            {/* AI ENGINE DROPDOWN */}
            <FilterDropdown
              label="AI Engine"
              value={selectedEngine}
              onChange={setSelectedEngine}
              isOpen={engineOpen}
              setIsOpenFn={setEngineOpen}
              displayValue={
                selectedEngine === "all" ? "All Engines" : selectedEngine
              }
              options={[
                { value: "all", label: "All Engines" },
                ...availableEngines.map((e) => ({
                  value: e,
                  label: e,
                })),
              ]}
            />

            {/* ASPECT RATIO DROPDOWN */}
            <FilterDropdown
              label="Aspect Ratio"
              icon={<IconAspectRatio size={10} />}
              value={selectedRatio}
              onChange={setSelectedRatio}
              isOpen={ratioOpen}
              setIsOpenFn={setRatioOpen}
              displayValue={
                selectedRatio === "all" ? "All Ratios" : selectedRatio
              }
              options={[
                { value: "all", label: "All Ratios" },
                ...availableRatios.map((r) => ({
                  value: r,
                  label: r,
                })),
              ]}
            />

            {/* MONTH DROPDOWN */}
            <FilterDropdown
              label="Month"
              icon={<IconCalendarMonth size={10} />}
              value={selectedMonth}
              onChange={setSelectedMonth}
              isOpen={monthOpen}
              setIsOpenFn={setMonthOpen}
              displayValue={
                selectedMonth === "all"
                  ? "All Months"
                  : availableMonths.find((m) => m.month_value === selectedMonth)
                      ?.month_label || selectedMonth
              }
              options={[
                { value: "all", label: "All Months" },
                ...availableMonths.map((m) => ({
                  value: m.month_value,
                  label: m.month_label,
                })),
              ]}
            />

            {/* RESET FILTERS */}
            <button
              onClick={() => {
                setFilterType({ image: true, video: false });
                setSelectedEngine("all");
                setSelectedRatio("all");
                setSelectedMonth("all");
              }}
              className="w-full mt-2 p-2 text-xs font-semibold text-thirdColor border border-acsentColor/20 rounded-lg hover:bg-acsentColor/10 hover:text-acsentColor transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyCollections;
