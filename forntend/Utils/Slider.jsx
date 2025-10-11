import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


function Silder({photos}) {

  
     const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <>
    <div className="w-full max-w-md mx-auto mt-[20px]">
      <Slider {...settings}>
        {photos?.map((photo, index) => (
          <div key={index}>
            <img
              src={photo.url}
              alt={`Slide ${index}`}
              className="w-full h-64 object-cover rounded"
            />
          </div>
        ))}
      </Slider>
    </div>
    </>
  )
}
  


export default Silder
