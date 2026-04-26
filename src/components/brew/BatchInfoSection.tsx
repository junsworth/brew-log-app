"use client";

import { BJCP_BEER_STYLES, RECIPE_TYPES } from "@/constants/brewing";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BatchInfo } from "@/types/brew";

interface Props {
  data: BatchInfo;
  onChange: (next: BatchInfo) => void;
}

export function BatchInfoSection({ data, onChange }: Props) {
  const set = <K extends keyof BatchInfo>(key: K, value: BatchInfo[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      <div className="space-y-1.5">
        <Label>Recipe / Beer Name</Label>
        <Input value={data.recipeName} onChange={(e) => set("recipeName", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>Style (BJCP)</Label>
        <Select value={data.style} onValueChange={(v) => set("style", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select style..." />
            <SelectContent>
              {BJCP_BEER_STYLES.map((style) => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectTrigger>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Brewer</Label>
        <Input value={data.brewer} onChange={(e) => set("brewer", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>Batch Size (L)</Label>
        <Input
          type="number"
          value={data.batchSize}
          onChange={(e) => set("batchSize", e.target.value === "" ? "" : Number(e.target.value))}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Boil Time (min)</Label>
        <Input
          type="number"
          value={data.boilTime}
          onChange={(e) => set("boilTime", e.target.value === "" ? "" : Number(e.target.value))}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Recipe Type</Label>
        <Select
          value={data.recipeType}
          onValueChange={(v) => set("recipeType", v as BatchInfo["recipeType"])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type..." />
            <SelectContent>
              {RECIPE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectTrigger>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>IBU</Label>
        <Input
          type="number"
          value={data.ibu}
          onChange={(e) => set("ibu", e.target.value === "" ? "" : Number(e.target.value))}
        />
      </div>
      <div className="space-y-1.5">
        <Label>SRM / EBC</Label>
        <Input
          type="number"
          value={data.srm}
          onChange={(e) => set("srm", e.target.value === "" ? "" : Number(e.target.value))}
        />
      </div>
    </div>
  );
}
