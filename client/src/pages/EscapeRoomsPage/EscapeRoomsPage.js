import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_AllESCAPEROOMS } from "../../utils/queries";
import ScrollToTop from "../../components/ScrollToTopWrapper/ScrollToTopWrapper";
import EscapeRoomCard from "../../components/EscapeRoomCardComponent/EscapeRoomCard";
import {
  FaFilter,
  FaSort,
  FaSearch,
  FaTimes,
  FaStar,
  FaSkull,
  FaChessKnight,
  FaChessPawn,
  FaUsers,
  FaMoneyBillWave,
  FaClock,
  FaChild,
  FaGamepad,
} from "react-icons/fa";
import { GiSwordman } from "react-icons/gi";

const EscapeRoomsPage = () => {
  const [escapeRooms, setEscapeRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortOption, setSortOption] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const [genreFilter, setGenreFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [ageGroupFilter, setAgeGroupFilter] = useState("");
  const [playersFilter, setPlayersFilter] = useState("");
  const [minPriceFilter, setMinPriceFilter] = useState("");
  const [maxPriceFilter, setMaxPriceFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState("");

  const { loading, data: allEscapeRoomsData } = useQuery(QUERY_AllESCAPEROOMS);

  const genres = [...new Set(escapeRooms.map((room) => room.genre))];
  const difficulties = [
    { value: "Expert", icon: <FaSkull className="mr-2" /> },
    { value: "Advanced", icon: <GiSwordman className="mr-2" /> },
    { value: "Intermediate", icon: <FaChessKnight className="mr-2" /> },
    { value: "Beginner", icon: <FaChessPawn className="mr-2" /> },
  ];
  const ageGroups = [...new Set(escapeRooms.map((room) => room.ageGroup))];
  const durations = [...new Set(escapeRooms.map((room) => room.duration))];

  useEffect(() => {
    const rooms = allEscapeRoomsData?.getAllEscapeRooms || [];
    setEscapeRooms(rooms);
    setFilteredRooms(rooms);
  }, [allEscapeRoomsData]);

  useEffect(() => {
    if (escapeRooms.length > 0) {
      applyFilters();
    }
  }, [
    genreFilter,
    difficultyFilter,
    ageGroupFilter,
    playersFilter,
    minPriceFilter,
    maxPriceFilter,
    durationFilter,
    escapeRooms,
    sortOption,
    sortDirection,
    searchQuery,
  ]);

  const applyFilters = () => {
    let result = [...escapeRooms];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (room) =>
          room.theme.toLowerCase().includes(query) ||
          room.description.toLowerCase().includes(query) ||
          room.genre.toLowerCase().includes(query)
      );
    }

    if (genreFilter) {
      result = result.filter((room) => room.genre === genreFilter);
    }

    if (difficultyFilter) {
      result = result.filter((room) => room.difficulty === difficultyFilter);
    }

    if (ageGroupFilter) {
      const selectedAge = parseInt(ageGroupFilter);
      result = result.filter((room) => {
        const roomAge = parseInt(room.ageGroup);
        return !isNaN(roomAge) && roomAge <= selectedAge;
      });
    }

    if (playersFilter) {
      const players = parseInt(playersFilter, 10);
      result = result.filter(
        (room) => players >= room.playersMin && players <= room.playersMax
      );
    }

    if (minPriceFilter) {
      const minPrice = parseInt(minPriceFilter, 10);
      result = result.filter((room) => room.price >= minPrice);
    }

    if (maxPriceFilter) {
      const maxPrice = parseInt(maxPriceFilter, 10);
      result = result.filter((room) => room.price <= maxPrice);
    }

    if (durationFilter) {
      const duration = parseInt(durationFilter, 10);
      result = result.filter((room) => room.duration === duration);
    }

    if (sortOption) {
      result = sortRooms(result);
    }

    setFilteredRooms(result);
  };

  const sortRooms = (rooms) => {
    const sortedRooms = [...rooms];

    switch (sortOption) {
      case "rating":
        sortedRooms.sort((a, b) => {
          const ratingA = a.averageRating || 0;
          const ratingB = b.averageRating || 0;
          return sortDirection === "asc"
            ? ratingA - ratingB
            : ratingB - ratingA;
        });
        break;
      case "difficulty":
        sortedRooms.sort((a, b) => {
          const difficultiesOrder = [
            "Expert",
            "Advanced",
            "Intermediate",
            "Beginner",
          ];
          const indexA = difficultiesOrder.indexOf(a.difficulty);
          const indexB = difficultiesOrder.indexOf(b.difficulty);
          return sortDirection === "asc" ? indexB - indexA : indexA - indexB;
        });
        break;
      case "age":
        sortedRooms.sort((a, b) => {
          const ageA = parseInt(a.ageGroup);
          const ageB = parseInt(b.ageGroup);
          return sortDirection === "asc" ? ageA - ageB : ageB - ageA;
        });
        break;
      case "players":
        sortedRooms.sort((a, b) => {
          const playersA = a.playersMax;
          const playersB = b.playersMax;
          return sortDirection === "asc"
            ? playersA - playersB
            : playersB - playersA;
        });
        break;
      case "duration":
        sortedRooms.sort((a, b) => {
          return sortDirection === "asc"
            ? a.duration - b.duration
            : b.duration - a.duration;
        });
        break;
      case "price":
        sortedRooms.sort((a, b) => {
          return sortDirection === "asc"
            ? a.price - b.price
            : b.price - a.price;
        });
        break;
      default:
        break;
    }

    return sortedRooms;
  };

  const resetFilters = () => {
    setGenreFilter("");
    setDifficultyFilter("");
    setAgeGroupFilter("");
    setPlayersFilter("");
    setMinPriceFilter("");
    setMaxPriceFilter("");
    setDurationFilter("");
    setSearchQuery("");
    setFilteredRooms(escapeRooms);
  };

  const handleSortOptionClick = (option) => {
    if (option === "none") {
      setSortOption(null);
      setSortDirection("asc");
    } else if (sortOption === option) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortOption(option);
      setSortDirection("asc");
    }
    setShowSortDropdown(false);
  };

  const getSortLabel = () => {
    if (!sortOption)
      return (
        <div className="flex items-center">
          <FaSort className="mr-2" /> Sort
        </div>
      );

    const labels = {
      rating: (
        <>
          <FaStar className="mr-2" /> Rating
        </>
      ),
      difficulty: (
        <>
          <FaGamepad className="mr-2" /> Difficulty
        </>
      ),
      age: (
        <>
          <FaChild className="mr-2" /> Age
        </>
      ),
      players: (
        <>
          <FaUsers className="mr-2" /> Players
        </>
      ),
      duration: (
        <>
          <FaClock className="mr-2" /> Duration
        </>
      ),
      price: (
        <>
          <FaMoneyBillWave className="mr-2" /> Price
        </>
      ),
    };

    return (
      <div className="flex items-center">
        {labels[sortOption]} {sortDirection === "asc" ? "↑" : "↓"}
      </div>
    );
  };

  if (loading)
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold relative inline-block underline decoration-orange-600">
            Quest Rooms
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search rooms..."
                className="pl-10 pr-4 py-2 w-full bg-zinc-900 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FaTimes className="text-gray-400 hover:text-white" />
                </button>
              )}
            </div>

            {/* Filter and Sort Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-zinc-800 hover:bg-zinc-700"
                }`}
              >
                <FaFilter /> Filter
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  {getSortLabel()}
                </button>

                {showSortDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-zinc-800 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="py-1">
                      <button
                        onClick={() => handleSortOptionClick("none")}
                        className={`flex items-center w-full px-4 py-2 text-left ${
                          !sortOption
                            ? "bg-orange-600 text-white"
                            : "text-slate-100 hover:bg-zinc-700"
                        }`}
                      >
                        <FaTimes className="mr-2" /> No sorting
                      </button>
                      <button
                        onClick={() => handleSortOptionClick("rating")}
                        className={`flex items-center w-full px-4 py-2 text-left ${
                          sortOption === "rating"
                            ? "bg-orange-600 text-white"
                            : "text-slate-100 hover:bg-zinc-700"
                        }`}
                      >
                        <FaStar className="mr-2" /> Rating{" "}
                        {sortOption === "rating" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </button>
                      <button
                        onClick={() => handleSortOptionClick("difficulty")}
                        className={`flex items-center w-full px-4 py-2 text-left ${
                          sortOption === "difficulty"
                            ? "bg-orange-600 text-white"
                            : "text-slate-100 hover:bg-zinc-700"
                        }`}
                      >
                        <FaGamepad className="mr-2" /> Difficulty{" "}
                        {sortOption === "difficulty" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </button>
                      <button
                        onClick={() => handleSortOptionClick("age")}
                        className={`flex items-center w-full px-4 py-2 text-left ${
                          sortOption === "age"
                            ? "bg-orange-600 text-white"
                            : "text-slate-100 hover:bg-zinc-700"
                        }`}
                      >
                        <FaChild className="mr-2" /> Age{" "}
                        {sortOption === "age" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </button>
                      <button
                        onClick={() => handleSortOptionClick("players")}
                        className={`flex items-center w-full px-4 py-2 text-left ${
                          sortOption === "players"
                            ? "bg-orange-600 text-white"
                            : "text-slate-100 hover:bg-zinc-700"
                        }`}
                      >
                        <FaUsers className="mr-2" /> Players{" "}
                        {sortOption === "players" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </button>
                      <button
                        onClick={() => handleSortOptionClick("duration")}
                        className={`flex items-center w-full px-4 py-2 text-left ${
                          sortOption === "duration"
                            ? "bg-orange-600 text-white"
                            : "text-slate-100 hover:bg-zinc-700"
                        }`}
                      >
                        <FaClock className="mr-2" /> Duration{" "}
                        {sortOption === "duration" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </button>
                      <button
                        onClick={() => handleSortOptionClick("price")}
                        className={`flex items-center w-full px-4 py-2 text-left ${
                          sortOption === "price"
                            ? "bg-orange-600 text-white"
                            : "text-slate-100 hover:bg-zinc-700"
                        }`}
                      >
                        <FaMoneyBillWave className="mr-2" /> Price{" "}
                        {sortOption === "price" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-zinc-900 p-6 rounded-xl mb-8 shadow-lg border border-zinc-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaFilter className="text-orange-500" /> Filters
              </h2>
              <button
                onClick={resetFilters}
                className="text-sm text-orange-500 hover:text-orange-400 flex items-center gap-1"
              >
                <FaTimes /> Reset all
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Genre Filter */}
              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  Genre
                </label>
                <select
                  className="w-full bg-zinc-800 text-slate-100 border border-zinc-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={genreFilter}
                  onChange={(e) => setGenreFilter(e.target.value)}
                >
                  <option value="">All Genres</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  Difficulty
                </label>
                <select
                  className="w-full bg-zinc-800 text-slate-100 border border-zinc-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                  <option value="">All Difficulties</option>
                  {difficulties.map(({ value, icon }) => (
                    <option key={value} value={value}>
                      {icon} {value}
                    </option>
                  ))}
                </select>
              </div>

              {/* Age Group Filter */}
              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  Age Group
                </label>
                <select
                  className="w-full bg-zinc-800 text-slate-100 border border-zinc-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={ageGroupFilter}
                  onChange={(e) => setAgeGroupFilter(e.target.value)}
                >
                  <option value="">All Ages</option>
                  {ageGroups
                    .map((age) => parseInt(age))
                    .filter((age) => !isNaN(age))
                    .sort((a, b) => a - b)
                    .map((age) => (
                      <option key={age} value={age}>
                        {age}+
                      </option>
                    ))}
                </select>
              </div>

              {/* Players Filter */}
              <div>
                <label className="block text-slate-300 font-medium mb-2 flex items-center gap-1">
                  <FaUsers /> Players
                </label>
                <input
                  type="number"
                  className="w-full bg-zinc-800 text-slate-100 border border-zinc-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Number of players"
                  value={playersFilter}
                  onChange={(e) => setPlayersFilter(e.target.value)}
                  min="1"
                />
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-slate-300 font-medium mb-2 flex items-center gap-1">
                  <FaMoneyBillWave /> Price Range (UAH)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="w-1/2 bg-zinc-800 text-slate-100 border border-zinc-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Min"
                    value={minPriceFilter}
                    onChange={(e) => setMinPriceFilter(e.target.value)}
                    min="0"
                  />
                  <input
                    type="number"
                    className="w-1/2 bg-zinc-800 text-slate-100 border border-zinc-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Max"
                    value={maxPriceFilter}
                    onChange={(e) => setMaxPriceFilter(e.target.value)}
                    min="0"
                  />
                </div>
              </div>

              {/* Duration Filter */}
              <div>
                <label className="block text-slate-300 font-medium mb-2 flex items-center gap-1">
                  <FaClock /> Duration (min)
                </label>
                <select
                  className="w-full bg-zinc-800 text-slate-100 border border-zinc-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={durationFilter}
                  onChange={(e) => setDurationFilter(e.target.value)}
                >
                  <option value="">Any Duration</option>
                  {durations.map((duration) => (
                    <option key={duration} value={duration}>
                      {duration} minutes
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Rooms Grid */}
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <div key={room.id} className="flex flex-col">
                <EscapeRoomCard room={room} />
                <div className="border-2 border-orange-600 w-4/5 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-zinc-900 rounded-xl shadow-lg border border-zinc-700">
            <div className="text-6xl mb-4 text-orange-500">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No rooms found</h3>
            <p className="text-slate-400 mb-6">
              Try adjusting your filters or search query
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-medium transition-colors"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrollToTop(EscapeRoomsPage);
