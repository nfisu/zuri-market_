// Product catalogue for Zuri Market.
// In a real app this data would live in a database (Postgres, DynamoDB).
// For the capstone the focus is deployment infrastructure, so hardcoded data is fine.

const products = [
  // Jewellery
  { id: "jwl-001", name: "Brass Cuff, Hand-Hammered", category: "jewellery", price: 4800, rating: 4.8, reviews: 142, stock: 23, image: "https://picsum.photos/seed/zuri-jwl-001/600/600", featured: true, artisan: "Adaeze Okeke, Lagos" },
  { id: "jwl-002", name: "Cowrie Drop Earrings", category: "jewellery", price: 2200, rating: 4.6, reviews: 89, stock: 41, image: "https://picsum.photos/seed/zuri-jwl-002/600/600", featured: false, artisan: "Adaeze Okeke, Lagos" },
  { id: "jwl-003", name: "Beaded Waist Chain, Indigo", category: "jewellery", price: 3500, rating: 4.9, reviews: 67, stock: 18, image: "https://picsum.photos/seed/zuri-jwl-003/600/600", featured: true, artisan: "Folake Adeyemi, Ibadan" },
  { id: "jwl-004", name: "Bone & Brass Pendant Necklace", category: "jewellery", price: 6200, rating: 4.7, reviews: 34, stock: 12, image: "https://picsum.photos/seed/zuri-jwl-004/600/600", featured: false, artisan: "Kwame Mensah, Accra" },

  // Ankara fashion
  { id: "fsh-001", name: "Ankara Headwrap, Sunset Print", category: "fashion", price: 2800, rating: 4.7, reviews: 203, stock: 56, image: "https://picsum.photos/seed/zuri-fsh-001/600/600", featured: true, artisan: "Studio Kente, Lagos" },
  { id: "fsh-002", name: "Tailored Ankara Shirt, Indigo Geometry", category: "fashion", price: 7800, rating: 4.8, reviews: 91, stock: 14, image: "https://picsum.photos/seed/zuri-fsh-002/600/600", featured: true, artisan: "Studio Kente, Lagos" },
  { id: "fsh-003", name: "Wrap Dress, Adire Resist-Dye", category: "fashion", price: 9200, rating: 4.9, reviews: 47, stock: 8, image: "https://picsum.photos/seed/zuri-fsh-003/600/600", featured: false, artisan: "Aṣọ Atelier, Abeokuta" },
  { id: "fsh-004", name: "Kente Cloth Tote", category: "fashion", price: 3400, rating: 4.5, reviews: 128, stock: 32, image: "https://picsum.photos/seed/zuri-fsh-004/600/600", featured: false, artisan: "Kwame Mensah, Accra" },

  // Skincare
  { id: "skn-001", name: "Raw Shea Butter, 200g", category: "skincare", price: 1600, rating: 4.9, reviews: 412, stock: 87, image: "https://picsum.photos/seed/zuri-skn-001/600/600", featured: true, artisan: "Northern Co-op, Tamale" },
  { id: "skn-002", name: "African Black Soap Bar", category: "skincare", price: 900, rating: 4.8, reviews: 537, stock: 124, image: "https://picsum.photos/seed/zuri-skn-002/600/600", featured: false, artisan: "Northern Co-op, Tamale" },
  { id: "skn-003", name: "Cold-Pressed Baobab Oil, 50ml", category: "skincare", price: 2400, rating: 4.7, reviews: 188, stock: 43, image: "https://picsum.photos/seed/zuri-skn-003/600/600", featured: true, artisan: "Sahel Botanicals, Dakar" },
  { id: "skn-004", name: "Marula Face Serum", category: "skincare", price: 3800, rating: 4.8, reviews: 76, stock: 29, image: "https://picsum.photos/seed/zuri-skn-004/600/600", featured: false, artisan: "Sahel Botanicals, Dakar" },

  // Homeware
  { id: "hme-001", name: "Bolga Woven Basket, Natural", category: "homeware", price: 5400, rating: 4.7, reviews: 152, stock: 27, image: "https://picsum.photos/seed/zuri-hme-001/600/600", featured: true, artisan: "Bolgatanga Weavers" },
  { id: "hme-002", name: "Mudcloth Throw Pillow Cover", category: "homeware", price: 3200, rating: 4.6, reviews: 94, stock: 38, image: "https://picsum.photos/seed/zuri-hme-002/600/600", featured: false, artisan: "Bamako Textiles, Mali" },
  { id: "hme-003", name: "Calabash Serving Bowl, Hand-Carved", category: "homeware", price: 4100, rating: 4.8, reviews: 61, stock: 19, image: "https://picsum.photos/seed/zuri-hme-003/600/600", featured: true, artisan: "Yoruba Crafts Collective" },
  { id: "hme-004", name: "Soapstone Candle Holder Set", category: "homeware", price: 2900, rating: 4.5, reviews: 73, stock: 44, image: "https://picsum.photos/seed/zuri-hme-004/600/600", featured: false, artisan: "Kisii Stoneworks, Kenya" }
];

const categories = [
  { id: "all", label: "All" },
  { id: "jewellery", label: "Jewellery" },
  { id: "fashion", label: "Fashion" },
  { id: "skincare", label: "Skincare" },
  { id: "homeware", label: "Homeware" }
];

module.exports = { products, categories };