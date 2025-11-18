export type Year = {
  num_projects: number;
  projects_url: string;
};

export type Organization = {
  category: string;
  description: string;
  name: string;
  technologies: string[];
  image_url: string;
  image_background_color: string;
  topics: string[];
  url: string;
  years: Record<`_${number}`, Year | null>;
  uuid: string;
};

export interface Project {
  title: string;
  short_description: string;
  description: string;
  student_name: string;
  code_url: string;
  project_url: string;
}

export interface OrganizationDetails extends Omit<Organization, "years"> {
  years: Record<`_${number}`, OrganizationYearData | null>;
  irc_channel?: string;
  mailing_list?: string;
  ideas_url?: string;
  guide_url?: string;
  contact_email?: string;
}

export interface OrganizationYearData {
  num_projects: number;
  projects_url?: string;
  projects?: Project[];
}

export interface ChartData {
  year: string;
  projects: number;
  projectsUrl?: string;
}

// Types for virtual list
export type SectionHeader = {
  type: "header";
  title: string;
  isCollapsed: boolean;
};

export type OrganizationItem = {
  type: "organization";
  data: Organization & {chartData: ChartData[]; displayIndex: number};
};

export type VirtualListItem = SectionHeader | OrganizationItem;
