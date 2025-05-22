import { Carousel } from 'flowbite-react';

const CarouselComponent = ({ images }) => {
  return (
    <div className="h-72 xl:h-96">
      <Carousel slideInterval={5000}>
        {images.map((image, index) => (
          <img
            key={image}
            className="object-cover w-full h-full"
            src={image}
            alt={`file ${index + 1}`}
          />
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
