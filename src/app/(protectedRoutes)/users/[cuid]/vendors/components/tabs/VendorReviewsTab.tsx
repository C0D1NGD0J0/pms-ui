import React from "react";
import { ListItem } from "@components/ListItem";

interface VendorReviewsTabProps {
  // In the future, this could accept vendor data to get real reviews
}

export const VendorReviewsTab: React.FC<VendorReviewsTabProps> = () => {
  return (
    <div className="reviews-tab">
      <h3 style={{ marginBottom: "1.5rem", color: "hsl(194, 66%, 24%)" }}>
        Customer Reviews
      </h3>
      <ListItem
        icon="bx-user"
        title="Property Manager"
        subtitle="Recent Project"
        variant="review"
        rating={5}
        reviewText="Excellent work and professional service. The team was efficient and completed the project on time."
        onAction={() => console.log("View review details")}
        actionIcon="bx-chevron-right"
      />
      <ListItem
        icon="bx-building"
        title="Building Management"
        subtitle="Maintenance Service"
        variant="review"
        rating={4}
        reviewText="Quick response time and quality work. Very satisfied with the service provided."
        onAction={() => console.log("View review details")}
        actionIcon="bx-chevron-right"
      />
    </div>
  );
};

VendorReviewsTab.displayName = "VendorReviewsTab";
