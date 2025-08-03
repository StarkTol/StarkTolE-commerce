// lib/cloudinary.ts

// Placeholder configuration for development
const mockCloudinary = {
  config: () => {},
  uploader: {
    upload: async (file) => ({
      secure_url: `https://via.placeholder.com/400x400?text=Mock+Image`
    }),
  },
};

export default mockCloudinary;
