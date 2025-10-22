# EduVault Server

## Local Development Setup

Follow these steps to set up and run the EduVault server locally.

### Prerequisites

*   Node.js (v18 or higher recommended)
*   PostgreSQL database

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

### Database Configuration and Setup

1.  **Create a `.env` file:**
    Create a file named `.env` in the `server/` directory and add your PostgreSQL database credentials. Replace the placeholder values with your actual database information.

    ```
    DB_USER=your_username
    DB_HOST=your_host
    DB_DATABASE=your_database_name
    DB_PASSWORD=your_password
    DB_PORT=5432
    ```

2.  **Set up the database tables:**
    This script will create all necessary tables in your configured PostgreSQL database.
    ```bash
    npm run setup
    ```

3.  **Seed sample data (Optional):**
    To populate your database with some initial sample data, run:
    ```bash
    npm run seed
    ```

### Running the Server

*   **For development (with nodemon):**
    ```bash
    npm run dev
    ```
    This will start the server and automatically restart it when file changes are detected.

*   **For production:**
    ```bash
    npm start
    ```
    This will start the server in production mode.
