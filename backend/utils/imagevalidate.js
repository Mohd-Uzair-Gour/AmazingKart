const imageValidate = (images) => {
    let imagesTable = Array.isArray(images) ? images : [images]; // Ensure it's always an array
  
    // Check if more than 3 images are being uploaded
    if (imagesTable.length > 3) {
      return { error: "Send only 3 images at once" };
    }
  
    // Loop through the images and validate size and mime type
    for (let image of imagesTable) {
      // Check if the image size is greater than 1 MB
      if (image.size > 1048576) {
        return { error: "Size is too large (above 1 MB)" };
      }
  
      // Check the mime type to ensure it's jpg, jpeg, or png
      const filetypes = /jpg|jpeg|png/;
      const mimetype = filetypes.test(image.mimetype);
      if (!mimetype) {
        return { error: "Incorrect mime type (should be jpg, jpeg, png)" };
      }
    }
  
    return { error: false }; // No errors, validation passed
  };
  
  module.exports = imageValidate;
  