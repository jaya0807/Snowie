# 🤖 Human Following Robot - Architecture Workflow

This document outlines the end-to-end hardware and software pipeline for the Human Following Robot, running strictly via local computer vision and ESP32 hardware actuation.

```mermaid
graph TD
    classDef perception fill:#e1f5fe,stroke:#0288d1,stroke-width:2px;
    classDef decision fill:#fff3e0,stroke:#f57c00,stroke-width:2px;
    classDef actuation fill:#e8f5e9,stroke:#388e3c,stroke-width:2px;
    classDef safety fill:#ffebee,stroke:#d32f2f,stroke-width:3px,stroke-dasharray: 5 5,color:#c62828;

    %% -------------------------
    %% 1. PERCEPTION ZONE
    %% -------------------------
    subgraph PERCEPTION [PERCEPTION ZONE: Vision]
        Cam[📱 Smartphone IP Webcam<br>Mounted on Robot]
        Laptop[💻 Laptop / Python Vision System]
        MP[🧠 MediaPipe Pose Landmarker Lite]
        Detect[👤 Human Position & Distance<br>Cx (Horizontal) & Height Ratio]
    end

    Cam -- "Wi-Fi (Requests /shot.jpg)" --> Laptop
    Laptop --> MP
    MP -- "Nose, Shoulders, Hips" --> Detect

    %% -------------------------
    %% 2. DECISION ZONE
    %% -------------------------
    subgraph DECISION [DECISION ZONE: Control Logic]
        PD[🎛️ PD Following Controller]
        
        subgraph Logic [Decision Cases]
            direction TB
            L1[Person far + centered → Move forward]
            L2[Person far + off-center → Steer toward person]
            L3[Person close + centered → Stop / target reached]
            L4[Person too close + off-center → Rotate in place]
            L5[Person too close → Stop forward movement]
        end
        
        Map[⚙️ Motor Mapping<br>-255 to +255 speed range]
    end

    Detect --> PD
    PD -.-> Logic
    PD --> Map

    %% -------------------------
    %% 3. ACTUATION ZONE
    %% -------------------------
    subgraph ACTUATION [ACTUATION ZONE: Hardware Actuation]
        UDP[📶 UDP / Wi-Fi<br>Port: 4210]
        ESP[⚡ ESP32 Microcontroller]
        BTS[🔌 2x BTS7960 Motor Drivers]
        Motors[⚙️ DC Motors]
        Robot[🏎️ Differential Drive Robot]
        Action[🎯 Human Following Movement]
        
        Watchdog([🛡️ Communication Watchdog<br>500 ms Timeout Limit])
    end

    Map -- "Low-Latency Command (e.g., 120,80)" --> UDP
    UDP --> ESP
    
    %% SAFETY LOOP
    Watchdog -.->|Wi-Fi failure / No UDP packet| ESP
    ESP -.->|Emergency Stop / Disable Drivers| BTS

    ESP -- "20 kHz PWM Signals" --> BTS
    BTS -- "High Current Power" --> Motors
    Motors --> Robot
    Robot --> Action

    %% Apply Styles
    class PERCEPTION perception
    class DECISION decision
    class ACTUATION actuation
    class Watchdog safety
```
