import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  TrendingUp,
  Users,
  CheckCircle,
} from "lucide-react";
import {
  categories,
  featuredProperties,
  stats,
  testimonials,
} from "../data/mockData";
import PropertyCard from "../components/common/PropertyCard";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white pb-14 md:pb-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-white py-6 md:py-16 px-3 md:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
              Buy, Sell & Rent Properties
              <span className="block text-teal-700 mt-1 md:mt-2">
                On The Blockchain
              </span>
            </h1>
            <p className="text-sm md:text-xl text-gray-600 max-w-2xl mx-auto">
              Nigeria's trusted property marketplace powered by blockchain
              technology. Safe, secure, and transparent transactions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Link
              to="/marketplace"
              className="w-full sm:w-auto bg-teal-700 text-white px-6 md:px-8 py-2.5 md:py-3 min-h-[44px] md:min-h-[48px] text-sm md:text-base rounded-lg font-semibold hover:bg-teal-800 transition-colors text-center flex-shrink-0"
            >
              Browse Properties
            </Link>
            <Link
              to="/app/upload"
              className="w-full sm:w-auto bg-white text-teal-700 border-2 border-teal-700 px-6 md:px-8 py-2.5 md:py-3 min-h-[44px] md:min-h-[48px] text-sm md:text-base rounded-lg font-semibold hover:bg-teal-50 transition-colors text-center flex-shrink-0"
            >
              List Your Property
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-6 md:py-12 px-3 md:px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6 text-center">
            Browse by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/marketplace?category=${category.slug}`}
                className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md hover:border-teal-700 transition-all text-center"
              >
                <div className="text-2xl md:text-4xl mb-2 md:mb-3">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                  {category.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                  {category.count.toLocaleString()} listings
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-6 md:py-12 px-3 md:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-3xl font-bold text-gray-900">
              Featured Properties
            </h2>
            <Link
              to="/marketplace"
              className="text-teal-700 font-semibold text-sm md:text-base flex items-center hover:text-teal-800"
            >
              View All
              <ArrowRight className="w-3 md:w-4 h-3 md:h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-8 md:py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Why PropaChain?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-teal-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Secure Transactions
              </h3>
              <p className="text-gray-600">
                Blockchain-powered escrow ensures your money is safe until
                property transfer is complete.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-teal-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Verified Listings
              </h3>
              <p className="text-gray-600">
                All properties are verified and authenticated on the blockchain
                for transparency.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-teal-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Fast & Easy
              </h3>
              <p className="text-gray-600">
                List properties in minutes and connect with thousands of
                potential buyers instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 md:py-12 px-4 bg-teal-700 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2 text-white">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-white opacity-90">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            What Our Users Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-teal-700 font-bold">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of users buying and selling properties on PropaChain
          </p>
          <Link
            to="/marketplace"
            className="inline-block bg-teal-700 text-white px-8 py-4 min-h-[52px] rounded-lg font-semibold hover:bg-teal-800 transition-colors text-lg flex-shrink-0"
          >
            Explore Properties Now
            <ArrowRight className="inline w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
