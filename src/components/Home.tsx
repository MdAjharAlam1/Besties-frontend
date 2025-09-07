
import { 
  MessageCircle, 
  Video, 
  Phone, 
  Users, 
  Heart, 
  Globe, 
  Shield, 
  Zap, 
  Star,
  UserPlus,
  LogIn,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

function Home() {
  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Instant Chat",
      description: "Connect with friends through seamless messaging with real-time notifications and media sharing."
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Video Calls",
      description: "Face-to-face conversations with crystal clear HD video calling, perfect for staying close to loved ones."
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Audio Calls",
      description: "High-quality voice calls with noise cancellation technology for clear conversations anywhere."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Group Connections",
      description: "Create and join communities with shared interests, hobbies, and goals to expand your network."
    }
  ];

  const advantages = [
    {
      icon: <Heart className="w-12 h-12 text-red-500" />,
      title: "Build Meaningful Relationships",
      description: "Foster deep connections with friends, family, and like-minded individuals who share your passions and interests."
    },
    {
      icon: <Globe className="w-12 h-12 text-blue-500" />,
      title: "Global Community Access",
      description: "Connect with people from around the world, breaking geographical barriers and expanding your cultural horizons."
    },
    {
      icon: <Zap className="w-12 h-12 text-yellow-500" />,
      title: "Instant Communication",
      description: "Stay connected 24/7 with real-time messaging, video calls, and updates from your social circle."
    },
    {
      icon: <Shield className="w-12 h-12 text-green-500" />,
      title: "Safe & Secure Environment",
      description: "Enjoy peace of mind with advanced privacy controls, content moderation, and secure data protection."
    },
    {
      icon: <Star className="w-12 h-12 text-purple-500" />,
      title: "Discover New Opportunities",
      description: "Find career opportunities, collaborators, mentors, and new experiences through your extended network."
    },
    {
      icon: <Sparkles className="w-12 h-12 text-pink-500" />,
      title: "Share Your Story",
      description: "Express yourself creatively through posts, photos, videos, and stories while inspiring others."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Besties
              </h1>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Connect, Share, and Build
              <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Lasting Friendships
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join millions of people building meaningful connections through our secure social platform. 
              Chat, call, and create memories with friends old and new.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link to="/login">
                <button 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link to="/login">
                <button 
                  className="bg-white text-gray-800 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 border border-gray-200"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="text-3xl font-bold text-purple-600 mb-2">10M+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="text-3xl font-bold text-blue-600 mb-2">500M+</div>
                <div className="text-gray-600">Messages Sent</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Stay Connected
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Powerful features designed to bring people together and create meaningful interactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-2">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advantages Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Social Networking Matters
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the transformative power of genuine human connections in our digital age.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="group">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1">
                  <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                    {advantage.icon}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">{advantage.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{advantage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Build Your Community?
          </h3>
          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            Join millions of users who have found their tribe on Besties. Start connecting today!
          </p>
          <Link to="/login">
            <button 
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Start Your Journey</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;