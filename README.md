# Fall Risk Software

Welcome to the Fall Risk Software repository. This project aims to assess, monitor, and analyze fall risks in patients using hardware sensors and a comprehensive software platform.

## Project Structure

This repository is organized into three main components:

- **`omni-front-end/`**: The frontend user interface, built with React and Vite. It contains dashboards for both patients and administrators/clinicians to view real-time assessments, heatmaps, and historical data.
- **`omni-back-end/`**: The backend services, structured into specific microservices (e.g., `ingest-service`, `platform-service`, `serial-bridge`) to handle data ingestion from hardware sensors, processing, and serving APIs to the frontend.
- **`hardware-prototypes/`**: Documentation and code related to the physical sensor hardware prototypes used for data collection.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Running the Frontend

To run the frontend application locally:

1. Navigate to the frontend directory:
   ```bash
   cd omni-front-end
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

### Running the Backend

The backend is composed of multiple services. For detailed instructions, refer to the README files within each specific service directory under `omni-back-end/`.

## Documentation

Additional comprehensive documentation and technical requirements (in Thai) can be found in the root directory:
- `FALL_RISK_SOFTWARE_YEAR2_TH.md`
- `FALL_RISK_TOR_BUDGET_YEAR1_TH.md`
- `FALL_RISK_TOR_REVISED_TH.md`
- `SENSOR_BUDGET_TH.md`
- `SESSION_RECORDING_DOC.md`
- `system_workflow.md`

## License
[Insert License Here - if applicable]
