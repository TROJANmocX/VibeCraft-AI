# VibeCraft AI

**VibeCraft AI** is an AI-powered moodboard generation platform that analyzes user sentiment and generates personalized visual and textual content. By interpreting user input through emotion detection algorithms, it curates a digital experience reflecting the user's emotional state, including images, music suggestions, and journaling prompts.

---

## Features

- **Emotion Detection**  
  Detects emotional tone from user-provided text input using advanced language models.

- **AI-Generated Moodboards**  
  Creates personalized visual content aligned with the detected mood using generative image models.

- **Curated Music Suggestions**  
  Recommends music tracks that correspond with the user’s current emotional tone.

- **Journaling Prompts**  
  Provides reflective writing prompts tailored to the identified mood.

- **Modern User Interface**  
  Built using React and Tailwind CSS with responsive design and smooth user experience.

---

## Technologies Used

- **Frontend**: React, Tailwind CSS, Framer Motion  
- **Backend & AI APIs**: OpenAI API, Gemini or Stable Diffusion  
- **Hosting**: Vercel (optional)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/TROJANmocX/VibeCraft-AI.git
cd VibeCraft-AI
2. Install dependencies
bash
Copy
Edit
npm install
3. Set up environment variables
Create a .env.local file at the root of the project and add your API keys:

ini
Copy
Edit
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
4. Start the development server
bash
Copy
Edit
npm run dev
Navigate to http://localhost:3000 in your browser to view the application.

Project Structure
php
Copy
Edit
VibeCraft-AI/
├── app/                  # Application pages and layout
├── components/           # Reusable React components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
├── styles/               # Tailwind global styles
├── types/                # TypeScript type definitions
├── .env.local.example    # Example environment configuration
├── tailwind.config.ts    # Tailwind configuration
└── README.md             # Project documentation
Use Cases
VibeCraft AI is suitable for applications focused on:

Mental wellness and emotional tracking

Creative writing and journaling support

Personal productivity and reflection

Emotion-based content generation platforms

License
This project is licensed under the MIT License.

Contribution & Support
If you find a bug or have suggestions for improvement, feel free to open an issue or submit a pull request.

Acknowledgements
OpenAI

Gemini by Google DeepMind

Framer Motion

Tailwind CSS
