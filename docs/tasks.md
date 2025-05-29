# 🧨 Splosions – Build Tasks Plan

This document outlines all steps required to build the **Splosions** web app — a playful AI + NFT experience built in Next.js. Each task is atomic, testable, and focused on a single responsibility.

---

## 🧱 Project Setup

### ✅ Task 1: Initialize Next.js App
- Create a new app with TypeScript:
  ```bash
  npx create-next-app@latest splosions --typescript

## 🖼 Image Upload and Preview
### ✅ Task 2: Add Image Upload Component
- Use a <input type="file"> or react-dropzone
- Accept only image formats: .jpg, .jpeg, .png
- Store the selected file in component state

### ✅ Task 3: Display Uploaded Image
- Preview the uploaded image using an <img> tag or <canvas>
- Ensure the image maintains aspect ratio and fits inside a container
- Allow image replacement or reset

## ❓ Splosion Confirmation
### ✅ Task 4: Add "Do You Want to Sploid This?" Prompt
- After an image is uploaded, show a confirmation message:
- "Do you want to sploid this?"
- Add a button to trigger splosion generation

## 🎨 AI Splosion Generation
### ✅ Task 5: Generate Explosion Image via OpenAI API (with Image Analysis)

**Goal:**  
Generate a pixelated explosion using OpenAI's image generation API, with the style or context influenced by the user's uploaded image.

---

#### 🧩 Steps:

1. **Send the uploaded image to GPT-4 Vision**
   - Use the `gpt-4-vision-preview` model.
   - Prompt:
     ```
     Describe this image in one sentence. Focus on visual features and scene content.
     ```
   - Store the returned description (e.g., “A pixel art landscape with a spaceship hovering over a desert.”)

2. **Compose the explosi**


### ✅ Task 6: Overlay Explosion onto Uploaded Image
- Use <canvas> to:
- Draw the uploaded image
- Overlay the explosion image
- Export the result as a new PNG
- Store the final composited image in state

## ☁️ IPFS Upload
### ✅ Task 7: Upload Composite Image to IPFS
- Use AI-ImageUploader-Pinata
- Upload the final PNG to IPFS
- Save the returned IPFS hash for minting

## 🪙 NFT Minting
### ✅ Task 8: Connect Wallet
- Use wagmi 
- Let the user connect a MetaMask
- Display the wallet address in the UI

## ✅ Task 9: Call Smart Contract to Mint NFT
- Interact with an NFT smart contract that has:
```
function mintSplodedImage(string memory ipfsHash) public
```
- Pass in the IPFS hash as the argument
- Confirm transaction and show result

## 🧪 Testing + UX Polish
### ✅ Task 10: Add Status and Feedback Messages
- Show progress/loading states for:
- AI image generation
- IPFS upload
- NFT minting
- Show error messages if anything fails
- Show success messages when actions complete

### ✅ Task 11: Add Reset / Start Over Button
- Add a “Start Over” or “Reset” button
- Clear all app state and return to initial screen