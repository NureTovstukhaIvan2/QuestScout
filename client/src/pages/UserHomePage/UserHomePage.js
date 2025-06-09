import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_AllESCAPEROOMS, ME_QUERY } from "../../utils/queries";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RulesComponent from "../../components/RulesComponent/RulesComponent";
import LocationComponent from "../../components/LocationComponent/LocationComponent";
import RoomsSlider from "../../components/RoomsSliderComponent/RoomsSlider";
import ScrollToTop from "../../components/ScrollToTopWrapper/ScrollToTopWrapper";

const UserHomePage = () => {
  const [escapeRooms, setEscapeRooms] = useState([]);
  const [user, setUser] = useState({});

  const { loading, data: allEscapeRoomsData } = useQuery(QUERY_AllESCAPEROOMS);
  const { data: userData } = useQuery(ME_QUERY);

  useEffect(() => {
    const rooms = allEscapeRoomsData?.getAllEscapeRooms || [];
    setEscapeRooms(rooms);
  }, [allEscapeRoomsData]);

  useEffect(() => {
    const u = userData?.me || {};
    setUser(u);
  }, [userData]);

  if (loading)
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse text-orange-500 text-xl">
          Loading adventures...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 text-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
              Welcome to QuestScout, {user.firstName}!
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Experience the thrill of our immersive quest rooms!
            </p>
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-800 rounded-full shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold">
                Choose Your Adventure Below!
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Quest Rooms Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
            <span className="relative inline-block underline decoration-orange-600">
              Quest Rooms
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Discover our collection of immersive quest room experiences
          </p>
        </div>

        <div className="mb-24">
          <RoomsSlider escapeRooms={escapeRooms} />
        </div>
      </div>

      {/* Rules Section */}
      <div className="bg-zinc-800/50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl p-8 md:p-12 shadow-xl border border-zinc-700/30">
            <h3 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              <span className="relative inline-block underline decoration-orange-600">
                Things to Know
              </span>
            </h3>
            <RulesComponent />
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="py-16">
        <LocationComponent />
      </div>
    </div>
  );
};

export default ScrollToTop(UserHomePage);
