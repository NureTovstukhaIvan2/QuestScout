import GoogleMapComponent from "../../components/GoogleMapComponent/GoogleMap";

const LocationComponent = () => {
  return (
    <div
      id="location-card"
      className="py-6 px-8 mt-24 pb-16 font-roboto md:px-12 lg:px-16"
    >
      <h1 className="text-4xl mb-8 font-bold underline decoration-orange-600 lg:block">
        Location
      </h1>
      <div className="md:flex md:justify-around lg:w-3/4 lg:mx-auto ">
        <GoogleMapComponent />
        <div className="md:h-full md:my-auto lg:my-0 lg:px-12">
          <p className="pb-1 text-xl lg:text-2xl lg:pt-10">
            Located: pr. Nauky, 14
          </p>
          <p className="text-lg lg:text-xl">m. Kharkiv</p>
          <p className="text-lg lg:text-xl">Kharkivska oblast</p>
          <p className="text-lg lg:text-xl">Ukraine, 61166</p>
          <p className="pb-1 pt-12 text-lg lg:text-xl lg:pt-24">
            +380 50 123 4567
          </p>
          <p className="pb-1 text-lg lg:text-xl">questscout@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default LocationComponent;
