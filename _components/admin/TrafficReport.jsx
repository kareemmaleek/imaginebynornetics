import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  IconChartBar,
  IconLoader2,
  IconWorld,
  IconDeviceDesktop,
  IconUsers,
  IconEye,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useAuth } from "@/common/AuthContext";
import { useRouter } from "next/router";

function TrafficReport() {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState({ uniqueVisitors: 0, totalVisits: 0 });
  const [topPages, setTopPages] = useState([]);
  const [dailyVisitors, setDailyVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.is_admin) router.push("/");
  }, [user]);

  const fetchTraffic = async () => {
    const token = localStorage.getItem("ibn_token");
    if (!token) return;
    setLoading(true);

    try {
      const res = await axios.get("/api/admin/traffic", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: 30 },
      });

      if (res.data.error === 0) {
        setLogs(res.data.data);
        setSummary(res.data.summary);
        setTopPages(res.data.topPages);
        setDailyVisitors(res.data.dailyVisitors);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      Toastify({
        text: err.response?.data?.message || "Failed to fetch traffic",
        duration: 2000,
        position: "center",
        className: "ibn-error",
      }).showToast();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraffic();
  }, [page]);

  // Simple bar chart using CSS
  const maxHits = Math.max(...dailyVisitors.map((d) => d.total_hits), 1);

  return (
    <div className="w-full h-auto p-3 md:p-10">
      <div className="mb-8">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <IconChartBar size={24} className="text-acsentColor" />
          Traffic Report
        </h1>
        <p className="text-sm italic text-thirdColor">
          monitor visitors, devices, and page views
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <IconLoader2 size={28} className="animate-spin text-acsentColor" />
          <span className="ml-3 text-sm text-thirdColor italic">
            Loading traffic data...
          </span>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-5 bg-secondaryColor rounded-xl border border-acsentColor/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-acsentColor/10 flex items-center justify-center">
                  <IconUsers size={20} className="text-acsentColor" />
                </div>
                <div>
                  <p className="text-xs text-thirdColor uppercase tracking-wider">
                    Unique Visitors
                  </p>
                  <p className="text-2xl font-bold text-acsentColor">
                    {summary.uniqueVisitors.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 bg-secondaryColor rounded-xl border border-acsentColor/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-acsentColor/10 flex items-center justify-center">
                  <IconEye size={20} className="text-acsentColor" />
                </div>
                <div>
                  <p className="text-xs text-thirdColor uppercase tracking-wider">
                    Total Page Views
                  </p>
                  <p className="text-2xl font-bold text-acsentColor">
                    {summary.totalVisits.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Chart */}
          {dailyVisitors.length > 0 && (
            <div className="mb-8 p-5 bg-secondaryColor rounded-xl border border-acsentColor/10">
              <h3 className="text-sm font-semibold text-acsentColor mb-4">
                Daily Visitors (Last 30 Days)
              </h3>
              <div className="flex items-end gap-1 h-32 overflow-x-auto">
                {dailyVisitors
                  .slice()
                  .reverse()
                  .map((d, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-1 min-w-[20px] group"
                    >
                      <span className="text-[9px] text-thirdColor opacity-0 group-hover:opacity-100 transition-opacity">
                        {d.total_hits}
                      </span>
                      <div
                        className="w-4 bg-acsentColor/50 hover:bg-acsentColor rounded-t transition-colors"
                        style={{
                          height: `${Math.max((d.total_hits / maxHits) * 100, 4)}%`,
                        }}
                      />
                      <span className="text-[8px] text-thirdColor/40 -rotate-45 origin-top-left whitespace-nowrap">
                        {moment(d.date).format("DD")}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Top Pages */}
          {topPages.length > 0 && (
            <div className="mb-8 p-5 bg-secondaryColor rounded-xl border border-acsentColor/10">
              <h3 className="text-sm font-semibold text-acsentColor mb-4">
                Top Pages
              </h3>
              <div className="flex flex-col gap-2">
                {topPages.map((tp, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 px-3 bg-mainColor/30 rounded-lg"
                  >
                    <span className="text-sm text-thirdColor font-mono truncate max-w-[70%]">
                      {tp.page_path}
                    </span>
                    <span className="text-xs font-semibold text-acsentColor">
                      {tp.visits} hits
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Traffic Logs Table */}
          <div className="w-full overflow-x-auto bg-secondaryColor rounded-xl border border-acsentColor/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-acsentColor/10 text-thirdColor text-xs uppercase tracking-wider">
                  <th className="p-4 text-left">IP Address</th>
                  <th className="p-4 text-left">Device / User Agent</th>
                  <th className="p-4 text-left">
                    <IconWorld size={12} className="inline mr-1" />
                    Location
                  </th>
                  <th className="p-4 text-left">Page</th>
                  <th className="p-4 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr
                    key={i}
                    className="border-b border-acsentColor/5 hover:bg-mainColor/30 transition-colors"
                  >
                    <td className="p-4 font-mono text-acsentColor text-xs">
                      {log.ip_address}
                    </td>
                    <td className="p-4 text-thirdColor text-xs max-w-[200px] truncate">
                      <IconDeviceDesktop
                        size={12}
                        className="inline mr-1 text-acsentColor"
                      />
                      {log.user_agent?.substring(0, 60)}...
                    </td>
                    <td className="p-4 text-thirdColor text-xs">
                      {log.country}, {log.city}
                    </td>
                    <td className="p-4 text-thirdColor text-xs font-mono">
                      {log.page_path}
                    </td>
                    <td className="p-4 text-thirdColor text-xs whitespace-nowrap">
                      {moment(log.visited_at).format("DD MMM HH:mm")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-lg bg-secondaryColor border border-acsentColor/20 text-thirdColor hover:text-acsentColor disabled:opacity-30 transition-colors"
              >
                <IconChevronLeft size={16} />
              </button>
              <span className="text-sm text-thirdColor">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-lg bg-secondaryColor border border-acsentColor/20 text-thirdColor hover:text-acsentColor disabled:opacity-30 transition-colors"
              >
                <IconChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TrafficReport;
