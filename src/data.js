// All site content lives here so it can be updated without touching layout code.

export const profile = {
  name: "Temi Otun",
  school: "Computing Science (AI) · University of Alberta",
  email: "Otun226@gmail.com",
  github: "https://github.com/temii70",
  linkedin: "https://www.linkedin.com/in/temi-otun-297801250/",
  resume: "/TemiOtunresume.pdf",
};

export const highlights = [
  { value: "94%", label: "recall on a patent-pending fraud detection system at RBC" },
  { value: "47%", label: "lower error forecasting temperature, months out" },
  { value: "ICASSP '25", label: "research on hearing early dementia in speech" },
];

export const experience = [
  {
    role: "Data Engineering Intern",
    company: "Royal Bank of Canada · Amplify",
    location: "Vancouver, BC",
    dates: "summer 2026",
    start: "2026-05",
    short: "rbc",
    points: [
      "Developed a patent-pending fraud detection system combining ML classification with LLM analysis: ==94% recall==, 85% F1, projected to stop ==$18M== in annual fraud losses.",
      "Engineered a cascaded NLP pipeline over 23M+ unstructured text records a year using semantic embeddings, cutting operational costs by ==65%==.",
      "Led experiments across 6+ architectures and tuned ensemble thresholds, lifting precision from ==49% to 77%==.",
    ],
    tags: ["llms", "nlp", "embeddings", "ensembles"],
  },
  {
    role: "Machine Learning Research Intern",
    company: "The Metabolomics Innovation Centre",
    location: "Edmonton, AB",
    dates: "jan – aug 2025",
    start: "2025-01",
    short: "tmic",
    points: [
      "Improved a long-range temperature forecasting system: up to ==47% lower MAE==, 24.3% better on average across a six-year test set.",
      "Built multivariate pipelines over 100+ meteorological features with temporal validation and ensemble ML, beating baselines in ==73% of test years==.",
      "Benchmarked 20+ models, from ARIMA and SARIMA to LSTMs, Transformers, LightGBM and XGBoost.",
    ],
    tags: ["time series", "forecasting", "gradient boosting"],
  },
  {
    role: "Machine Learning Research Assistant",
    company: "University of Alberta",
    location: "Edmonton, AB",
    dates: "sep 2024 – apr 2026",
    start: "2024-09",
    short: "u of a",
    points: [
      "Built a 3-class dementia / MCI detection system from Whisper speech embeddings and ensemble classifiers, contributing to research presented at ==ICASSP 2025==.",
      "Built survival-analysis and clinical prediction pipelines on MIMIC-IV: ==59M+ patient events== across 239K+ patients.",
      "Ran 15+ experiments across speech, ECG and clinical-record data.",
    ],
    tags: ["healthcare", "survival analysis", "speech", "ecg"],
  },
  {
    role: "Data Management Intern",
    company: "InfoStrux",
    location: "Vancouver, BC",
    dates: "jan – may 2024",
    start: "2024-01",
    short: "infostrux",
    points: [
      "Optimized 25+ Snowflake SQL queries, cutting execution time by up to ==60%== for BI dashboards.",
      "Designed staging and curated layers for 3 datasets with a senior data engineer, cutting time-to-insight by ==40%==.",
    ],
    tags: ["snowflake", "sql", "data modeling"],
  },
];

// figure: knn | lottery | kernel | svm | arc (see src/art/Figure.jsx)
export const projects = [
  {
    name: "Local LLM Agent System",
    description:
      "A fully local RAG pipeline (Qwen, Ollama, Docling) with hybrid retrieval and BGE reranking that took top-5 recall from 64% to 86% over 100+ lecture docs. The same model runs an MCP Gmail agent that sent 200+ outreach emails for my student club.",
    tags: ["rag", "agents", "mcp", "ollama"],
    figure: "knn",
    featured: true,
  },
  {
    name: "Event Lottery System",
    description:
      "An Android app built by a seven-person team: waitlists, random draws, QR sign-up, geolocation, and a Gemini pipeline that sorts event tags into 21 categories.",
    tags: ["kotlin", "java", "firebase", "gemini"],
    figure: "lottery",
    featured: true,
  },
  {
    name: "Real-time Emotion Detection",
    description: "A TensorFlow CNN hooked up to OpenCV that reads facial expressions from a live webcam.",
    tags: ["tensorflow", "cnn", "opencv"],
    figure: "kernel",
  },
  {
    name: "Lung Cancer Detection",
    description: "Seven ML algorithms tested on a lung cancer dataset. An SVM won, with 99% recall and 94% accuracy.",
    tags: ["scikit-learn", "svm"],
    figure: "svm",
    link: "https://colab.research.google.com/gist/temii70/b300e9ca79168cc0b1c82c9110a06e56/models.ipynb",
  },
  {
    name: "NBA Chatbot",
    description: "An iOS chatbot you can ask about basketball, backed by a SQL database of 4,800+ players and all 30 teams.",
    tags: ["swift", "sql", "python"],
    figure: "arc",
    link: "https://github.com/temii70/NBAChatbot",
  },
];

export const skills = {
  languages: ["Python", "SQL", "Java", "C"],
  "ml / ai": ["PyTorch", "TensorFlow", "scikit-learn", "Hugging Face", "XGBoost", "LightGBM", "OpenCV"],
  "ai systems": ["LLMs", "RAG", "MCP", "vector search", "local inference"],
  "data & infra": ["PostgreSQL", "Snowflake", "Firebase", "Docker", "Kubernetes", "AWS S3"],
};

export const interests = [
  {
    title: "traveling",
    image: "/traveling.webp",
    text: "The US, France, the UK and Nigeria so far. The Grand Canyon still wins. East Asia and Latin America are next.",
  },
  {
    title: "basketball",
    image: "/bball.png",
    text: "Played for my junior and senior high school teams and still play for fun. Lakers fan, because LeBron.",
  },
  {
    title: "the gym",
    image: "/goodlife.webp",
    text: "Seven years and counting. If I'm not at school or doing research, I'm probably here.",
  },
];
