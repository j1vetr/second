export interface Product {
  id: string;
  title: string;
  category: string;
  condition: 'new' | 'used'; // new | used
  image: string;
  featured?: boolean;
  isNew?: boolean;
  description?: string;
  dimensions?: string;
  weight?: string;
  includedItems?: string[];
}

export const CATEGORIES = [
  { id: 'furniture', name: 'Furniture', icon: 'Sofa' },
  { id: 'home-living', name: 'Home & Living', icon: 'Home' },
  { id: 'electronics', name: 'Electronics', icon: 'Smartphone' },
  { id: 'appliances', name: 'Appliances', icon: 'WashingMachine' },
  { id: 'office', name: 'Office & Business', icon: 'Briefcase' },
  { id: 'garden', name: 'Garden & Outdoor', icon: 'Flower2' },
  { id: 'lighting', name: 'Lighting', icon: 'Lamp' },
  { id: 'decoration', name: 'Decoration', icon: 'Palette' },
  { id: 'kids', name: 'Baby & Kids', icon: 'Baby' },
  { id: 'hobbies', name: 'Hobbies & Collection', icon: 'Gamepad2' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Modern L Corner Sofa Set',
    category: 'furniture',
    condition: 'used',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop',
    featured: true,
    description: 'Slightly used, spotless grey corner sofa set. Selling due to moving.',
    dimensions: '280cm x 180cm x 85cm',
    weight: '120 kg',
    includedItems: ['Corner Sofa', '3 Decorative Pillows']
  },
  {
    id: '2',
    title: 'iPhone 14 Pro Max - 256GB',
    category: 'electronics',
    condition: 'new',
    image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?q=80&w=2070&auto=format&fit=crop',
    featured: true,
    isNew: true,
    description: 'Sealed box, 2 years warranty.',
    dimensions: '160.7 x 77.6 x 7.9 mm',
    weight: '240g',
    includedItems: ['iPhone 14 Pro Max', 'USB-C to Lightning Cable']
  },
  {
    id: '3',
    title: 'Vintage Wooden Table',
    category: 'furniture',
    condition: 'used',
    image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=2070&auto=format&fit=crop',
    description: 'Handmade solid wood table. May require restoration.',
    dimensions: '120cm x 80cm x 75cm',
    weight: '25 kg',
    includedItems: ['Wooden Table']
  },
  {
    id: '4',
    title: 'Samsung 4K Smart TV 55"',
    category: 'electronics',
    condition: 'used',
    image: 'https://images.unsplash.com/photo-1593784991095-a20506948430?q=80&w=2070&auto=format&fit=crop',
    description: '1 year old, works perfectly. Box available.',
    dimensions: '1232.1 x 708.8 x 25.7 mm',
    weight: '15.5 kg',
    includedItems: ['TV', 'Remote Control', 'Power Cable']
  },
  {
    id: '5',
    title: 'Beko Fridge A++',
    category: 'appliances',
    condition: 'used',
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?q=80&w=2070&auto=format&fit=crop',
    featured: true,
    dimensions: '185cm x 70cm x 75cm',
    weight: '85 kg',
    includedItems: ['Refrigerator', 'Ice Tray']
  },
  {
    id: '6',
    title: 'Office Chair',
    category: 'office',
    condition: 'new',
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=2070&auto=format&fit=crop',
    dimensions: '60cm x 60cm x 110-120cm',
    weight: '15 kg',
    includedItems: ['Office Chair', 'Assembly Tools']
  },
  {
    id: '7',
    title: 'Garden Seating Group',
    category: 'garden',
    condition: 'new',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2070&auto=format&fit=crop',
    isNew: true,
    dimensions: 'See description for individual piece dimensions',
    weight: 'Total: 90 kg',
    includedItems: ['2 Armchairs', '1 Sofa', '1 Coffee Table', 'Cushions']
  },
  {
    id: '8',
    title: 'Modern Chandelier',
    category: 'lighting',
    condition: 'new',
    image: 'https://images.unsplash.com/photo-1513506003011-3b03c8e31092?q=80&w=2070&auto=format&fit=crop',
    dimensions: '60cm Diameter x 80cm Height',
    weight: '4 kg',
    includedItems: ['Chandelier', 'Mounting Kit', 'LED Bulbs']
  }
];
