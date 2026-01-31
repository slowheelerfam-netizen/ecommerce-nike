import { db } from "../lib/db";
import { products } from "../lib/db/schema";

async function main() {
  

  const sampleProducts = [
    {
      name: "Nike Air Max 90",
      slug: "nike-air-max-90",
      sku: "SKU-AM90-001",
      description: "Nothing as fly, nothing as comfortable, nothing as proven.",
      price: "130.00",
      images: ["https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/wzitsrb4oucx9xlrr7cdc/air-max-90-mens-shoes-6n3vKB.png"],
    },
    {
      name: "Nike Dunk Low Retro",
      slug: "nike-dunk-low-retro",
      sku: "SKU-DUNK-RETRO-001",
      description: "Created for the hardwood but taken to the streets.",
      price: "115.00",
      images: ["https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b1bcbca4-e853-4df7-b329-5be3c61ee057/dunk-low-retro-mens-shoes-dS9h8h.png"],
    },
    {
      name: "Nike Sportswear Club Fleece",
      slug: "nike-sportswear-club-fleece",
      sku: "SKU-CLUB-FLEECE-001",
      description: "Universally loved for coziness and consistency.",
      price: "60.00",
      images: ["https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/6173a763-827c-443b-9674-8b01c3608930/sportswear-club-fleece-mens-pullover-hoodie-Gw4Nwq.png"],
    },
    {
      name: "Nike Air Force 1 '07",
      slug: "nike-air-force-1-07",
      sku: "SKU-AF1-07-001",
      description: "Durably stitched overlays, clean finishes and the perfect amount of flash.",
      price: "110.00",
      images: ["https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-mens-shoes-jBrhbr.png"],
    },
    {
      name: "Nike Dri-FIT Legend",
      slug: "nike-dri-fit-legend",
      sku: "SKU-DRI-FIT-LEGEND-001",
      description: "Essential layer with odor-resistant finish.",
      price: "30.00",
      images: ["https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/07248882-9f33-4f9e-b765-f938a449d038/dri-fit-legend-mens-training-t-shirt-1317d7.png"],
    },
  ];

  for (const product of sampleProducts) {
    await db.insert(products).values(product);
  }

  process.exit(0);
}

main().catch((err) => {
  
  process.exit(1);
});
