interface ITag {
  name: string;
  description: string;
}

export const tags: Array<ITag> = [
  { name: "Health", description: "Get health status" },
  { name: "Staff Auth", description: "Authentication endpoints for staff" },
  { name: "User Auth", description: "Authentication endpoints for user" },
  { name: "Staff CRUD", description: "CRUD endpoints for staff" },
  { name: "User CRUD", description: "CRUD endpoints for user" },
  { name: "Category", description: "Category endpoints" },
  { name: "Product", description: "Product endpoints" },
  { name: "Order", description: "Order endpoints" },
  { name: "Review", description: "Review endpoints" },
  { name: "Coupon", description: "Coupon endpoints" },
];
