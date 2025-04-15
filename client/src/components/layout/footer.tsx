import { Link } from "wouter";
import { PlaneTakeoff } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center">
              <PlaneTakeoff className="h-6 w-6 text-primary-400 mr-2" />
              <span className="font-bold text-xl text-white">TravelPal</span>
            </div>
            <p className="mt-4 text-gray-400 max-w-md">
              AI-powered travel assistant that helps you plan perfect trips with personalized recommendations, real-time updates, and local insights.
            </p>
            <div className="mt-6 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook-f text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-linkedin-in text-lg"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-gray-300 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Blog</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Careers</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} TravelPal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
