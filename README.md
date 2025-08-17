📘 PCSIR Smart Network Management AI

A React-based network management system for PCSIR that enables monitoring, control, and AI-powered automation of Cisco devices.
It supports IP-based authorization, VLAN monitoring, AI diagnostics, voice assistant guidance, command execution, log export, and full network hierarchy integration.

✨ Features

🌑 Dark-themed UI with consistent design across all tabs.

🔐 IP-based Authorization:

Unauthorized users → view-only mode with alerts.

Authorized users (on PCSIR IP ranges) → full control.

🌐 Network Tab – Select devices, departments, and view details.

💻 Commands Tab – Run predefined/custom Cisco commands (SSH/SNMP).

📜 Output Tab – Scrollable results with export options.

📂 Export Tab – Save logs/results (CSV, TXT).

🤖 AI Automation Tab – Device scanning, diagnostics, VLAN checks, auto-fix suggestions.

🗣 AI Assistant + Voice Support – Troubleshooting tips & text-to-speech feedback.

📡 Network Hierarchy File (lhr_pcsir_network_details.tsx) – Centralized hierarchy & VLAN data.

🛠 Tech Stack

Frontend: React (strictly enforced)

UI: Tailwind CSS + shadcn/ui components

Networking: SSH / SNMP (Cisco CBS350 24P)

AI Integration: OpenAI API for troubleshooting & suggestions

Voice: Web Speech API (TTS)

Export: CSV / TXT logs

📂 File Structure (Important Parts)
pcsir-smart-network-management-ai/
│── src/
│   ├── components/        # React UI components
│   ├── tabs/              # Tab-wise functionality (Network, Commands, etc.)
│   ├── ai/                # AI logic, voice assistant, VLAN checks
│   ├── utils/             # Authorization & IP detection helpers
│   ├── lhr_pcsir_network_details.tsx  # Network hierarchy file
│── public/                # Static assets
│── package.json
│── README.md

⚙️ Setup & Installation
Prerequisites

Node.js & npm installed

Git installed

Clone Repo
git clone https://github.com/your-username/pcsir-smart-network-management-ai.git
cd pcsir-smart-network-management-ai

Install Dependencies
npm install

Run Development Server
npm run dev

Build for Production
npm run build

🔐 Authorization Logic

Tool auto-detects client IP on load.

Authorized IP Ranges (default):

10.19.10.0

192.168.10.5/24

If unauthorized:

UI visible in read-only mode.

Clicking actions triggers alert: “You are not authorized to perform this action.”

📊 Workflows
Manual Mode

Select device (Core/Controller/AP).

Choose connection method (SSH/SNMP).

Select/enter command.

View results in Output Tab.

Export logs if needed.

AI Automation Mode

Select device.

AI auto-scans for connectivity, config, VLAN issues.

Shows diagnosis + suggested fix.

Auto-fix or manual guidance.

Logs auto-saved & exportable.

📦 Final Deliverables

✅ Fully functional React app with dark-themed tabs.

✅ IP-based authorization with alert messages.

✅ Five-tab structure (Network, Commands, Output, Export, AI Automation).

✅ AI assistant + voice feature working.

✅ VLAN monitoring integrated in AI Automation Tab.

✅ lhr_pcsir_network_details.tsx file with network hierarchy & IPs.

✅ Documentation + deployment-ready build.

👨‍💻 Contributing

Fork the repo

Create your feature branch (git checkout -b feature-name)

Commit changes (git commit -m "Added new feature")

Push branch (git push origin feature-name)

Open a Pull Request
