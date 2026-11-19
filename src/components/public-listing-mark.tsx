import { UIIcon } from "@/components/icons";
import type { Company } from "@/lib/portfolio";

type PublicListing = NonNullable<Company["publicListing"]>;

/**
 * A quiet marker for the one position bought on the public markets. At rest it
 * is a small ticker glyph; hovering or focusing its company link morphs the
 * glyph and reveals the listing. Private positions are the default and carry
 * no marker.
 */
export function PublicListingMark({ listing, id }: { listing: PublicListing; id?: string }) {
  return (
    <span className="public-listing-mark" data-public-listing={listing.ticker}>
      <span className="public-listing-mark-icon" aria-hidden="true">
        <UIIcon name="market" />
      </span>
      <span className="public-listing-mark-tip" id={id} role="tooltip">
        Public market · {listing.exchange}: {listing.ticker}
      </span>
    </span>
  );
}
