-- SecondStore.ch Database Export
-- Generated: 2025-12-23

-- Drop existing tables if they exist
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS session CASCADE;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(255) NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL REFERENCES categories(id),
    condition VARCHAR(50) NOT NULL,
    image TEXT NOT NULL,
    featured BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    description TEXT,
    dimensions VARCHAR(255),
    weight VARCHAR(255),
    included_items TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    images TEXT[],
    price DECIMAL(10,2),
    discount_price DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create session table for Express sessions
CREATE TABLE IF NOT EXISTS session (
    sid VARCHAR NOT NULL COLLATE "default",
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL,
    PRIMARY KEY (sid)
);
CREATE INDEX IF NOT EXISTS IDX_session_expire ON session (expire);

-- Insert Categories
INSERT INTO categories (id, name, icon) VALUES
('furniture', 'Furniture', 'Sofa'),
('home-living', 'Home & Living', 'Home'),
('electronics', 'Electronics', 'Smartphone'),
('appliances', 'Appliances', 'WashingMachine'),
('office', 'Office & Business', 'Briefcase'),
('garden', 'Garden & Outdoor', 'Flower2'),
('lighting', 'Lighting', 'Lamp'),
('decoration', 'Decoration', 'Palette'),
('kids', 'Baby & Kids', 'Baby'),
('hobbies', 'Hobbies & Collection', 'Gamepad2');

-- Insert Products
INSERT INTO products (id, title, category, condition, image, featured, is_new, description, dimensions, weight, included_items, images, price, discount_price, is_active) VALUES
('6f15513f-2a7c-415a-9e49-f1477a483ad9', 'Modern L Corner Sofa Set', 'furniture', 'used', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop', true, false, 'Slightly used, spotless grey corner sofa set. Selling due to moving.', '280cm x 180cm x 85cm', '120 kg', ARRAY['Corner Sofa', '3 Decorative Pillows'], ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop'], 1299.00, NULL, true),

('17e87249-af22-450d-8e0f-f0749eaebd3e', 'iPhone 14 Pro Max - 256GB', 'electronics', 'new', 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?q=80&w=2070&auto=format&fit=crop', true, true, 'Sealed box, 2 years warranty.', '160.7 x 77.6 x 7.9 mm', '240g', ARRAY['iPhone 14 Pro Max', 'USB-C to Lightning Cable'], ARRAY['https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?q=80&w=2070&auto=format&fit=crop'], 1199.00, NULL, true),

('9a2c2b8d-afba-42d9-8026-bfda0c25bbe9', 'Vintage Wooden Table', 'furniture', 'used', 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=2070&auto=format&fit=crop', false, false, 'Handmade solid wood table. May require restoration.', '120cm x 80cm x 75cm', '25 kg', ARRAY['Wooden Table'], ARRAY['https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=2070&auto=format&fit=crop'], 450.00, 350.00, true),

('d9205a02-259b-4d11-828a-47f7b07c7e22', 'Office Chair', 'office', 'new', 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=2070&auto=format&fit=crop', false, false, 'Ergonomic office chair with lumbar support and adjustable armrests. Breathable mesh back for comfort during long work hours. 360-degree swivel with smooth-rolling casters.', '60cm x 60cm x 110-120cm', '15 kg', ARRAY['Office Chair', 'Assembly Tools'], ARRAY['https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=2070&auto=format&fit=crop'], 349.00, NULL, true),

('d15f1bd8-971b-41f0-94b0-c64cc4264e98', 'Garden Seating Group', 'garden', 'new', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2070&auto=format&fit=crop', false, true, 'Complete outdoor garden seating set including 1 sofa, 2 armchairs, and 1 coffee table. Weather-resistant rattan weave with water-repellent cushions. Perfect for patio or garden entertaining.', 'See description for individual piece dimensions', 'Total: 90 kg', ARRAY['2 Armchairs', '1 Sofa', '1 Coffee Table', 'Cushions'], ARRAY['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2070&auto=format&fit=crop'], 1899.00, 1499.00, true),

('d059b0da-9b9a-4be3-8c1a-aff8713b4fc1', 'Abstract Canvas Art Set', 'decoration', 'new', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800', true, true, 'Beautiful set of 3 abstract canvas paintings. Modern design with gold and blue accents. Perfect for living room or office decoration. Ready to hang with included hardware.', '40 x 60 cm (each)', '2 kg (set)', ARRAY['3 canvas paintings', 'Hanging hardware', 'Protective packaging'], ARRAY['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800'], 199.00, NULL, true),

('0c3d14a7-4841-4e27-a0c1-9848e6495cc7', 'Ceramic Vase Collection', 'decoration', 'new', 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800', false, true, 'Elegant set of 3 ceramic vases in varying sizes. Minimalist Scandinavian design in matte white finish. Perfect for fresh or dried flowers.', '15-25 cm height', '1.5 kg (set)', ARRAY['3 ceramic vases', 'Care instructions'], ARRAY['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800'], 129.00, NULL, true),

('884f5e7a-0874-4b8f-bc79-627f2f73999d', 'Sony WH-1000XM5 Headphones', 'electronics', 'new', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800', true, true, 'Industry-leading noise cancellation headphones. 30 hours battery life, crystal clear calls, and exceptional sound quality. Comfortable for all-day wear.', '7.4 x 8.1 x 10.3 cm', '250 g', ARRAY['Headphones', 'Carrying case', 'USB-C cable', 'Audio cable', 'Airplane adapter'], ARRAY['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800'], 379.00, 299.00, true),

('48c8b700-c495-4904-80ce-1190e1b28947', 'Scandinavian Bookshelf', 'furniture', 'new', 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800', false, true, 'Minimalist 5-tier bookshelf in solid oak wood. Modern Scandinavian design perfect for any room. Easy assembly with included tools.', '80 x 30 x 180 cm', '35 kg', ARRAY['Bookshelf panels', 'Assembly hardware', 'Instructions', 'Allen key'], ARRAY['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800'], 249.00, NULL, true),

('5596c722-d6a4-42fe-b415-1916c4cce926', 'Outdoor Lounge Chair Set', 'garden', 'new', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800', true, false, 'Set of 2 weather-resistant lounge chairs with cushions. Aluminum frame with teak wood armrests. UV-resistant fabric in natural beige color.', '180 x 70 x 35 cm (each)', '15 kg (each)', ARRAY['2 lounge chairs', '2 cushion sets', 'Weather covers', 'Assembly instructions'], ARRAY['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800'], 599.00, NULL, true),

('15015132-e8ea-452d-b0f3-b5e1807b7726', 'Beko Fridge A++', 'appliances', 'used', 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?q=80&w=2070&auto=format&fit=crop', true, false, 'Energy-efficient A++ rated refrigerator with 350L capacity. Features frost-free technology, fresh zone drawer, and adjustable glass shelves. Digital temperature control for precise cooling.', '185cm x 70cm x 75cm', '85 kg', ARRAY['Refrigerator', 'Ice Tray'], ARRAY['https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?q=80&w=2070&auto=format&fit=crop'], 799.00, NULL, true),

('c17520da-6185-4afc-9bf5-9570fa628038', 'Professional DSLR Camera Kit', 'hobbies', 'used', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800', true, false, 'Canon EOS 5D Mark IV with 24-70mm f/2.8 lens. Professional-grade camera in excellent condition. Low shutter count of 15,000. Includes original box and accessories.', '15.1 x 11.6 x 7.6 cm', '890 g (body)', ARRAY['Camera body', '24-70mm lens', '2 batteries', 'Charger', 'Camera strap', 'Original box'], ARRAY['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'], 1499.00, NULL, true),

('b4516f93-68f6-4c8e-b064-0f0c05019de5', 'Complete Chess Set Deluxe', 'hobbies', 'new', 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800', false, true, 'Handcrafted wooden chess set with weighted pieces. Tournament-size board with felt bottom pieces. Beautiful walnut and maple wood finish.', '50 x 50 cm board', '3.5 kg', ARRAY['Chess board', '32 chess pieces', 'Velvet storage bag', 'Rules booklet'], ARRAY['https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800'], 89.00, NULL, true),

('46ef57c8-fbda-4f48-9bf1-85e760ee8dcb', 'Luxury Bedding Set King', 'home-living', 'new', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800', true, true, 'Premium Egyptian cotton 400 thread count bedding set. Includes duvet cover, fitted sheet, and 4 pillowcases. Soft sateen weave in elegant ivory color.', 'King size', '2.5 kg', ARRAY['Duvet cover', 'Fitted sheet', '4 pillowcases', 'Laundry bag'], ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'], 179.00, 129.00, true),

('21c7745f-13a7-407a-b76e-2de5fb802994', 'Smart Robot Vacuum Cleaner', 'home-living', 'new', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', false, true, 'Advanced robot vacuum with LiDAR navigation and mopping function. 3-hour runtime, auto-recharge, and app control. Works with Alexa and Google Home.', '35 x 35 x 9.5 cm', '3.7 kg', ARRAY['Robot vacuum', 'Charging dock', 'Mopping attachment', '2 dust bags', 'Side brushes'], ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'], 449.00, NULL, true),

('7d221d8f-9130-43b2-a90c-a2844e7a0601', 'Wooden Montessori Play Kitchen', 'kids', 'new', 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800', true, true, 'Beautiful handcrafted wooden play kitchen. Features working doors, knobs, and storage. Non-toxic paint in soft pastel colors. Perfect for ages 3+.', '75 x 30 x 90 cm', '18 kg', ARRAY['Kitchen unit', 'Play accessories set', 'Assembly hardware', 'Instructions'], ARRAY['https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800'], 159.00, NULL, true),

('0c6c3514-11a2-44c2-ba8e-c00cd5869379', 'Electric Ride-On Car Mercedes', 'kids', 'used', 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=800', true, false, 'Licensed Mercedes-Benz ride-on car for kids. Working headlights, music player, and remote control for parents. Suitable for ages 2-6.', '110 x 65 x 50 cm', '17 kg', ARRAY['Ride-on car', 'Remote control', 'Charger', 'User manual'], ARRAY['https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=800'], 299.00, 249.00, true),

('4a6a4710-d999-4163-952b-789cdbf48df8', 'Smart LED Floor Lamp', 'lighting', 'new', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800', false, true, 'Modern smart floor lamp with adjustable color temperature and brightness. Voice control compatible. Minimalist design in brushed aluminum finish.', '25 x 25 x 165 cm', '4.5 kg', ARRAY['Floor lamp', 'LED bulb', 'Remote control', 'User manual'], ARRAY['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800'], 129.00, NULL, true),

('01b71a77-71b2-4ec7-bc11-001b3be095ee', 'Standing Desk Electric', 'office', 'new', 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800', true, true, 'Electric height-adjustable standing desk. Memory presets for your preferred heights. Solid bamboo top with black steel frame. Supports up to 120kg.', '140 x 70 x 65-130 cm', '42 kg', ARRAY['Desk top', 'Frame assembly', 'Motor unit', 'Control panel', 'Cable management tray'], ARRAY['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800'], 549.00, NULL, true);

-- Insert Newsletter Subscribers
INSERT INTO newsletter_subscribers (id, email, is_active) VALUES
('96a4d8c5-060f-45b1-926a-0c95a70f91fa', 'emirsimseekk@gmail.com', true);

-- Create default admin user (password: admin123)
INSERT INTO users (id, username, password) VALUES
('admin-user-id', 'admin', '$2b$10$qF.nMl4uxlqpmKbVXPxwMeaJJjGFvY0k8kqpT.YpN8tVfvnGdDPGy');

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO secondstore_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO secondstore_admin;
