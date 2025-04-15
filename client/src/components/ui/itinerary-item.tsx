import { type ItineraryDay } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ItineraryItemProps {
  day: ItineraryDay;
}

// Icon mapping for activity types
const activityIcons: Record<string, string> = {
  accommodation: "fa-bed",
  food: "fa-utensils",
  activity: "fa-person-hiking",
  transportation: "fa-bus",
  sightseeing: "fa-camera",
  shopping: "fa-shopping-bag",
  entertainment: "fa-ticket",
  relaxation: "fa-spa",
  nightlife: "fa-moon",
};

// Color mapping for activity types
const activityColors: Record<string, string> = {
  accommodation: "bg-blue-100 text-blue-700",
  food: "bg-green-100 text-green-700",
  activity: "bg-purple-100 text-purple-700",
  transportation: "bg-amber-100 text-amber-700",
  sightseeing: "bg-cyan-100 text-cyan-700",
  shopping: "bg-pink-100 text-pink-700",
  entertainment: "bg-indigo-100 text-indigo-700",
  relaxation: "bg-teal-100 text-teal-700",
  nightlife: "bg-violet-100 text-violet-700",
};

export function ItineraryItem({ day }: ItineraryItemProps) {
  return (
    <Card className="shadow-sm border-gray-100 hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Day {day.day}: {day.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {day.activities.map((activity, index) => {
            const iconClass = activity.icon || activityIcons[activity.type] || "fa-star";
            const colorClass = activityColors[activity.type] || "bg-gray-100 text-gray-700";
            
            return (
              <li key={index} className="flex">
                <div className={cn(
                  "flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full mr-3",
                  colorClass
                )}>
                  <i className={`fas ${iconClass} text-sm`}></i>
                </div>
                <div>
                  <span className="font-medium">{activity.title}</span>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  {activity.cost && (
                    <p className="text-xs text-gray-500 mt-1">
                      Estimated cost: ${activity.cost}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

export function ItinerarySummary({ days }: { days: ItineraryDay[] }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-primary-500 text-white">
        <CardTitle className="text-lg">Itinerary Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {days.map((day, index) => (
          <div key={index} className="p-3 border-b last:border-b-0">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600 mr-2">
                {day.day}
              </div>
              <h4 className="font-medium text-sm">{day.title}</h4>
            </div>
            <ul className="mt-1 text-xs text-gray-500 pl-8">
              {day.activities.slice(0, 3).map((activity, actIndex) => (
                <li key={actIndex} className="list-disc">{activity.title}</li>
              ))}
              {day.activities.length > 3 && (
                <li className="list-none italic">+{day.activities.length - 3} more activities</li>
              )}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
