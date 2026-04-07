-- Omnicart User Seeding
INSERT INTO users (id, name, email, password, role, created_date)
VALUES 
    (gen_random_uuid(), 'Titanium Admin', 'admin@gmail.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5Q1CDe7v4xYueAA6QbV0I1f3wWg5G', 'ADMIN', CURRENT_DATE),
    (gen_random_uuid(), 'Titanium Seller', 'seller@gmail.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5Q1CDe7v4xYueAA6QbV0I1f3wWg5G', 'SELLER', CURRENT_DATE),
    (gen_random_uuid(), 'Titanium Customer', 'customer@gmail.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5Q1CDe7v4xYueAA6QbV0I1f3wWg5G', 'CUSTOMER', CURRENT_DATE)
ON CONFLICT (email) DO NOTHING;
