import React, { Suspense, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Controller/redux/store/store";
import { Map, LoadingGif, SadChefIcon } from "@/View/Photos";
import "./RestaurantsPage.scss";
import { setData, setPage } from "@/Controller/redux/slices/restaurantsPageSlice";
import { fetchRestaurantsPageData } from "@/Controller/redux/thunks/restaurantsPageThunk";
import { useDispatch } from "react-redux";
const CustomCardsSection = React.lazy(() => import("@/View/components/Shared/CustomCardsSection/CustomCardsSection"));
const RestaurantsHeader = React.lazy(() => import("@/View/components/Shared/RestaurantsHeader/RestaurantsHeader"));
interface PopupsState {
  [key: string]: boolean;
  PriceRange: boolean;
  Distance: boolean;
  Rating: boolean;
}
const RestaurantsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { Restaurants, page, limit, data } = useSelector(
    (state: RootState) => state.restaurantsPage
  );

  const [isLoading, setIsLoading] = useState(true);

  const MAX_DISTANCE = Math.max(...Restaurants.map(({ distance }: any) => distance));
  const MIN_PRICE = Math.min(...Restaurants.map(({ minPrice }: any) => minPrice));
  const MAX_PRICE = Math.max(...Restaurants.map(({ maxPrice }: any) => maxPrice));

  const [primaryButton, setPrimaryButton] = useState("All");
  const [secondaryButton, setSecondaryButton] = useState("");
  const [newDistance, setNewDistance] = useState(MAX_DISTANCE);
  const [newMin, setNewMin] = useState(Math.min(...Restaurants.map(({ minPrice }: any) => minPrice)));
  const [newMax, setNewMax] = useState(Math.max(...Restaurants.map(({ maxPrice }: any) => maxPrice)));
  const [selectedRating, setSelectedRating] = useState<number[]>([]);

  const [isPopupsOpen, setIsPopupsOpen] = useState<PopupsState>({
    PriceRange: false,
    Distance: false,
    Rating: false,
  });
  const togglePopup = (name: string) => {
    const updatedState: PopupsState = {
      PriceRange: name === "PriceRange" ? !isPopupsOpen.PriceRange : false,
      Distance: name === "Distance" ? !isPopupsOpen.Distance : false,
      Rating: name === "Rating" ? !isPopupsOpen.Rating : false,
    };
    setIsPopupsOpen(updatedState);
  };
  const closeAllPopups = () => {
    setIsPopupsOpen({
      PriceRange: false,
      Distance: false,
      Rating: false,
    });
    setSecondaryButton("");
  };
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.id != "Rating" && target.id != "Distance" && target.id != "PriceRange") {
        closeAllPopups();
      }
    };
    document.body.addEventListener("click", handleClick);
    return () => { document.body.removeEventListener("click", handleClick) };
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        dispatch(setPage(1));
        const data1: any = (await dispatch(fetchRestaurantsPageData({
          page, limit, newMax, newMin, newDistance, selectedRating, primaryButton,
          secondary: secondaryButton
        }))).payload;
        setIsLoading(false);
        dispatch(setData(data1.Restaurants));
        console.log("Restaurants: ", MAX_DISTANCE);
      } catch (error) {
        console.error("Error fetching restaurants page data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch, newMax, newMin, newDistance, selectedRating, primaryButton]);

  useEffect(() => {
    const handleScroll = async () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      if (scrollTop + clientHeight >= scrollHeight - 1) {
        dispatch(setPage(page + 1));
        closeAllPopups();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dispatch]);


  return (
    <div className="restaurants-page">
      <Suspense fallback={renderLoading()}>
        <h2 className="restaurant-header">Restaurants</h2>
        <RestaurantsHeader
          primaryButton={primaryButton}
          setPrimaryButton={setPrimaryButton}
          secondaryButton={secondaryButton}
          setSecondaryButton={setSecondaryButton}
          maxDistance={MAX_DISTANCE}
          newDistance={newDistance}
          setNewDistance={setNewDistance}
          newMax={newMax}
          newMin={newMin}
          setNewMin={setNewMin}
          setNewMax={setNewMax}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          max={MAX_PRICE}
          min={MIN_PRICE}
          isPopupsOpen={isPopupsOpen}
          togglePopup={togglePopup}
        />
        <div className="container-content">{renderContent()}</div>
      </Suspense>
    </div>
  );

  function renderLoading() {
    return (
      <div className="loading-spinner">
        <img className="loading" src={LoadingGif} alt="Loading..." />
      </div>
    );
  }

  function renderNoMoreData() {
    return (
      <div className="no-more-data">
        <div className="empty-data-message">
          <p>No more restaurants.</p>
        </div>
      </div>
    );
  }

  function renderContent() {
    return (
      <>
        {primaryButton === "MapView" ? (
          <div className="map-image-container">
            <img className="map-img" src={Map} alt="Map" />
          </div>
        ) : (
          <div className="cards">
            {isLoading ? (
              renderLoading()
            ) : (
              <CustomCardsSection cardsData={data} cardType={1} pageType={2} layoutDirection="vertical" />
            )}
          </div>
        )}
      </>
    );
  }
};

export default RestaurantsPage;
