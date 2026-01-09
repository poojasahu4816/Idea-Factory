
import { GoogleGenAI, Type } from "@google/genai";
import { Product, InventoryInsight } from "../types";

export const getInventoryInsights = async (products: Product[]): Promise<InventoryInsight[]> => {
  // Always use process.env.API_KEY directly in the constructor as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const productSummary = products.map(p => ({
    name: p.name,
    stock: p.currentStock,
    min: p.minStock,
    max: p.maxStock,
    location: p.location,
    recentSalesAvg: p.historicalSales.reduce((acc, curr) => acc + curr.quantity, 0) / p.historicalSales.length
  }));

  const prompt = `
    Act as a senior supply chain AI analyst. Analyze the following inventory data and provide actionable optimization insights.
    Identify:
    1. Understock risks (stock near or below minStock relative to lead time).
    2. Overstock risks (stock far exceeding maxStock or low turnover).
    3. Rebalancing opportunities (moving stock between regions).

    Data: ${JSON.stringify(productSummary)}
  `;

  try {
    const response = await ai.models.generateContent({
      // Use gemini-3-pro-preview for complex supply chain analysis tasks
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING, description: 'understock, overstock, or rebalance' },
              productName: { type: Type.STRING },
              severity: { type: Type.STRING, description: 'low, medium, or high' },
              message: { type: Type.STRING },
              action: { type: Type.STRING }
            },
            required: ['id', 'type', 'productName', 'severity', 'message', 'action']
          }
        }
      }
    });

    // Extract text directly from property, not method
    return JSON.parse(response.text?.trim() || '[]');
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

export const generateProductImage = async (productName: string, category: string): Promise<string | null> => {
  // Always use process.env.API_KEY directly in the constructor
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `A professional, high-quality commercial studio photograph of a ${productName} (${category}). The image should be clean, well-lit, with a minimalist professional background, suitable for an e-commerce inventory management system. Sharp focus, high resolution.`;

  try {
    const response = await ai.models.generateContent({
      // Using the default image generation model
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    // Iterate through all parts to find the image part, do not assume it is the first part.
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};
