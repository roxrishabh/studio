# **App Name**: TwinView

## Core Features:

- IoT Data Ingestion: Ingest real-time data from MQTT or HTTP endpoints, simulating devices for development.
- Real-Time Database Storage: Store ingested data in a time-series database for efficient querying and analysis of sensor data. If the message pipeline involves Kafka it can also be incorporated.
- Interactive Map Visualization: Display sensor data on an interactive map using the design specified at https://www.figma.com/design/3FBEII1Q7z9EdbiIUdBMQc/SWE-Project?node-id=0-1&t=jCaakmeqjkiLp8mj-1
- Data Filtering: Filter displayed data based on sensor type, location, or time range using a UI. 
- Anomaly Detection: Detect and flag unusual data points using a tool that analyzes historical sensor data to help determine if an anomalous event has occurred.
- Alerting System: Configure and manage real-time alerts based on sensor data thresholds.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to evoke trust and technological sophistication, while avoiding clichés.
- Background color: Light gray (#ECEFF1) to ensure readability and a modern feel in a light scheme.
- Accent color: Electric purple (#7E57C2) for interactive elements and data visualization.
- Body text: 'Inter' sans-serif font to allow for clarity and readability of displayed sensor data.
- Headlines: 'Space Grotesk' sans-serif font to give a scientific, computerized style.
- Use clear and concise icons to represent sensor types and data categories.
- Responsive layout adapting to different screen sizes and devices. Follow figma prototype https://www.figma.com/design/3FBEII1Q7z9EdbiIUdBMQc/SWE-Project?node-id=0-1&t=jCaakmeqjkiLp8mj-1 for inspiration.
- Subtle transitions and animations to provide feedback on user interactions and data updates.