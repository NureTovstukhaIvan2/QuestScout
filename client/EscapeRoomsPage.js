import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_AllESCAPEROOMS } from "../../utils/queries";
import ScrollToTop from "../../components/ScrollToTopWrapper/ScrollToTopWrapper";
import EscapeRoomCard from "../../components/EscapeRoomCardComponent/EscapeRoomCard";

const EscapeRoomsPage = () => {
  const [escapeRooms, setEscapeRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortOption, setSortOption] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  // Filter states
  const [genreFilter, setGenreFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [ageGroupFilter, setAgeGroupFilter] = useState("");
  const [playersFilter, setPlayersFilter] = useState("");
  const [minPriceFilter, setMinPriceFilter] = useState("");
  const [maxPriceFilter, setMaxPriceFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState("");

  const { loading, data: allEscapeRoomsData } = useQuery(QUERY_AllESCAPEROOMS);

  // Get all unique values for filters
  const genres = [...new Set(escapeRooms.map((room) => room.genre))];
  const difficulties = ["Expert", "Advanced", "Intermediate", "Beginner"];
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
  ]);

  const applyFilters = () => {
    let result = [...escapeRooms];

    // Apply filters
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

    // Apply sorting
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
          return sortDirection === "asc" ? indexA - indexB : indexB - indexA;
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
    if (!sortOption) return "Sort ↑↓";

    const labels = {
      rating: "Rating",
      difficulty: "Difficulty",
      age: "Age",
      players: "Players",
      duration: "Duration",
      price: "Price",
    };

    return `${labels[sortOption]} ${sortDirection === "asc" ? "↑" : "↓"}`;
  };

  if (loading) return <p className="text-slate-100 text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 py-10 px-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="underline decoration-orange-600 text-3xl font-bold">
          Escape Rooms
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          >
            Filter
          </button>
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              {getSortLabel()}
            </button>

            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-800 rounded-md shadow-lg z-50">
                <div className="py-1">
                  <button
                    onClick={() => handleSortOptionClick("none")}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      !sortOption
                        ? "bg-orange-600 text-white"
                        : "text-slate-100 hover:bg-zinc-700"
                    }`}
                  >
                    No sorting
                  </button>
                  <button
                    onClick={() => handleSortOptionClick("rating")}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      sortOption === "rating"
                        ? "bg-orange-600 text-white"
                        : "text-slate-100 hover:bg-zinc-700"
                    }`}
                  >
                    Rating{" "}
                    {sortOption === "rating" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    onClick={() => handleSortOptionClick("difficulty")}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      sortOption === "difficulty"
                        ? "bg-orange-600 text-white"
                        : "text-slate-100 hover:bg-zinc-700"
                    }`}
                  >
                    Difficulty{" "}
                    {sortOption === "difficulty" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    onClick={() => handleSortOptionClick("age")}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      sortOption === "age"
                        ? "bg-orange-600 text-white"
                        : "text-slate-100 hover:bg-zinc-700"
                    }`}
                  >
                    Age{" "}
                    {sortOption === "age" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    onClick={() => handleSortOptionClick("players")}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      sortOption === "players"
                        ? "bg-orange-600 text-white"
                        : "text-slate-100 hover:bg-zinc-700"
                    }`}
                  >
                    Players{" "}
                    {sortOption === "players" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    onClick={() => handleSortOptionClick("duration")}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      sortOption === "duration"
                        ? "bg-orange-600 text-white"
                        : "text-slate-100 hover:bg-zinc-700"
                    }`}
                  >
                    Duration{" "}
                    {sortOption === "duration" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    onClick={() => handleSortOptionClick("price")}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      sortOption === "price"
                        ? "bg-orange-600 text-white"
                        : "text-slate-100 hover:bg-zinc-700"
                    }`}
                  >
                    Price{" "}
                    {sortOption === "price" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-zinc-900 p-6 rounded-lg mb-8 shadow-lg">
          <h2 className="text-xl font-bold mb-4 underline decoration-orange-600">
            Filter Rooms
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Genre Filter */}
            <div>
              <label className="block text-slate-100 font-bold mb-2">
                Genre:
              </label>
              <select
                className="w-full bg-zinc-950 text-slate-100 border border-orange-500 rounded py-2 px-3"
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
              <label className="block text-slate-100 font-bold mb-2">
                Difficulty:
              </label>
              <select
                className="w-full bg-zinc-950 text-slate-100 border border-orange-500 rounded py-2 px-3"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
              >
                <option value="">All Difficulties</option>
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>

            {/* Age Group Filter */}
            <div>
              <label className="block text-slate-100 font-bold mb-2">
                Age Group:
              </label>
              <select
                className="w-full bg-zinc-950 text-slate-100 border border-orange-500 rounded py-2 px-3"
                value={ageGroupFilter}
                onChange={(e) => setAgeGroupFilter(e.target.value)}
              >
                <option value="">All Age Groups</option>
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
              <label className="block text-slate-100 font-bold mb-2">
                Number of Players:
              </label>
              <input
                type="number"
                className="w-full bg-zinc-950 text-slate-100 border border-orange-500 rounded py-2 px-3"
                placeholder="Enter number of players"
                value={playersFilter}
                onChange={(e) => setPlayersFilter(e.target.value)}
                min="1"
              />
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-slate-100 font-bold mb-2">
                Price Range (UAH):
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  className="w-1/2 bg-zinc-950 text-slate-100 border border-orange-500 rounded py-2 px-3"
                  placeholder="Min price"
                  value={minPriceFilter}
                  onChange={(e) => setMinPriceFilter(e.target.value)}
                  min="0"
                />
                <input
                  type="number"
                  className="w-1/2 bg-zinc-950 text-slate-100 border border-orange-500 rounded py-2 px-3"
                  placeholder="Max price"
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            {/* Duration Filter */}
            <div>
              <label className="block text-slate-100 font-bold mb-2">
                Duration (minutes):
              </label>
              <select
                className="w-full bg-zinc-950 text-slate-100 border border-orange-500 rounded py-2 px-3"
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
              >
                <option value="">All Durations</option>
                {durations.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration} min
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={resetFilters}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-14 lg:grid-cols-3 lg:px-3">
        {filteredRooms.map((room) => {
          return (
            <div id={room.theme} key={room.id} className="flex flex-col">
              <EscapeRoomCard room={room} />
              <div className="border-2 border-orange-600 w-4/5 mx-auto"></div>
            </div>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center text-slate-100 text-xl mt-10">
          No rooms match your filters. Try adjusting your search criteria.
        </div>
      )}
    </div>
  );
};

export default ScrollToTop(EscapeRoomsPage);
