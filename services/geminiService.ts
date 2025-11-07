
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiSearchResponse, Video } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    detectedLanguage: {
      type: Type.STRING,
      description: "The detected language of the user's query (e.g., 'Spanish').",
    },
    translatedQuery: {
      type: Type.STRING,
      description: "The user's query translated into English.",
    },
    videos: {
      type: Type.ARRAY,
      description: "An array of 12 realistic YouTube video search results.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.STRING,
            description: "A unique identifier for the video, like a standard YouTube video ID.",
          },
          title: {
            type: Type.STRING,
            description: "The title of the video.",
          },
          channelName: {
            type: Type.STRING,
            description: "The name of the YouTube channel that uploaded the video.",
          },
          views: {
            type: Type.STRING,
            description: "The number of views, formatted as a string (e.g., '1.2M views').",
          },
          uploadDate: {
            type: Type.STRING,
            description: "How long ago the video was uploaded (e.g., '2 weeks ago').",
          },
        },
        required: ["id", "title", "channelName", "views", "uploadDate"],
      },
    },
  },
  required: ["detectedLanguage", "translatedQuery", "videos"],
};

export const translateAndSearch = async (query: string): Promise<GeminiSearchResponse> => {
  try {
    const prompt = `
      You are a YouTube search simulation API. A user has provided the following search query: "${query}".

      Your tasks are:
      1. Auto-detect the language of the query.
      2. Translate the query into English.
      3. Based on the English translation, generate a list of 12 realistic-looking YouTube video search results. Each result must include a unique ID, title, channel name, view count (e.g., '2.3M views'), and upload date (e.g., '3 months ago').
      
      Return ONLY a JSON object that adheres to the provided schema. Do not include any other text, markdown formatting, or explanations.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedResponse: GeminiSearchResponse = JSON.parse(jsonString);

    // Add placeholder thumbnail URLs
    const videosWithThumbnails: Video[] = parsedResponse.videos.map((video, index) => ({
      ...video,
      thumbnailUrl: `https://picsum.photos/seed/${video.id}/480/270`,
    }));

    return { ...parsedResponse, videos: videosWithThumbnails };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to fetch video results. Please try again.");
  }
};
