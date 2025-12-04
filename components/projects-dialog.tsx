"use client";

import {useMemo} from "react";

import {DialogDescription, DialogTrigger} from "@radix-ui/react-dialog";
import {
  Book,
  Code,
  Lightbulb,
  Link as LinkIcon,
  List,
  Mail,
  MessageSquare,
} from "lucide-react";
import useSWR from "swr";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {fetchClient} from "@/lib/utils";

import type {Organization, OrganizationDetails, Project} from "@/types";

const ProjectsDialogContent = ({
  organizationUUID,
  isOpen,
}: {
  organizationUUID: string;
  isOpen: boolean;
}) => {
  const {data, error, isLoading} = useSWR<OrganizationDetails>(
    isOpen && organizationUUID
      ? `/organizations/${organizationUUID}.json`
      : null,
    fetchClient,
    {revalidateIfStale: false},
  );

  const projectsByYear = useMemo(() => {
    const projectsGroupedByYear: Record<string, Project[]> = {};
    if (data?.years) {
      for (const year in data.years) {
        const yearData = data.years[year as keyof typeof data.years];
        if (yearData?.projects) {
          projectsGroupedByYear[year.replace("_", "")] = yearData.projects.sort(
            (a, b) => a.title.localeCompare(b.title),
          );
        }
      }
    }
    return projectsGroupedByYear;
  }, [data]);

  const sortedYears = useMemo(() => {
    return Object.keys(projectsByYear).sort((a, b) => b.localeCompare(a));
  }, [projectsByYear]);

  if (!isOpen) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="grow flex items-center justify-center">
        <p>Loading projects...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="grow flex items-center justify-center">
        <p className="text-red-500 text-center p-8">
          Failed to load projects. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg p-4 mb-4">
        <h4 className="font-semibold mb-3 text-center md:text-left">
          Organization Details
        </h4>
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {data.contact_email && (
            <Button variant="outline" size="sm" asChild>
              <a href={data.contact_email}>
                <Mail className="mr-2 h-4 w-4" /> Contact Email
              </a>
            </Button>
          )}
          {data.mailing_list && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={data.mailing_list}
                target="_blank"
                rel="noopener noreferrer">
                <List className="mr-2 h-4 w-4" /> Mailing List
              </a>
            </Button>
          )}
          {data.irc_channel && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={data.irc_channel}
                target="_blank"
                rel="noopener noreferrer">
                <MessageSquare className="mr-2 h-4 w-4" /> IRC Channel
              </a>
            </Button>
          )}
          {data.ideas_url && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={data.ideas_url}
                target="_blank"
                rel="noopener noreferrer">
                <Lightbulb className="mr-2 h-4 w-4" /> Ideas List
              </a>
            </Button>
          )}
          {data.guide_url && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={data.guide_url}
                target="_blank"
                rel="noopener noreferrer">
                <Book className="mr-2 h-4 w-4" /> Contributor Guide
              </a>
            </Button>
          )}
        </div>
      </div>

      {sortedYears.length > 0 ? (
        <Tabs
          defaultValue={sortedYears[0]}
          className="grow flex flex-col overflow-hidden">
          <TabsList className="shrink-0 w-full">
            {sortedYears.map(year => (
              <TabsTrigger key={year} value={year}>
                {year}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="grow overflow-y-auto mt-4 pr-2">
            {sortedYears.map(year => (
              <TabsContent key={year} value={year} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectsByYear[year].map((project, index) => (
                    <Card key={index} className="flex flex-col">
                      <CardHeader>
                        <CardTitle className="text-base">
                          {project.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grow flex flex-col">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {project.short_description}
                        </p>
                        <div className="grow" />
                        <p className="text-sm font-medium mt-4">
                          Student: {project.student_name}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {project.project_url && (
                            <Button asChild size="sm" variant="secondary">
                              <a
                                href={project.project_url}
                                target="_blank"
                                rel="noopener noreferrer">
                                <LinkIcon className="mr-2 h-4 w-4" />
                                Project Page
                              </a>
                            </Button>
                          )}
                          {project.code_url && (
                            <Button asChild size="sm" variant="secondary">
                              <a
                                href={project.code_url}
                                target="_blank"
                                rel="noopener noreferrer">
                                <Code className="mr-2 h-4 w-4" />
                                Source Code
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      ) : (
        <div className="grow flex items-center justify-center">
          <p className="text-muted-foreground text-center p-8">
            No projects found for this organization.
          </p>
        </div>
      )}
    </>
  );
};

export const ProjectsDialog = ({
  organization,
  open,
  onOpenChange,
}: {
  organization: Organization;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">View Projects</Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{organization.name} - Projects</DialogTitle>
          <DialogDescription className="sr-only">
            Browse the projects offered by {organization.name} in Google Summer
            of Code.
          </DialogDescription>
        </DialogHeader>
        <ProjectsDialogContent
          isOpen={open}
          organizationUUID={organization.uuid}
        />
      </DialogContent>
    </Dialog>
  );
};
