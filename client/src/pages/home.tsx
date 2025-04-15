import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertWaitlistSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function HomePage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Extend the schema with validation
  const waitlistFormSchema = insertWaitlistSchema.extend({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
  });
  
  // Form hook
  const form = useForm<z.infer<typeof waitlistFormSchema>>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      name: "",
      email: "",
      travelInterests: "",
      newsletter: false
    }
  });
  
  const onSubmit = async (data: z.infer<typeof waitlistFormSchema>) => {
    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/waitlist", data);
      toast({
        title: "Success!",
        description: "You've been added to our waitlist. We'll be in touch soon!",
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting waitlist entry:", error);
      toast({
        title: "Something went wrong",
        description: "There was an error adding you to the waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6 xl:col-span-5">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
                Your AI-Powered <span className="text-primary">Travel Companion</span>
              </h1>
              <p className="mt-6 text-xl text-gray-500">
                Plan your perfect trip with our AI chatbot. Get personalized itineraries, accommodation suggestions, and real-time travel assistance.
              </p>
              <div className="mt-8 sm:mx-auto sm:max-w-lg sm:flex flex-col sm:flex-row gap-4">
                <Link href="#waitlist">
                  <Button className="w-full sm:w-auto" size="lg">
                    Join Waitlist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="outline" className="w-full sm:w-auto mt-4 sm:mt-0" size="lg">
                    See Demo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6 xl:col-span-7">
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-white/50"></div>
                {/* Map placeholder with chat overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1569336415962-a4bd9f69c07b')] bg-cover bg-center bg-no-repeat"></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <Card className="bg-white rounded-xl shadow-2xl w-[90%] h-[85%] overflow-hidden flex flex-col">
                    <div className="bg-primary p-4 text-white">
                      <div className="flex items-center">
                        <i className="fas fa-robot mr-2"></i>
                        <h3 className="font-semibold">TravelPal Assistant</h3>
                      </div>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                      <div className="space-y-4">
                        <div className="flex justify-start">
                          <div className="bg-white p-3 rounded-lg shadow rounded-tl-sm max-w-[80%]">
                            <p className="text-gray-800">Hi there! I'm your TravelPal assistant. Where would you like to travel?</p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div className="bg-primary p-3 rounded-lg shadow rounded-tr-sm max-w-[80%]">
                            <p className="text-white">I want to visit Tokyo for 5 days in October. Can you help me plan the trip?</p>
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <div className="bg-white p-3 rounded-lg shadow rounded-tl-sm max-w-[80%]">
                            <p className="text-gray-800">Great choice! Tokyo in October has pleasant weather. Let me create an itinerary for you. What's your budget range and are you interested in cultural sites, food experiences, or shopping?</p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div className="bg-primary p-3 rounded-lg shadow rounded-tr-sm max-w-[80%]">
                            <p className="text-white">My budget is around $2000. I'm interested in cultural sites and food experiences!</p>
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <div className="bg-white p-3 rounded-lg shadow rounded-tl-sm max-w-[80%]">
                            <div className="text-gray-800 flex items-center space-x-1">
                              <span>Planning your Tokyo adventure</span>
                              <span className="inline-flex">
                                <span className="animate-bounce">.</span>
                                <span className="animate-bounce animation-delay-200">.</span>
                                <span className="animate-bounce animation-delay-400">.</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-t">
                      <div className="flex">
                        <Input placeholder="Type your message..." className="flex-1 rounded-l-full focus:ring-primary-300" />
                        <Button className="rounded-r-full">
                          <i className="fas fa-paper-plane px-2"></i>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Plan Your Perfect Journey</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              TravelPal combines AI intelligence with travel expertise to create personalized experiences.
            </p>
          </div>
          
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600 mb-4">
                <i className="fas fa-map-marked-alt text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Smart Itinerary Planning</h3>
              <p className="mt-3 text-gray-600">
                Get AI-powered itineraries based on your preferences, time constraints, and interests.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 text-orange-600 mb-4">
                <i className="fas fa-bed text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Accommodation Finder</h3>
              <p className="mt-3 text-gray-600">
                Discover the perfect places to stay based on your budget and location preferences.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600 mb-4">
                <i className="fas fa-utensils text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Local Experiences</h3>
              <p className="mt-3 text-gray-600">
                Get recommendations for authentic local experiences, restaurants, and hidden gems.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
                <i className="fas fa-cloud-sun text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Weather Forecasts</h3>
              <p className="mt-3 text-gray-600">
                Get real-time weather updates for your destination to plan accordingly.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600 mb-4">
                <i className="fas fa-plane text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Transportation Assistance</h3>
              <p className="mt-3 text-gray-600">
                Get help with booking flights, trains, and local transportation options.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-100 text-yellow-600 mb-4">
                <i className="fas fa-wallet text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Budget Estimation</h3>
              <p className="mt-3 text-gray-600">
                Get cost estimates for your entire trip to help you plan your budget effectively.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How it works section */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">How TravelPal Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Creating your perfect itinerary is as easy as having a conversation.
            </p>
          </div>
          
          <div className="mt-16">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white text-xl font-bold">1</div>
                  <h3 className="ml-4 text-xl font-semibold text-gray-900">Tell Us Your Plans</h3>
                </div>
                <p className="text-gray-600 ml-16">
                  Share your destination, dates, and preferences with our AI chatbot.
                </p>
                <div className="hidden lg:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                  <i className="fas fa-arrow-right text-3xl text-gray-300"></i>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative mt-10 lg:mt-0">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white text-xl font-bold">2</div>
                  <h3 className="ml-4 text-xl font-semibold text-gray-900">Get Your Itinerary</h3>
                </div>
                <p className="text-gray-600 ml-16">
                  Our AI creates a personalized travel plan with activities, accommodations, and more.
                </p>
                <div className="hidden lg:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                  <i className="fas fa-arrow-right text-3xl text-gray-300"></i>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="mt-10 lg:mt-0">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white text-xl font-bold">3</div>
                  <h3 className="ml-4 text-xl font-semibold text-gray-900">Enjoy Your Trip</h3>
                </div>
                <p className="text-gray-600 ml-16">
                  Access your itinerary anytime, make adjustments, and enjoy real-time assistance during your travels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Demo section */}
      <section id="demo" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">See TravelPal in Action</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Take a look at a sample itinerary for a 5-day trip to Tokyo.
            </p>
          </div>
          
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Itinerary Preview */}
            <div className="col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-primary p-4 text-white">
                <h3 className="font-semibold text-lg">Tokyo Itinerary (5 Days)</h3>
                <p className="text-primary-100">October 10-15, 2023 | Budget: ~$2000</p>
              </div>
              
              {/* Itinerary Content */}
              <div className="p-6 space-y-6">
                {/* Day 1 */}
                <div className="border-b pb-5">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Day 1: Arrival & Shinjuku</h4>
                  <ul className="space-y-3">
                    <li className="flex">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 mr-3">
                        <i className="fas fa-plane-arrival text-sm"></i>
                      </div>
                      <div>
                        <span className="font-medium">Arrive at Narita International Airport</span>
                        <p className="text-sm text-gray-500">Take Narita Express to Tokyo Station (~60 min, ¥3,000)</p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3">
                        <i className="fas fa-bed text-sm"></i>
                      </div>
                      <div>
                        <span className="font-medium">Check-in at Shinjuku Washington Hotel</span>
                        <p className="text-sm text-gray-500">Mid-range hotel, ~$120/night</p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 mr-3">
                        <i className="fas fa-utensils text-sm"></i>
                      </div>
                      <div>
                        <span className="font-medium">Dinner at Omoide Yokocho</span>
                        <p className="text-sm text-gray-500">Traditional izakaya alley with small eateries, ~$30/person</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                {/* Day 2 */}
                <div className="border-b pb-5">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Day 2: Traditional Tokyo</h4>
                  <ul className="space-y-3">
                    <li className="flex">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 mr-3">
                        <i className="fas fa-torii-gate text-sm"></i>
                      </div>
                      <div>
                        <span className="font-medium">Visit Senso-ji Temple in Asakusa</span>
                        <p className="text-sm text-gray-500">Tokyo's oldest temple, free entry</p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 mr-3">
                        <i className="fas fa-ship text-sm"></i>
                      </div>
                      <div>
                        <span className="font-medium">Tokyo Bay Cruise</span>
                        <p className="text-sm text-gray-500">Afternoon cruise, ~$25/person</p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 mr-3">
                        <i className="fas fa-utensils text-sm"></i>
                      </div>
                      <div>
                        <span className="font-medium">Sushi Dinner at Tsukiji Outer Market</span>
                        <p className="text-sm text-gray-500">Fresh sushi experience, ~$40/person</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                {/* View More Button */}
                <div className="text-center pt-2">
                  <Link href="/chat">
                    <Button variant="outline">
                      Try It Yourself
                      <i className="fas fa-chevron-right ml-2"></i>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Map & Weather */}
            <div className="mt-8 lg:mt-0 space-y-6">
              {/* Map */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-primary p-4 text-white">
                  <h3 className="font-semibold text-lg">Tokyo Highlights</h3>
                </div>
                <div className="p-2">
                  <div className="h-64 w-full rounded overflow-hidden bg-[url('https://images.unsplash.com/photo-1569336415962-a4bd9f69c07b')] bg-cover bg-center relative">
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <div className="bg-white/80 px-4 py-2 rounded-lg text-center">
                        <i className="fas fa-map-marker-alt text-orange-500 text-lg"></i>
                        <p className="text-sm font-medium text-gray-800">Interactive Map</p>
                      </div>
                    </div>
                    {/* Map markers */}
                    <div className="absolute top-1/4 left-1/3">
                      <div className="h-4 w-4 bg-orange-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="absolute top-1/2 left-1/2">
                      <div className="h-4 w-4 bg-orange-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="absolute bottom-1/4 right-1/3">
                      <div className="h-4 w-4 bg-orange-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Weather */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-primary p-4 text-white">
                  <h3 className="font-semibold text-lg">Tokyo Weather Forecast</h3>
                </div>
                <div className="p-4">
                  <div className="flex justify-between">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Oct 10</p>
                      <i className="fas fa-sun text-2xl text-yellow-500 my-2"></i>
                      <p className="text-sm font-medium">72°F</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Oct 11</p>
                      <i className="fas fa-cloud-sun text-2xl text-blue-400 my-2"></i>
                      <p className="text-sm font-medium">68°F</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Oct 12</p>
                      <i className="fas fa-cloud text-2xl text-gray-400 my-2"></i>
                      <p className="text-sm font-medium">65°F</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Oct 13</p>
                      <i className="fas fa-sun text-2xl text-yellow-500 my-2"></i>
                      <p className="text-sm font-medium">70°F</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Oct 14</p>
                      <i className="fas fa-sun text-2xl text-yellow-500 my-2"></i>
                      <p className="text-sm font-medium">73°F</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-4">
                    October in Tokyo is generally pleasant with mild temperatures and low rainfall.
                  </p>
                </div>
              </div>
              
              {/* Cost Estimate */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-primary p-4 text-white">
                  <h3 className="font-semibold text-lg">Estimated Budget</h3>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Accommodation</span>
                      <span className="font-medium">$600</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Food & Dining</span>
                      <span className="font-medium">$450</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Attractions</span>
                      <span className="font-medium">$250</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Transportation</span>
                      <span className="font-medium">$300</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Miscellaneous</span>
                      <span className="font-medium">$200</span>
                    </li>
                    <li className="flex justify-between pt-2 border-t font-bold">
                      <span>Total</span>
                      <span>$1,800</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Waitlist section */}
      <section id="waitlist" className="py-16 bg-gradient-to-r from-primary to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">Be the First to Experience TravelPal</h2>
              <p className="mt-4 text-xl text-primary-100">
                Join our waitlist to get early access and special discounts when we launch.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <p className="ml-3 text-white">Early access to the beta version</p>
                </li>
                <li className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <p className="ml-3 text-white">50% discount on premium subscription</p>
                </li>
                <li className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <p className="ml-3 text-white">Exclusive trip planning templates</p>
                </li>
              </ul>
            </div>
            
            {/* Waitlist Form */}
            <div className="mt-10 lg:mt-0">
              <Card className="shadow-lg overflow-hidden">
                <CardContent className="p-8">
                  <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="travelInterests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Travel Interests</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your primary interest" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="cultural">Cultural Experiences</SelectItem>
                                <SelectItem value="adventure">Adventure & Outdoor</SelectItem>
                                <SelectItem value="relaxation">Relaxation & Wellness</SelectItem>
                                <SelectItem value="food">Food & Culinary</SelectItem>
                                <SelectItem value="urban">Urban Exploration</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="newsletter"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Subscribe to our newsletter for travel tips and updates
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full py-6" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Join Waitlist"}
                      </Button>
                    </div>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
