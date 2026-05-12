import { useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Card from "../components/ui/Card";
import LayoutK from "../components/Portfolio/Layouts/LayoutK/LayoutK";
import LayoutT from "../components/Portfolio/Layouts/LayoutT/LayoutT";
import { AuthContext } from "../context/AuthContext";
import { getPortfolioShareUrl } from "../utils/portfolioShare";

const tabBtn = (active) =>
  `rounded-xl px-4 py-2 text-sm font-medium transition ${
    active
      ? "bg-indigo-600 text-white"
      : "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
  }`;

const PortfolioPage = () => {
  const [layout, setLayout] = useState("k");
  const { user } = useContext(AuthContext);

  const shareUrl = useMemo(
    () => (user?.id ? getPortfolioShareUrl(user.id, layout) : ""),
    [user?.id, layout]
  );

  const copyShare = async () => {
    if (!shareUrl) {
      toast.error("Sign in to get a share link.");
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <Card
      title="Portfolio preview"
      subtitle="Uses the same resume data as the rest of your dashboard. Anyone with the link can view this read-only portfolio."
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <button type="button" className={tabBtn(layout === "k")} onClick={() => setLayout("k")}>
            Layout K
          </button>
          <button type="button" className={tabBtn(layout === "t")} onClick={() => setLayout("t")}>
            Layout T
          </button>
        </div>
        <Link
          to={layout === "k" ? "/portfolio/layout-k" : "/portfolio/layout-t"}
          className="text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Open full screen
        </Link>
        <button
          type="button"
          onClick={copyShare}
          className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-100 dark:border-indigo-500/40 dark:bg-indigo-950/50 dark:text-indigo-200"
        >
          Copy share link
        </button>
      </div>
      {shareUrl && (
        <p className="mb-4 break-all rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
          {shareUrl}
        </p>
      )}
      <div className="rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-900/50">
        <div className="max-h-[min(72vh,920px)] overflow-auto">
          <div
            className="mx-auto pb-8 pt-2"
            style={{
              transform: "scale(0.72)",
              transformOrigin: "top center",
              width: "calc(100% / 0.72)",
            }}
          >
            {layout === "k" ? <LayoutK /> : <LayoutT />}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PortfolioPage;
