import React from "react";
import { ArrowRight, Sparkles, Calendar, MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <main className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-primary/20 to-secondary/30">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            <div className="flex justify-center mb-6">
              <div className="bg-highlight/20 backdrop-blur-sm px-4 py-2 rounded-full text-highlight font-medium text-sm flex items-center space-x-2">
                <Sparkles size={16} />
                <span>Make every weekend magical</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Plan Your Perfect{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Weekend
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
              Discover amazing activities, create memorable experiences, and
              make the most of your free time with personalized weekend plans.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/explore"
                className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-220 focus-ring flex items-center justify-center space-x-2"
              >
                <span>Start Exploring</span>
                <ArrowRight size={20} />
              </Link>

              <Link
                to="/planner"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-220 focus-ring"
              >
                Plan Your Weekend
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need for Perfect Weekends
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Discover, save, and plan amazing weekend activities tailored to
              your interests
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform duration-220">
                <Calendar size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Discover Events
              </h3>
              <p className="text-white/70">
                Browse curated weekend activities from outdoor adventures to
                cultural experiences
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-secondary to-primary p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform duration-220">
                <Heart size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Save Favorites
              </h3>
              <p className="text-white/70">
                Keep track of events you love and build your personal collection
                of weekend plans
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform duration-220">
                <MapPin size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Explore Locally
              </h3>
              <p className="text-white/70">
                Find amazing activities happening right in your neighborhood and
                beyond
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
