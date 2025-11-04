import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";
import { DAYS_OF_WEEK } from "../constants";
import { HoursFormData } from "../types";

interface HoursFormProps {
  value: HoursFormData;
  onChange: (field: keyof HoursFormData, val: string) => void;
  onSubmit: () => void;
  error?: string;
}

export const HoursForm = ({
  value,
  onChange,
  onSubmit,
  error,
}: HoursFormProps) => (
  <div className="space-y-4 max-w-md">
    <div className="space-y-2">
      <Label className="text-sm font-medium">Operating Days</Label>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="weekOpen" className="text-xs text-muted-foreground">
            From
          </Label>
          <Select
            value={value.weekOpen}
            onValueChange={(val) => onChange("weekOpen", val)}
          >
            <SelectTrigger id="weekOpen" className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAYS_OF_WEEK.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="weekClose" className="text-xs text-muted-foreground">
            To
          </Label>
          <Select
            value={value.weekClose}
            onValueChange={(val) => onChange("weekClose", val)}
          >
            <SelectTrigger id="weekClose" className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAYS_OF_WEEK.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium">Operating Hours</Label>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="openTime" className="text-xs text-muted-foreground">
            Opens
          </Label>
          <Input
            id="openTime"
            type="time"
            value={value.openTime}
            onChange={(e) => onChange("openTime", e.target.value)}
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="closeTime" className="text-xs text-muted-foreground">
            Closes
          </Label>
          <Input
            id="closeTime"
            type="time"
            value={value.closeTime}
            onChange={(e) => onChange("closeTime", e.target.value)}
            className="h-10"
          />
        </div>
      </div>
    </div>

    {error && <p className="text-sm text-destructive">{error}</p>}

    <Button onClick={onSubmit} className="w-full gap-2">
      <Check className="w-4 h-4" />
      Continue
    </Button>
  </div>
);
