import { Carousel } from 'flowbite-react';
import { useState } from 'react';

const CarouselComponent = ({ images }) => {
  const [imageErrors, setImageErrors] = useState({});

  // Validar que images existe y es un array con elementos
  const validImages = Array.isArray(images) && images.length > 0 
    ? images 
    : ['/placeholder-laptop.svg'];

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className="h-72 xl:h-[600px]">
      <Carousel slideInterval={5000}>
        {validImages.map((image, index) => (
          <img
            key={`${image}-${index}`}
            className="object-cover w-full h-full"
            src={imageErrors[index] ? '/placeholder-laptop.svg' : image}
            alt={`Imagen ${index + 1}`}
            onError={() => handleImageError(index)}
          />
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
