import {create} from "zustand";
import {persist} from "zustand/middleware";

import type {Priority} from "@/types";

interface OrganizationData {
  isBookmarked: boolean;
  priority?: Priority;
  notes?: string;
}

interface OrganizationState {
  organizations: Record<string, OrganizationData>;
  addBookmark: (orgName: string) => void;
  removeBookmark: (orgName: string) => void;
  toggleBookmark: (orgName: string) => void;
  isBookmarked: (orgName: string) => boolean;
  setPriority: (orgName: string, priority: Priority) => void;
  setNotes: (orgName: string, notes: string) => void;
}

// Migrate old localStorage data to new Zustand format
const migrateOldData = () => {
  // Check if we're in browser environment
  if (typeof window === "undefined") return;

  const oldBookmarks = localStorage.getItem("bookmarkedOrgs");
  const oldOrgStore = localStorage.getItem("organization-store");
  const newStore = localStorage.getItem("organizations-store");

  // Only migrate if new store doesn't exist yet
  if (!newStore && (oldBookmarks || oldOrgStore)) {
    try {
      const organizations: Record<string, OrganizationData> = {};

      // Migrate old organization data
      if (oldOrgStore) {
        const oldOrgData = JSON.parse(oldOrgStore);
        if (oldOrgData.state?.organizations) {
          Object.entries(oldOrgData.state.organizations).forEach(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ([key, value]: [string, any]) => {
              organizations[key] = {
                isBookmarked: false,
                priority: value.priority,
                notes: value.notes,
              };
            },
          );
        }
      }

      // Migrate old bookmarks
      if (oldBookmarks) {
        const bookmarkedOrgs = JSON.parse(oldBookmarks);
        bookmarkedOrgs.forEach((orgName: string) => {
          if (organizations[orgName]) {
            organizations[orgName].isBookmarked = true;
          } else {
            organizations[orgName] = {isBookmarked: true};
          }
        });
      }

      const newStoreData = {
        state: {organizations},
        version: 1,
      };

      localStorage.setItem("organizations-store", JSON.stringify(newStoreData));
      localStorage.removeItem("bookmarkedOrgs");
      localStorage.removeItem("organization-store");
      localStorage.removeItem("bookmarked-orgs");
    } catch (error) {
      console.error("Failed to migrate organization data:", error);
    }
  }
};

// Run migration before creating store (only in browser)
if (typeof window !== "undefined") {
  migrateOldData();
}

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set, get) => ({
      organizations: {},

      addBookmark: orgName =>
        set(state => ({
          organizations: {
            ...state.organizations,
            [orgName]: {...state.organizations[orgName], isBookmarked: true},
          },
        })),

      removeBookmark: orgName =>
        set(state => ({
          organizations: {
            ...state.organizations,
            [orgName]: {...state.organizations[orgName], isBookmarked: false},
          },
        })),

      toggleBookmark: orgName => {
        const isCurrentlyBookmarked = get().isBookmarked(orgName);
        if (isCurrentlyBookmarked) {
          get().removeBookmark(orgName);
        } else {
          get().addBookmark(orgName);
        }
      },

      isBookmarked: orgName => {
        return get().organizations[orgName]?.isBookmarked ?? false;
      },

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
      name: "organizations-store",
      version: 1,
    },
  ),
);
