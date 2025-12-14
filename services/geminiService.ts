import { GoogleGenAI, Type } from "@google/genai";
import { BottleData, ReadingResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAuraSomaReading = async (selectedBottles: { [key: number]: BottleData }): Promise<ReadingResult> => {
  const model = "gemini-2.5-flash";

  // Construct a prompt based on the selected bottles
  let promptDetails = "";
  Object.entries(selectedBottles).forEach(([pos, bottle]) => {
    promptDetails += `\nPosition ${pos}: Bottle #${bottle.number} (${bottle.name}) \n`;
    promptDetails += `- Colors: ${bottle.colors.topLabel} / ${bottle.colors.bottomLabel}\n`;
    promptDetails += `- Theme: ${bottle.theme}\n`;
    
    // Add extended details if available
    if (bottle.positivePersonality) promptDetails += `- Positive Personality: ${bottle.positivePersonality}\n`;
    if (bottle.challengePersonality) promptDetails += `- Challenge: ${bottle.challengePersonality}\n`;
    if (bottle.spiritualLevel) promptDetails += `- Spiritual: ${bottle.spiritualLevel}\n`;
  });

  const prompt = `
    你是一位資深的 Aura-Soma 色彩諮詢師，語氣溫柔、清新、充滿療癒感與洞見。
    請根據以下使用者選擇的四個瓶子進行解讀。
    
    選擇的瓶子詳細資訊如下：
    ${promptDetails}

    請用繁體中文回答，結構如下：
    1. 引言：簡短歡迎與整體感覺。
    2. 針對每一個位置（1: 靈魂瓶, 2: 挑戰與禮物, 3:當下, 4: 未來）進行深入淺出的解讀，結合色彩心理學與瓶子的含義。
    3. 總結：給予一句充滿力量的建議或祝福。

    請確保語氣是支持性的、正向的，並且不要過於宿命論，強調使用者的自由意志與覺察。
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            introduction: { type: Type.STRING },
            positions: {
              type: Type.OBJECT,
              properties: {
                1: { type: Type.STRING },
                2: { type: Type.STRING },
                3: { type: Type.STRING },
                4: { type: Type.STRING },
              },
              required: ["1", "2", "3", "4"]
            },
            summary: { type: Type.STRING }
          },
          required: ["introduction", "positions", "summary"]
        }
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response text from Gemini");
    }
    return JSON.parse(text) as ReadingResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback mock response in case of API failure
    return {
      introduction: "連結宇宙的色彩能量，我們為您帶來當下的指引...",
      positions: {
        1: "這個位置代表您的靈魂本質。您選擇的瓶子顯示出您擁有深層的內在智慧。",
        2: "挑戰即是禮物。您可能正在學習如何平衡您的能量，這將轉化為巨大的力量。",
        3: "在此時此刻，您正處於一個轉變的階段，色彩顯示出平靜中的活力。",
        4: "未來充滿了可能性，持續保持覺知，您將吸引對應的豐盛。"
      },
      summary: "相信您的直覺，色彩是靈魂的語言。"
    };
  }
};