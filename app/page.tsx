import {Star} from "lucide-react";

import {GSoCDashboard} from "@/components/dashboard";
import {ThemeSwitcher} from "@/components/theme-switcher";
import {Button} from "@/components/ui/button";
import {extractUniqueYearsAndTechnologies} from "@/lib/utils";
import Organizations from "@/public/organizations.json";

const getOrganizations = async () => {
  return Organizations;
};

export default async function Page() {
  const organizations = await getOrganizations();

  const {allYears, allTechnologies} =
    extractUniqueYearsAndTechnologies(organizations);

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto p-4 md:p-6">
        <header className="flex items-center flex-wrap gap-6 justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
              Google Summer of Code Organizations
            </h1>
            <p className="text-muted-foreground">
              Explore participating organizations and their project statistics
            </p>
          </div>

          <div className="flex gap-2">
            <Button asChild>
              <a
                href="https://github.com/AI-Elbaz/gsoc-organizations"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2">
                <Star />
                Star on GitHub
              </a>
            </Button>
            <ThemeSwitcher />
          </div>
        </header>
        <GSoCDashboard
          organizations={organizations}
          allYears={allYears}
          allTechnologies={allTechnologies}
        />
      </div>
    </div>
  );
}
