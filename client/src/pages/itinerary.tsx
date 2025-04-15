import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItineraryItem, ItinerarySummary } from "@/components/ui/itinerary-item";
import { WeatherWidget } from "@/components/ui/weather-widget";
import { BudgetWidget } from "@/components/ui/budget-widget";
import { type ItineraryContent } from "@shared/schema";
import { Plane, Calendar, Map, ArrowLeft, Printer, Download } from "lucide-react";

// Sample itinerary data (in a real app, this would come from the API)
const sampleItinerary: ItineraryContent = {
  destination: "Tokyo, Japan",
  duration: 5,
  startDate: "2023-10-10",
  endDate: "2023-10-15",
  summary: "A 5-day cultural exploration of Tokyo with focus on historical sites, local cuisine, and unique experiences.",
  days: [
    {
      day: 1,
      title: "Arrival & Shinjuku",
      activities: [
        {
          type: "transportation",
          title: "Arrive at Narita International Airport",
          description: "Take Narita Express to Tokyo Station (~60 min, ¥3,000)",
          cost: 30,
          icon: "fa-plane-arrival"
        },
        {
          type: "accommodation",
          title: "Check-in at Shinjuku Washington Hotel",
          description: "Mid-range hotel, ~$120/night",
          cost: 120,
          icon: "fa-bed"
        },
        {
          type: "food",
          title: "Dinner at Omoide Yokocho",
          description: "Traditional izakaya alley with small eateries",
          cost: 30,
          icon: "fa-utensils"
        }
      ]
    },
    {
      day: 2,
      title: "Traditional Tokyo",
      activities: [
        {
          type: "activity",
          title: "Visit Senso-ji Temple in Asakusa",
          description: "Tokyo's oldest temple, free entry",
          cost: 0,
          icon: "fa-torii-gate"
        },
        {
          type: "activity",
          title: "Tokyo Bay Cruise",
          description: "Afternoon cruise with city views",
          cost: 25,
          icon: "fa-ship"
        },
        {
          type: "food",
          title: "Sushi Dinner at Tsukiji Outer Market",
          description: "Fresh sushi experience",
          cost: 40,
          icon: "fa-utensils"
        }
      ]
    },
    {
      day: 3,
      title: "Modern Tokyo",
      activities: [
        {
          type: "activity",
          title: "Tokyo Skytree",
          description: "Visit the tallest tower in Japan for panoramic views",
          cost: 20,
          icon: "fa-city"
        },
        {
          type: "activity",
          title: "Akihabara Electronics District",
          description: "Explore the anime and gaming center of Tokyo",
          cost: 0,
          icon: "fa-gamepad"
        },
        {
          type: "food",
          title: "Dinner at Robot Restaurant",
          description: "Unique dining experience with robot performance",
          cost: 80,
          icon: "fa-robot"
        }
      ]
    },
    {
      day: 4,
      title: "Cultural Experiences",
      activities: [
        {
          type: "activity",
          title: "Meiji Shrine and Yoyogi Park",
          description: "Beautiful shrine surrounded by forest",
          cost: 0,
          icon: "fa-tree"
        },
        {
          type: "activity",
          title: "Harajuku & Takeshita Street",
          description: "Fashion district with unique shops",
          cost: 0,
          icon: "fa-shopping-bag"
        },
        {
          type: "food",
          title: "Dinner at Izakaya",
          description: "Traditional Japanese pub experience",
          cost: 35,
          icon: "fa-utensils"
        }
      ]
    },
    {
      day: 5,
      title: "Departure Day",
      activities: [
        {
          type: "activity",
          title: "Tokyo Imperial Palace Gardens",
          description: "Beautiful gardens surrounding the imperial palace",
          cost: 0,
          icon: "fa-landmark"
        },
        {
          type: "food",
          title: "Lunch at Ramen Shop",
          description: "Final authentic Japanese meal",
          cost: 15,
          icon: "fa-utensils"
        },
        {
          type: "transportation",
          title: "Transport to Narita Airport",
          description: "Take Narita Express from Tokyo Station",
          cost: 30,
          icon: "fa-plane-departure"
        }
      ]
    }
  ],
  weather: [
    { date: "2023-10-10", temperature: 72, condition: "Sunny", icon: "fa-sun" },
    { date: "2023-10-11", temperature: 68, condition: "Partly Cloudy", icon: "fa-cloud-sun" },
    { date: "2023-10-12", temperature: 65, condition: "Cloudy", icon: "fa-cloud" },
    { date: "2023-10-13", temperature: 70, condition: "Sunny", icon: "fa-sun" },
    { date: "2023-10-14", temperature: 73, condition: "Sunny", icon: "fa-sun" }
  ],
  budget: {
    accommodation: 600,
    food: 450,
    activities: 250,
    transportation: 300,
    miscellaneous: 200,
    total: 1800
  },
  mapLocation: "Tokyo, Japan"
};

export default function ItineraryPage() {
  const { destination, duration, startDate, endDate, days, weather, budget, summary } = sampleItinerary;
  
  // Format dates for display
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  const startDateFormatted = formatDate(startDate);
  const endDateFormatted = formatDate(endDate);
  const dateRangeDisplay = startDateFormatted && endDateFormatted 
    ? `${startDateFormatted} - ${endDateFormatted}` 
    : `${duration} Days`;
  
  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="flex flex-col gap-6">
        {/* Header with title and actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href="/chat">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chat
              </Button>
            </Link>
            <h1 className="text-3xl font-bold flex items-center">
              <Plane className="h-6 w-6 mr-2 text-primary" />
              {destination} Itinerary
            </h1>
            <div className="flex items-center mt-1 text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{dateRangeDisplay}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button size="sm">
              Edit Itinerary
            </Button>
          </div>
        </div>
        
        {/* Summary card */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-2">Trip Summary</h2>
            <p className="text-muted-foreground">{summary}</p>
          </CardContent>
        </Card>
        
        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Itinerary days - takes up 3/4 of the space on large screens */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Days</TabsTrigger>
                {days.map((day) => (
                  <TabsTrigger key={day.day} value={`day-${day.day}`}>Day {day.day}</TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="all" className="space-y-6">
                {days.map((day) => (
                  <ItineraryItem key={day.day} day={day} />
                ))}
              </TabsContent>
              
              {days.map((day) => (
                <TabsContent key={day.day} value={`day-${day.day}`}>
                  <ItineraryItem day={day} />
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          {/* Sidebar with extra info - takes up 1/4 of the space on large screens */}
          <div className="space-y-6">
            {/* Map widget */}
            <Card className="shadow-sm overflow-hidden">
              <CardHeader className="bg-primary p-4 text-white">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Map className="h-5 w-5 mr-2" />
                  {destination} Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-64 w-full bg-[url('https://images.unsplash.com/photo-1569336415962-a4bd9f69c07b')] bg-cover bg-center relative">
                  <div className="absolute inset-0 bg-black/10"></div>
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
              </CardContent>
            </Card>
            
            {/* Weather widget */}
            <WeatherWidget weatherData={weather || []} />
            
            {/* Budget widget */}
            <BudgetWidget budget={budget || { accommodation: 0, food: 0, activities: 0, transportation: 0, miscellaneous: 0, total: 0 }} />
            
            {/* Itinerary overview */}
            <ItinerarySummary days={days} />
          </div>
        </div>
      </div>
    </div>
  );
}
