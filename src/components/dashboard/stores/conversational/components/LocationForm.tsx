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
import { NIGERIAN_STATES } from "../constants";
import { LocationFormData } from "../types";

interface LocationFormProps {
  value: LocationFormData;
  onChange: (field: keyof LocationFormData, val: string) => void;
  onSubmit: () => void;
  error?: string;
}

export const LocationForm = ({
  value,
  onChange,
  onSubmit,
  error,
}: LocationFormProps) => (
  <div className="space-y-4 max-w-md">
    <div className="space-y-2">
      <Label htmlFor="address" className="text-sm font-medium">
        Street Address
      </Label>
      <Input
        id="address"
        value={value.address}
        onChange={(e) => onChange("address", e.target.value)}
        placeholder="123 Main Street"
        className="h-10"
      />
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-2">
        <Label htmlFor="state" className="text-sm font-medium">
          State
        </Label>
        <Select
          value={value.state}
          onValueChange={(val) => onChange("state", val)}
        >
          <SelectTrigger id="state" className="h-10">
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            {NIGERIAN_STATES.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="city" className="text-sm font-medium">
          City
        </Label>
        <Input
          id="city"
          value={value.city}
          onChange={(e) => onChange("city", e.target.value)}
          placeholder="City name"
          className="h-10"
        />
      </div>
    </div>

    {error && <p className="text-sm text-destructive">{error}</p>}

    <Button onClick={onSubmit} className="w-full gap-2">
      <Check className="w-4 h-4" />
      Continue
    </Button>
  </div>
);
