import { useEffect, useState } from "react";
import Auth from "../../utils/auth";
import ScrollToTop from "../../components/ScrollToTopWrapper/ScrollToTopWrapper";
import LocationComponent from "../../components/LocationComponent/LocationComponent";
import RulesComponent from "../../components/RulesComponent/RulesComponent";
import ChooseYourAdventureComponent from "../../components/ChooseYourAdventureComponent/ChooseYourAdventureComponent";

const WelcomePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Auth.loggedIn()) {
      if (Auth.isAdmin()) {
        window.location.assign("/admin");
      } else {
        window.location.assign("/home");
      }
    }

    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <div
      id="welcome-page"
      className="min-h-screen bg-zinc-950 text-slate-100 flex flex-col gap-20 pb-16"
    >
      <ChooseYourAdventureComponent />

      <section className="px-6 lg:px-16 xl:px-24">
        <h3 className="text-4xl font-bold underline decoration-orange-500 mb-10">
          Things to Know:
        </h3>
        <div className="bg-zinc-900/60 rounded-2xl p-6 lg:p-10 shadow-lg border border-zinc-800">
          <RulesComponent />
        </div>
      </section>

      <section className="px-6 lg:px-16 xl:px-24">
        <LocationComponent />
      </section>
    </div>
  );
};

export default ScrollToTop(WelcomePage);
