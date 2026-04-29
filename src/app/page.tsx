"use client";

import { BatchInfoSection } from "@/components/brew/BatchInfoSection";
import { BatchHeader } from "@/components/brew/BatchHeader";
import { BoilSection, FermentationSection, PackagingSection } from "@/components/brew/BoilFermentationPackaging";
import { FermentablesSection } from "@/components/brew/FermentablesSection";
import { GravityStatsSection } from "@/components/brew/GravityStatsSection";
import { HopAdditionsSection } from "@/components/brew/HopAdditionsSection";
import { MashSection, WaterProfileSection } from "@/components/brew/MashSection";
import { MiscAdditionsSection } from "@/components/brew/MiscAdditionsSection";
import { SectionCard } from "@/components/brew/SectionCard";
import { YeastSection } from "@/components/brew/YeastSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useBrewBatch } from "@/hooks/useBrewBatch";
import { useState } from "react";

export default function Home() {
  const { batch, setBatch, lastSavedAt, exportJson, exportPdf, importJson, reset } = useBrewBatch();
  const [importError, setImportError] = useState<string | null>(null);

  const lastSavedLabel = lastSavedAt ? `Saved ${lastSavedAt.toLocaleTimeString()}` : "Autosave enabled";

  return (
    <div className="min-h-screen bg-muted/20 pb-24 sm:pb-6">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-3 py-4 sm:px-4 sm:py-6 md:px-6">
        <BatchHeader
          lastSavedLabel={lastSavedLabel}
          importError={importError}
          onExport={exportJson}
          onExportPdf={exportPdf}
          onReset={reset}
          onImportFile={importJson}
          onImportError={setImportError}
        />

        <Tabs defaultValue="page1" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2">
            <TabsTrigger className="w-full" value="page1">Page 1 - Recipe & Ingredients</TabsTrigger>
            <TabsTrigger className="w-full" value="page2">Page 2 - Process & Fermentation</TabsTrigger>
          </TabsList>

          <TabsContent value="page1" className="space-y-4">
            <SectionCard title="Batch Information" icon="1">
              <BatchInfoSection
                data={batch.batchInfo}
                onChange={(next) => setBatch((prev) => ({ ...prev, batchInfo: next }))}
              />
            </SectionCard>
            <SectionCard title="Gravity & Key Stats" icon="2">
              <GravityStatsSection
                data={batch.gravityStats}
                onChange={(next) => setBatch((prev) => ({ ...prev, gravityStats: next }))}
              />
            </SectionCard>
            <SectionCard title="Fermentables / Grain Bill" icon="3">
              <FermentablesSection
                rows={batch.fermentables}
                onChange={(next) => setBatch((prev) => ({ ...prev, fermentables: next }))}
              />
            </SectionCard>
            <SectionCard title="Hop Additions" icon="4">
              <HopAdditionsSection rows={batch.hops} onChange={(next) => setBatch((prev) => ({ ...prev, hops: next }))} />
            </SectionCard>
            <SectionCard title="Yeast" icon="5">
              <YeastSection rows={batch.yeast} onChange={(next) => setBatch((prev) => ({ ...prev, yeast: next }))} />
            </SectionCard>
            <SectionCard title="Miscellaneous Additions" icon="6">
              <MiscAdditionsSection
                rows={batch.miscAdditions}
                onChange={(next) => setBatch((prev) => ({ ...prev, miscAdditions: next }))}
              />
            </SectionCard>
          </TabsContent>

          <TabsContent value="page2" className="space-y-4">
            <SectionCard title="Mash" icon="7">
              <MashSection data={batch.mash} onChange={(next) => setBatch((prev) => ({ ...prev, mash: next }))} />
            </SectionCard>
            <SectionCard title="Water Profile" icon="8">
              <WaterProfileSection
                data={batch.waterProfile}
                onChange={(next) => setBatch((prev) => ({ ...prev, waterProfile: next }))}
              />
            </SectionCard>
            <SectionCard title="Boil" icon="9">
              <BoilSection data={batch.boil} onChange={(next) => setBatch((prev) => ({ ...prev, boil: next }))} />
            </SectionCard>
            <SectionCard title="Fermentation Schedule" icon="10">
              <FermentationSection
                data={batch.fermentation}
                onChange={(next) => setBatch((prev) => ({ ...prev, fermentation: next }))}
              />
            </SectionCard>
            <SectionCard title="Packaging & Conditioning" icon="11">
              <PackagingSection
                data={batch.packaging}
                onChange={(next) => setBatch((prev) => ({ ...prev, packaging: next }))}
              />
            </SectionCard>
            <SectionCard title="Brew Day Notes & Observations" icon="12">
              <Textarea
                className="min-h-40"
                value={batch.brewNotes}
                onChange={(e) => setBatch((prev) => ({ ...prev, brewNotes: e.target.value }))}
                placeholder="Record observations, adjustments, issues, and tasting notes..."
              />
            </SectionCard>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
