import { type Budget } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface BudgetWidgetProps {
  budget: Budget;
  className?: string;
}

export function BudgetWidget({ budget, className }: BudgetWidgetProps) {
  return (
    <Card className={cn("shadow-sm overflow-hidden", className)}>
      <CardHeader className="bg-primary-500 p-4 text-white">
        <CardTitle className="text-lg font-semibold">Estimated Budget</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ul className="space-y-2">
          <BudgetItem label="Accommodation" amount={budget.accommodation} />
          <BudgetItem label="Food & Dining" amount={budget.food} />
          <BudgetItem label="Activities" amount={budget.activities} />
          <BudgetItem label="Transportation" amount={budget.transportation} />
          <BudgetItem label="Miscellaneous" amount={budget.miscellaneous} />
          
          <Separator className="my-2" />
          
          <li className="flex justify-between pt-1 font-bold">
            <span>Total</span>
            <span>${budget.total}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

function BudgetItem({ label, amount }: { label: string; amount: number }) {
  return (
    <li className="flex justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">${amount}</span>
    </li>
  );
}
