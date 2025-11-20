import {useMemo} from "react";

import {Button} from "@/components/ui/button";
import {useOrganizationStore} from "@/hooks/user-organization-store";

export const ExportButton = () => {
  const organizations = useOrganizationStore(state => state.organizations);

  const data = useMemo(
    () =>
      Object.entries(organizations).map(([orgName, orgData]) => ({
        organization: orgName,
        priority: orgData.priority || "",
        notes: orgData.notes || "",
      })),
    [organizations],
  );

  if (!data || data.length === 0) {
    return null;
  }

  const handleExport = () => {
    const csvContent = [
      Object.keys(data[0]).join(","),
      ...data.map(row =>
        Object.values(row)
          .map(value => value.replace(/\n/g, "/"))
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "organizations.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return <Button onClick={handleExport}>Export to CSV</Button>;
};
