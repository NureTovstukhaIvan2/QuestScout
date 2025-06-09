import RulesComponent from "../../components/RulesComponent/RulesComponent";
import ScrollToTop from "../../components/ScrollToTopWrapper/ScrollToTopWrapper";

const RulesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 text-slate-100 px-6 py-12 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center relative">
          <span className="relative inline-block underline decoration-orange-600">
            Game Rules
          </span>
        </h1>
        <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-8 md:p-10 shadow-xl border border-zinc-700/50">
          <RulesComponent />
        </div>
      </div>
    </div>
  );
};

export default ScrollToTop(RulesPage);
