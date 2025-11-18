import {GSoCDashboard} from "@/components/dashboard";
import Organizations from "@/public/organizations.json";

const getOrganizations = async () => {
  return Organizations;
};

export default async function Page() {
  const organizations = await getOrganizations();
  return <GSoCDashboard data={organizations} />;
}
