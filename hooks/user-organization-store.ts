import {create} from "zustand";
import {persist} from "zustand/middleware";

interface OrganizationData {
  priority?: string;
  notes?: string;
}

interface OrganizationState {
  organizations: Record<string, OrganizationData>;
  setPriority: (orgName: string, priority: string) => void;
  setNotes: (orgName: string, notes: string) => void;
}

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    set => ({
      organizations: {},
      setPriority: (orgName, priority) =>
        set(state => ({
          organizations: {
            ...state.organizations,
            [orgName]: {...state.organizations[orgName], priority},
          },
        })),
      setNotes: (orgName, notes) =>
        set(state => ({
          organizations: {
            ...state.organizations,
            [orgName]: {...state.organizations[orgName], notes},
          },
        })),
    }),
    {
      name: "organization-store", // unique name for localStorage item
    },
  ),
);
