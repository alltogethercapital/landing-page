/** Company detail keys and links for the LP portal. Safe for client components. */

type PositionLike = {
  company: string;
  vehicleAllocation?: { deployedCompany: string } | null;
};

/** Company the detail view describes. H256 looks through to its deployed company. */
export function lpCompanyKey(position: PositionLike) {
  return position.vehicleAllocation?.deployedCompany ?? position.company;
}

export function lpCompanySlug(companyKey: string) {
  return companyKey.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Portal URL that opens the company drawer, keeping the active tab. */
export function lpCompanyHref(companyKey: string, section?: string) {
  const params = new URLSearchParams();
  if (section && section !== "investments") params.set("section", section);
  params.set("company", lpCompanySlug(companyKey));
  return `/lp?${params.toString()}`;
}
