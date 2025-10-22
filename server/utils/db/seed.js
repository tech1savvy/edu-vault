const pool = require("../../helpers/pool");
const bcrypt = require("bcrypt");

const seed = async () => {
  try {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const userRes = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id",
      ["test@example.com", hashedPassword],
    );
    const userId = userRes.rows[0].id;

    await pool.query(
      "INSERT INTO heading (user_id, name, role, email, phone, location, link) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        userId,
        "John Doe",
        "Software Engineer",
        "john.doe@example.com",
        "123-456-7890",
        "New York, USA",
        "linkedin.com/in/johndoe",
      ],
    );

    await pool.query(
      "INSERT INTO experience (user_id, type, company, role, duration, details) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        userId,
        "Full-time",
        "Google",
        "Software Engineer",
        "2020-Present",
        "Developed and maintained various software.",
      ],
    );

    await pool.query(
      "INSERT INTO education (user_id, institution, degree, fieldOfStudy, duration, details) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        userId,
        "University of XYZ",
        "Master of Science",
        "Computer Science",
        "2018-2020",
        "Specialized in AI and Machine Learning.",
      ],
    );

    await pool.query(
      "INSERT INTO project (user_id, title, description, techStack, timeline, type, collaborators) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        userId,
        "EduVault",
        "A platform for managing educational records.",
        "Node.js, Express, PostgreSQL, React",
        "2023-Present",
        "Web Application",
        "Jane Doe",
      ],
    );

    await pool.query(
      "INSERT INTO skill (user_id, name, level) VALUES ($1, $2, $3)",
      [userId, "JavaScript", "Expert"],
    );

    await pool.query(
      "INSERT INTO achievement (user_id, title, description, date) VALUES ($1, $2, $3, $4)",
      [
        userId,
        "Award for Innovation",
        "Received an award for innovative project design.",
        "2022",
      ],
    );

    await pool.query(
      "INSERT INTO certification (user_id, name, issuer, date, credentialId) VALUES ($1, $2, $3, $4, $5)",
      [
        userId,
        "AWS Certified Developer",
        "Amazon Web Services",
        "2021",
        "ABC123XYZ",
      ],
    );

    console.log("Sample data inserted successfully");
  } catch (error) {
    console.error("Error inserting sample data:", error);
  }
};

seed();
