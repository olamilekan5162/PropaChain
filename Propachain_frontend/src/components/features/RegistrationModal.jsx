import { useState } from "react";
import {
  X,
  User,
  Phone,
  Mail,
  FileText,
  Shield,
  CheckCircle,
} from "lucide-react";
import { Button } from "../common/Button";
import { motion, AnimatePresence } from "framer-motion";

export const RegistrationModal = ({ isOpen, onClose, onRegister, loading }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    idType: "National ID",
    idNumber: "",
    phoneNumber: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  const idTypes = [
    "National ID",
    "Passport",
    "Driver's License",
    "Voter's ID",
    "Other",
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.idNumber.trim()) {
      newErrors.idNumber = "ID number is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number format";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await onRegister(formData);
    if (success) {
      // Reset form
      setFormData({
        fullName: "",
        idType: "National ID",
        idNumber: "",
        phoneNumber: "",
        email: "",
      });
      onClose();
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 p-8 text-white relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm">
              <Shield size={32} strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              Welcome to PropaChain
            </h2>
            <p className="text-teal-50 leading-relaxed">
              Complete your profile to start buying and selling properties
              securely on the blockchain
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              <div className="flex items-center gap-2">
                <User size={16} className="text-zinc-500" />
                <span>
                  Full Name <span className="text-red-500">*</span>
                </span>
              </div>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700/20 transition-all ${
                errors.fullName
                  ? "border-red-300 focus:border-red-500"
                  : "border-zinc-300 focus:border-teal-700"
              }`}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1.5">{errors.fullName}</p>
            )}
          </div>

          {/* ID Type and Number */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-zinc-500" />
                  <span>
                    ID Type <span className="text-red-500">*</span>
                  </span>
                </div>
              </label>
              <select
                value={formData.idType}
                onChange={(e) => handleChange("idType", e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all"
              >
                {idTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                <span>
                  ID Number <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                value={formData.idNumber}
                onChange={(e) => handleChange("idNumber", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700/20 transition-all ${
                  errors.idNumber
                    ? "border-red-300 focus:border-red-500"
                    : "border-zinc-300 focus:border-teal-700"
                }`}
                placeholder="Enter your ID number"
              />
              {errors.idNumber && (
                <p className="text-red-500 text-sm mt-1.5">{errors.idNumber}</p>
              )}
            </div>
          </div>

          {/* Phone and Email */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-zinc-500" />
                  <span>
                    Phone Number <span className="text-red-500">*</span>
                  </span>
                </div>
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700/20 transition-all ${
                  errors.phoneNumber
                    ? "border-red-300 focus:border-red-500"
                    : "border-zinc-300 focus:border-teal-700"
                }`}
                placeholder="+1 234 567 8900"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1.5">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-zinc-500" />
                  <span>
                    Email Address <span className="text-red-500">*</span>
                  </span>
                </div>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700/20 transition-all ${
                  errors.email
                    ? "border-red-300 focus:border-red-500"
                    : "border-zinc-300 focus:border-teal-700"
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1.5">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center shrink-0">
                <Shield className="text-white" size={16} />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-teal-900 mb-1">
                  Your Privacy Matters
                </p>
                <p className="text-teal-700 leading-relaxed">
                  Your information is encrypted and stored securely on the
                  blockchain. We never share your personal details with third
                  parties.
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-teal-700 hover:bg-teal-800"
              isLoading={loading}
            >
              <CheckCircle size={18} className="mr-2" />
              Complete Registration
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
