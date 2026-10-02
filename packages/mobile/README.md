# AgentOffice Mobile

React Native (Expo) companion app for AgentOffice. Connects to the Colyseus server and lets you
watch agents, chat with the office, and assign tasks from your phone.

## Run

```bash
# 1. start the server from the repo root
npm run start --workspace=@agent-office/server

# 2. start the mobile app
cd packages/mobile
npm install
npx expo start
```

Open it in Expo Go (scan the QR code) or an emulator, then enter the server address on the
connect screen: `ws://<your-computer-LAN-IP>:3000` for a real device, `ws://10.0.2.2:3000`
for the Android emulator, or `ws://localhost:3000` for the iOS simulator.
