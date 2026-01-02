# FireAlertNX | Industrial IoT Safety Monitor

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![ThingsBoard](https://img.shields.io/badge/IoT-ThingsBoard-blue?style=for-the-badge)

**FireAlert NX** is a progressive web application (PWA) designed for real-time industrial hazard detection. It serves as the frontend control interface for a Raspberry Pi/ESP32-based safety node, visualizing thermal anomalies, gas leaks, and fire alerts with sub-second latency.

![Dashboard Screenshot](/public/screenshot.png)
*(Add a screenshot of your dashboard here)*

##  Key Features

* **Real-Time Data Visualization:** Live streaming of Temperature, Gas (PPM), and Flame sensor data via Recharts.
* **Progressive Web App (PWA):** Fully installable on iOS/Android devices with offline caching capabilities.
* **Persistent Local History:** Uses `localStorage` to maintain client-side data logs and alert history between sessions.
* **Smart Alert System:**
    * **Visual:** Color-coded cards (Blue/Yellow/Red) based on severity.
    * **System:** Toast notifications and browser-native push alerts.
* **Responsive Design:** optimized for both desktop control rooms and mobile field inspection.

## Tech Stack

* **Frontend:** React.js (Vite)
* **Styling:** Tailwind CSS + DaisyUI
* **Charts:** Recharts
* **Icons:** Lucide React
* **IoT Backend:** ThingsBoard Cloud API
* **Deployment:** Vercel / Netlify (Ready)

## Engineering Decisions & Thresholds

To ensure industrial compliance and reduce false positives, sensor thresholds were calibrated based on standard safety protocols:

| Sensor Type | Threshold | Engineering Justification |
| :--- | :--- | :--- |
| **Thermal Heat** | **56°C** | Aligned with **NFPA 72** standards for "Fixed Temperature Heat Detectors" (typically rated at 57°C/135°F). |
| **Gas (MQ-2)** | **250 (Raw)** | Calibrated to **Baseline + 100**. This sets the trigger point above ambient noise but well below the 10% LEL (Lower Explosive Limit). |
| **Flame Sensor** | **Digital (0/1)** | Immediate interrupt-based triggering for critical fire events. |

## Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/firealert-nx.git](https://github.com/yourusername/firealert-nx.git)
    cd firealert-nx
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The app will launch at `http://localhost:5173`.

## How to Install as App (PWA)

1.  Open the dashboard in Chrome or Edge.
2.  Look for the **"Install FireAlert NX"** icon in the address bar.
3.  Click **Install**. The app will now launch as a native standalone application on your device.

---
*Developed by F1: The IDP*