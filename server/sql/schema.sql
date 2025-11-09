-- Schema for Lending Portal

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL -- student | staff | admin
);

CREATE TABLE equipment (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  condition TEXT,
  quantity INT DEFAULT 1,
  available BOOLEAN DEFAULT TRUE
);

CREATE TABLE requests (
  id SERIAL PRIMARY KEY,
  equipment_id INT REFERENCES equipment(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  quantity INT,
  from_date DATE,
  to_date DATE,
  purpose TEXT,
  status TEXT DEFAULT 'pending', -- pending | approved | rejected | returned
  processed_by INT REFERENCES users(id),
  processed_at TIMESTAMP,
  returned_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed data
INSERT INTO users (name, email, password, role) VALUES
('Alice Student', 'alice@student.school', 'password', 'student'),
('Bob Teacher', 'bob@staff.school', 'password', 'staff'),
('Admin User', 'admin@school', 'password', 'admin');

INSERT INTO equipment (name, category, condition, quantity, available) VALUES
('Basketball Kit', 'Sports', 'Good', 5, TRUE),
('Microscope', 'Lab', 'Fair', 3, TRUE),
('Canon DSLR', 'Media', 'Good', 2, TRUE),
('Violin', 'Music', 'Good', 4, TRUE);
