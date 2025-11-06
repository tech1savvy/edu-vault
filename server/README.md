# EduVault Server

This is the backend server for EduVault, a platform for managing educational and professional records.

## Tech Stack

- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Sequelize](https://sequelize.org/)
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** [Joi](https://joi.dev/)
- **Logging:** [Winston](https://github.com/winstonjs/winston) & [Morgan](https://github.com/expressjs/morgan)
- **Environment Variables:** [dotenv](https://github.com/motdotla/dotenv)

## Getting Started

Follow these steps to set up and run the EduVault server locally.

### Prerequisites

- Node.js (v18 or higher recommended)
- PostgreSQL

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd EduVault/server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Configuration

1.  **Create a `.env` file:**
    Create a file named `.env` in the `server/` directory by copying the example file:

    ```bash
    cp .env.example .env
    ```

2.  **Edit the `.env` file:**
    Open the `.env` file and add your PostgreSQL database credentials and a JWT secret. Replace the placeholder values with your actual information.

    A new `.env.example` file has been created for you.

### Database Setup

1.  **Create the database:**
    Ensure your PostgreSQL server is running and then run the following command to create the database specified in your `.env` file:

    ```bash
    npx sequelize-cli db:create
    ```

2.  **Run database migrations:**
    This command will create all the necessary tables in your database.

    ```bash
    npx sequelize-cli db:migrate
    ```

3.  **Seed sample data (Optional):**
    To populate your database with some initial sample data, run:
    ```bash
    npx sequelize-cli db:seed:all
    ```

### Running the Server

- **For development (with nodemon):**

  ```bash
  npm run dev
  ```

  This will start the server and automatically restart it when file changes are detected.

- **For production:**
  ```bash
  npm start
  ```

### Seeded Data

If you ran the seeder, the following user account will be created:

- **Email:** `student@sexample.com`
- **Password:** `password123`

