# subdao-role-verification

This app is to verify users' nft status and assigns the corresponding roles in discord channel. 
- If users are HeadDAO holder, then they will be assigned HeadDAO Holder on discord channel.
- If users are HeadDAO staker, then they will be assigned HeadDAO Staker on discord channel.

## Discord 

1. Open the terminal
2. Navigate to the discord folder. 
```
$cd ~/subdao-role-verification/discord
```
3. Create .env file
```
$touch .env
```
4. Open .env and setup environment variables
```
BOT_TOKEN = {YOUR_BOT_TOKEN}
BOT_ID = {YOUR_BOT_ID}
VERIFY_CHANNEL_ID = {YOUR_CHANNEL_ID}
FRONTEND_URL = {YOUR_FRONTEND_URL}
```
5. Install dependencies
```
npm i
```
6. Start the server
```
npm run start
```

## Frontend
1. Open the terminal
2. Navigate to the discord folder. 
```
$cd ~/subdao-role-verification/frontend
```
3. Create .env file
```
$touch .env
```
4. Open .env and setup environment variables
```
NEXT_PUBLIC_INFURA_ID = {YOUR_INFURA_ID}
NEXT_PUBLIC_BACKEND_API = {YOUR_BACKEND_URL}
```
5. Install dependencies
```
npm i
```
6. Start the server
```
npm run dev
```
