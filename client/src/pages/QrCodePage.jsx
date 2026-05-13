import { useContext, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";
import Card from "../components/ui/Card";
import { AuthContext } from "../context/AuthContext";
import { getPortfolioShareUrl } from "../utils/portfolioShare";

const QrCodePage = () => {
  const { user } = useContext(AuthContext);
  const [layout, setLayout] = useState("k");

  const shareUrl = useMemo(
    () => (user?.id ? getPortfolioShareUrl(user.id, layout) : ""),
    [user?.id, layout]
  );

  const copyLink = async () => {
    if (!shareUrl) {
      toast.error("Sign in to generate a link.");
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <Card
      title="Share portfolio"
      subtitle="QR code opens your public portfolio page. Scan or share the link—no login required for viewers."
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setLayout("k")}
          className={`rounded-xl px-3 py-1.5 text-sm font-medium ${
            layout === "k" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
          }`}
        >
          Layout K
        </button>
        <button
          type="button"
          onClick={() => setLayout("t")}
          className={`rounded-xl px-3 py-1.5 text-sm font-medium ${
            layout === "t" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
          }`}
        >
          Layout T
        </button>
        <button
          type="button"
          onClick={() => setLayout("s")}
          className={`rounded-xl px-3 py-1.5 text-sm font-medium ${
            layout === "s" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
          }`}
        >
          Layout S
        </button>
      </div>

      <div className="flex flex-col items-center gap-5">
        {shareUrl ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-white">
            <QRCodeSVG value={shareUrl} level="M" style={{ width: 200, height: 200 }} />
          </div>
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-300">Log in as a student to generate your QR code.</p>
        )}
        {shareUrl && (
          <p className="max-w-md break-all text-center text-xs text-slate-600 dark:text-slate-300">{shareUrl}</p>
        )}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={copyLink}
            disabled={!shareUrl}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            Copy share link
          </button>
        </div>
      </div>
    </Card>
  );
};

export default QrCodePage;
