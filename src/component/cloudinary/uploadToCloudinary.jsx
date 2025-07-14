const uploadToCloudinary = async (imageFile) => {
  const data = new FormData();
  data.append("file", imageFile);
  data.append("upload_preset", "your_unsigned_upload_preset"); // replace with your preset
  data.append("cloud_name", "your_cloud_name"); // replace with your Cloudinary cloud name

  const res = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", {
    method: "POST",
    body: data,
  });

  const result = await res.json();
  return result.secure_url; // this is the image URL
};
