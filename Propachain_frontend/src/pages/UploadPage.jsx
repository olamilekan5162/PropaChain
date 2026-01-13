import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  X,
  Plus,
  MapPin,
  DollarSign,
  FileText,
  Video,
  File,
} from "lucide-react";
import { categories } from "../data/mockData";

export default function UploadPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    type: "sale",
    location: "",
    bedrooms: "",
    bathrooms: "",
    toilets: "",
    area: "",
    features: [],
    // Rental specific
    rentalPeriod: "",
    // Land specific
    landSize: "",
    zoning: "",
    topography: "",
    // Commercial specific
    floorArea: "",
    parkingSpaces: "",
    floors: "",
    // Additional
    furnished: "",
    parkingAvailable: "",
    yearBuilt: "",
  });

  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [videos, setVideos] = useState([]);
  const [newFeature, setNewFeature] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map((file) => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      url: URL.createObjectURL(file),
    }));
    setDocuments([...documents, ...newDocs]);
  };

  const removeDocument = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newVids = files.map((file) => ({
      name: file.name,
      thumbnail: URL.createObjectURL(file),
      duration: "0:00",
    }));
    setVideos([...videos, ...newVids]);
  };

  const removeVideo = (index) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    console.log("Images:", images);
    // Navigate to my properties page after successful upload
    navigate("/app/my-properties");
  };

  const selectedCategory = categories.find((c) => c.name === formData.category);

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-8">
      <div className="bg-white border-b border-gray-200 px-3 md:px-4 py-3 md:py-4 mb-4 md:mb-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            List Your Property
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Fill in the details below to list your property
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-3 md:px-4">
        {/* Images Upload */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
            Property Images
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-3 md:mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-teal-700 text-white rounded-full p-1 hover:bg-teal-800 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-teal-700 hover:bg-teal-50 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Add Photo</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-gray-600">
            Upload at least 3 photos. First photo will be the cover image.
          </p>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
            Basic Information
          </h2>

          <div className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Property Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., 3 Bedroom Flat in Lekki"
                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe your property..."
                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory *
                  </label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select Subcategory</option>
                    {selectedCategory.subcategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Listing Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent (Long-term)</option>
                  <option value="short-let">Short Let (Daily/Weekly)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₦) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="5000000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Rental Period for rent and short-let */}
            {(formData.type === "rent" || formData.type === "short-let") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rental Period *
                </label>
                <select
                  name="rentalPeriod"
                  value={formData.rentalPeriod}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select Rental Period</option>
                  {formData.type === "short-let" ? (
                    <>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </>
                  ) : (
                    <>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly (3 months)</option>
                      <option value="biannually">Bi-Annually (6 months)</option>
                      <option value="annually">Annually (1 year)</option>
                      <option value="biennial">Bi-Annual (2 years)</option>
                    </>
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.type === "short-let"
                    ? "Short-let: Vacation rentals, Airbnb-style accommodations"
                    : "Specify how often rent is paid"}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Lekki Phase 1, Lagos"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Property Details - Dynamic based on category - Only show if category has specific fields */}
        {(formData.category === "Houses" ||
          formData.category === "Apartments" ||
          formData.category === "Short Let" ||
          formData.category === "Land" ||
          formData.category === "Commercial Property") && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Property Details
            </h2>

            {/* Residential Properties (Houses, Apartments, Short Let) */}
            {(formData.category === "Houses" ||
              formData.category === "Apartments" ||
              formData.category === "Short Let") && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms *
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      placeholder="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bathrooms *
                    </label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      placeholder="2"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Toilets
                    </label>
                    <input
                      type="number"
                      name="toilets"
                      value={formData.toilets}
                      onChange={handleChange}
                      placeholder="2"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Area (m²) *
                    </label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      placeholder="120"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Furnished
                    </label>
                    <select
                      name="furnished"
                      value={formData.furnished}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Select</option>
                      <option value="furnished">Furnished</option>
                      <option value="semi-furnished">Semi-Furnished</option>
                      <option value="unfurnished">Unfurnished</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parking Spaces
                    </label>
                    <input
                      type="number"
                      name="parkingSpaces"
                      value={formData.parkingSpaces}
                      onChange={handleChange}
                      placeholder="2"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year Built
                    </label>
                    <input
                      type="number"
                      name="yearBuilt"
                      value={formData.yearBuilt}
                      onChange={handleChange}
                      placeholder="2020"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Land Properties */}
            {formData.category === "Land" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Land Size (m²) *
                    </label>
                    <input
                      type="number"
                      name="landSize"
                      value={formData.landSize}
                      onChange={handleChange}
                      placeholder="500"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zoning
                    </label>
                    <select
                      name="zoning"
                      value={formData.zoning}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Select Zoning</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="industrial">Industrial</option>
                      <option value="agricultural">Agricultural</option>
                      <option value="mixed">Mixed Use</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topography
                    </label>
                    <select
                      name="topography"
                      value={formData.topography}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Select Topography</option>
                      <option value="flat">Flat</option>
                      <option value="gentle-slope">Gentle Slope</option>
                      <option value="steep-slope">Steep Slope</option>
                      <option value="hillside">Hillside</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Commercial Properties */}
            {formData.category === "Commercial Property" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Floor Area (m²) *
                    </label>
                    <input
                      type="number"
                      name="floorArea"
                      value={formData.floorArea}
                      onChange={handleChange}
                      placeholder="300"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Floors
                    </label>
                    <input
                      type="number"
                      name="floors"
                      value={formData.floors}
                      onChange={handleChange}
                      placeholder="2"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parking Spaces *
                    </label>
                    <input
                      type="number"
                      name="parkingSpaces"
                      value={formData.parkingSpaces}
                      onChange={handleChange}
                      placeholder="10"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year Built
                    </label>
                    <input
                      type="number"
                      name="yearBuilt"
                      value={formData.yearBuilt}
                      onChange={handleChange}
                      placeholder="2020"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Features */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
            Features & Amenities
          </h2>

          <div className="flex flex-col sm:flex-row gap-2 mb-3 md:mb-4">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="e.g., Swimming Pool"
              className="flex-1 px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addFeature())
              }
            />
            <button
              type="button"
              onClick={addFeature}
              className="w-full sm:w-auto px-4 py-2 text-sm md:text-base min-h-[40px] md:min-h-[44px] bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors flex items-center justify-center gap-2 flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {formData.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 text-xs md:text-sm bg-gray-100 text-gray-700 rounded-full"
                >
                  <span className="truncate max-w-[150px] md:max-w-none">
                    {feature}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="hover:text-teal-700 flex-shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Documents Upload */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
            Property Documents
          </h2>
          <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
            Upload legal documents (C of O, Survey Plan, etc.)
          </p>

          <div className="space-y-2 md:space-y-3">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-8 md:w-10 h-8 md:h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 md:w-5 h-4 md:h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs md:text-sm text-gray-900 truncate">
                    {doc.name}
                  </p>
                  <p className="text-xs text-gray-500">{doc.size}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeDocument(index)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ))}

            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-700 hover:bg-teal-50 transition-colors">
              <File className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">
                Upload Documents (PDF, DOC)
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                multiple
                onChange={handleDocumentUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Videos Upload */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
            Property Videos
          </h2>
          <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
            Upload video tours of the property
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {videos.map((video, index) => (
              <div key={index} className="relative group">
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="w-12 h-12 text-white opacity-80" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeVideo(index)}
                  className="absolute -top-2 -right-2 bg-teal-700 text-white rounded-full p-1 hover:bg-teal-800 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="text-sm font-medium text-gray-900 mt-2 truncate">
                  {video.name}
                </p>
              </div>
            ))}

            <label className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-teal-700 hover:bg-teal-50 transition-colors">
              <Video className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Add Video</span>
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
          <button
            type="button"
            className="flex-1 px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Save Draft
          </button>
          <button
            type="submit"
            className="flex-1 px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base min-h-[44px] md:min-h-[48px] bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800 transition-colors flex-shrink-0"
          >
            Publish Listing
          </button>
        </div>
      </form>
    </div>
  );
}
