INSERT INTO users (name, email, password) 
VALUES ('Sally Smith', 'sally@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.' ),
('Zoe Paper', 'zoe@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Rick Rogers', 'rick@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active) 
VALUES (1,'beach front', 'beautiful white sand modern house', 'www.beautybeach-photo-thumbnail.com', 'www.beautybeach-photo-cover', 350, 2, 4, 5, 'Mexico', 'Maripose St', 'New World City', 'British Islands', '1223VS', TRUE ),
(2, 'beach back', 'nice white rock house', 'www.rockhouse-photo-thumbnail.com', 'www.rockhouse-photo-cover', 350, 2, 4, 5, 'Morocco', 'Mon St', 'Mar City', 'Morocco Islands', '1245WZ', TRUE ),
(3, 'beach side', 'new sunny condo', 'www.condo-photo-thumbnail.com', 'www.condo-photo-cover', 350, 2, 4, 5, 'Mexico', 'Maripose St', 'New World City', 'British Islands', '125ML', TRUE );

INSERT INTO reservations ( guest_id, property_id, start_date, end_date)
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews ( guest_id, property_id, reservation_id, rating, message) 
VALUES (1, 1, 1, 4, 'Thank you for the beautiful beachfront'),
(2, 2, 2, 5, 'We had a great stay in a great house'),
(3, 3, 3, 5, 'Thanks for the awesome stay');


