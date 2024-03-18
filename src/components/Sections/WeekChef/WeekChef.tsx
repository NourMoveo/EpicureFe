import './WeekChef.scss'
import { ChefWeekProps } from "@/models/Types";
// import { CustomCardsSection } from "@/components";
// import { WeekChefRestauData } from "@/data";

/**
 * This component renders the details of the Chef of the week along with their image and description,
 * followed by a section displaying the chef's restaurants.
 */

const WeekChef: React.FC<ChefWeekProps> = ({ chefDetails }) => {
  const backgroundImageStyle = {
    backgroundImage: `url(${chefDetails.image})`,
    WebkitFilter: 'grayscale(100%)', 
    filter: 'grayscale(100%)', 
  };
  return (
    <>
      <div className='chef-container'>
        <h2 className='WeekChef-main-title'>Chef of the week:</h2>
        <div className='image-container'>
          <div className='chef-image-container' style={backgroundImageStyle}>
            <div className='chef-img-name'>
              <h3 className='chef-name'>{chefDetails.fName} {chefDetails.lName}</h3>
            </div>
          </div>
          <p className='chef-description'>{chefDetails.description}</p>
        </div>
        <h2 className='WeekChef-text'>{chefDetails.fName}’s Restaurants</h2>
      </div>
 </>
  );
};

export default WeekChef;