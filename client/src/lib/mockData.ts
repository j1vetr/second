export interface Product {
  id: string;
  title: string;
  category: string;
  condition: 'new' | 'used'; // sıfır | 2.el
  image: string;
  featured?: boolean;
  isNew?: boolean;
  description?: string;
}

export const CATEGORIES = [
  { id: 'furniture', name: 'Mobilya', icon: 'Sofa' },
  { id: 'home-living', name: 'Ev & Yaşam', icon: 'Home' },
  { id: 'electronics', name: 'Elektronik', icon: 'Smartphone' },
  { id: 'appliances', name: 'Beyaz Eşya', icon: 'WashingMachine' },
  { id: 'office', name: 'Ofis & İş', icon: 'Briefcase' },
  { id: 'garden', name: 'Bahçe & Outdoor', icon: 'Flower2' },
  { id: 'lighting', name: 'Aydınlatma', icon: 'Lamp' },
  { id: 'decoration', name: 'Dekorasyon', icon: 'Palette' },
  { id: 'kids', name: 'Bebek & Çocuk', icon: 'Baby' },
  { id: 'hobbies', name: 'Hobi & Koleksiyon', icon: 'Gamepad2' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Modern L Köşe Koltuk Takımı',
    category: 'furniture',
    condition: 'used',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop',
    featured: true,
    description: 'Az kullanılmış, lekesiz gri köşe koltuk takımı. Taşınma nedeniyle satılık.'
  },
  {
    id: '2',
    title: 'iPhone 14 Pro Max - 256GB',
    category: 'electronics',
    condition: 'new',
    image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?q=80&w=2070&auto=format&fit=crop',
    featured: true,
    isNew: true,
    description: 'Kapalı kutu, 2 yıl garantili.'
  },
  {
    id: '3',
    title: 'Vintage Ahşap Masa',
    category: 'furniture',
    condition: 'used',
    image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=2070&auto=format&fit=crop',
    description: 'El yapımı masif ahşap masa. Restorasyon gerektirebilir.'
  },
  {
    id: '4',
    title: 'Samsung 4K Smart TV 55"',
    category: 'electronics',
    condition: 'used',
    image: 'https://images.unsplash.com/photo-1593784991095-a20506948430?q=80&w=2070&auto=format&fit=crop',
    description: '1 yıllık, sorunsuz çalışıyor. Kutusu mevcut.'
  },
  {
    id: '5',
    title: 'Beko Buzdolabı A++',
    category: 'appliances',
    condition: 'used',
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?q=80&w=2070&auto=format&fit=crop',
    featured: true
  },
  {
    id: '6',
    title: 'Ofis Çalışma Koltuğu',
    category: 'office',
    condition: 'new',
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '7',
    title: 'Bahçe Oturma Grubu',
    category: 'garden',
    condition: 'new',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2070&auto=format&fit=crop',
    isNew: true
  },
  {
    id: '8',
    title: 'Modern Avize',
    category: 'lighting',
    condition: 'new',
    image: 'https://images.unsplash.com/photo-1513506003011-3b03c8e31092?q=80&w=2070&auto=format&fit=crop'
  }
];
