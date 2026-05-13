import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getPublicResume } from "../services/api";
import { EphemeralResumeProvider } from "../context/EphemeralResumeProvider";
import LayoutK from "../components/Portfolio/Layouts/LayoutK/LayoutK";
import LayoutT from "../components/Portfolio/Layouts/LayoutT/LayoutT";
import LayoutS from "../components/Portfolio/Layouts/LayoutS/LayoutS";

const PublicPortfolioPage = () => {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const layout = searchParams.get("layout") || "k";

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const id = parseInt(userId, 10);
    if (!Number.isFinite(id)) {
      setError("Invalid link.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        setError("");
        const resume = await getPublicResume(id);
        if (!cancelled) setData(resume);
      } catch (e) {
        if (!cancelled) {
          setError(
            e?.response?.data?.error ||
              e?.response?.data?.message ||
              "This portfolio is not available."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
          <Link to="/" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300">
            ← EduVault
          </Link>
          <p className="text-xs text-slate-400">Public portfolio view</p>
        </div>
      </header>

      {loading && (
        <div className="flex justify-center py-20 text-slate-300">Loading portfolio…</div>
      )}
      {!loading && error && (
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <p className="text-lg text-slate-200">{error}</p>
          <Link to="/" className="mt-4 inline-block text-indigo-400 hover:underline">
            Go home
          </Link>
        </div>
      )}
      {!loading && !error && data && (
        <EphemeralResumeProvider data={data}>
          <div className="mx-auto max-w-6xl">
            {layout === "t" ? <LayoutT /> : layout === "s" ? <LayoutS /> : <LayoutK />}
          </div>
        </EphemeralResumeProvider>
      )}
    </div>
  );
};

export default PublicPortfolioPage;
