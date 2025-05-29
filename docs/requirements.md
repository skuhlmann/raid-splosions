# 🧨 Splosions – Project Specification

**Splosions** is a playful, single-page web application built with **Next.js** that lets users upload an image, apply an AI-generated "splosion" effect, and mint the final image as an NFT. The app uses OpenAI for explosion generation, overlays the effect onto the user’s image, and stores the result on IPFS before NFT minting.

---

## 📄 Overview

- **Framework**: Next.js (React-based single page app)
- **Core Flow**:
  1. User uploads an image
  2. App displays image and asks: “Do you want to sploid this?”
  3. If confirmed, an AI-generated pixel explosion with a transparent background is created
  4. The explosion is composited onto the original image
  5. Final image is uploaded to IPFS
  6. User can mint the result as an NFT using the IPFS hash

---

## ⚙️ Functionality Overview

### 🖼️ Image Upload
- File picker and drag-and-drop support
- Preview image before proceeding

### 💥 Splosion Prompt & AI Generation
- Once confirmed, AI generates a **pixel explosion** overlay
- Prompt used to guide image generation:


- AI-generated explosion is composited over uploaded image using a `<canvas>` or equivalent

### 🌐 IPFS Upload
- Final image is uploaded to IPFS using:
- [`AI-ImageUploader-Pinata`](https://github.com/jainiresh/AI-ImageUploader-Pinata)
- IPFS hash is saved for NFT minting

### 🪙 NFT Minting
- User can mint the final image as an NFT
- NFT smart contract requires the **IPFS hash** as an argument

---

## 🧰 Technical Overview

### 🏗 Frontend
- Framework: **Next.js**
- Upload: `react-dropzone` or native file input
- Preview: `<img>` or `<canvas>`
- State management: `useState`, `useReducer`, or `Zustand`

### 🎨 Image Processing
- AI image generation via **OpenAI Image API**
- Output: PNG with transparent background
- Image compositing via:
- HTML5 `<canvas>` API
- Libraries like `fabric.js` or `konva` (optional for advanced manipulation)

### 🧠 AI Integration
- Use OpenAI API with strong prompt guidance
- Example prompt embedded in code or config
- Optional: enable user to choose from sample explosion styles

### ☁️ IPFS Integration
- Use [`AI-ImageUploader-Pinata`](https://github.com/jainiresh/AI-ImageUploader-Pinata)
- Upload composited image
- Retrieve and use returned IPFS hash

### 🪙 NFT Minting
- Interaction via `ethers.js` or `wagmi`
- Smart contract interface:
```solidity
function mintSplodedImage(string memory ipfsHash) public
