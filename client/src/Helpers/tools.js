import imageCompression from 'browser-image-compression';
import axios from 'axios';

export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.8, // máximo 300KB
    maxWidthOrHeight: 1024, // redimensiona si es más grande
    useWebWorker: true,
  };
  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error('Error al comprimir imagen:', error);
    return file; // si falla, sigue con el original
  }
};

export const uploadMultipleImages = async (filesArray) => {
  const uploadedUrls = [];

  for (const file of filesArray) {
    try {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.append('file', compressed);
      formData.append('upload_preset', 'tecnologia_col');

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dikkcrred/image/upload',
        formData,
      );
      uploadedUrls.push(response.data.secure_url);
    } catch (error) {
      console.error(`Error al subir ${file.name}:`, error);
      uploadedUrls.push(null); // O maneja según tu lógica
    }
  }

  return uploadedUrls;
};
