import { GoogleGenAI } from "@google/genai";
import { TakipKayit } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  analyzeFinancials: async (records: TakipKayit[]): Promise<string> => {
    try {
      if (!records || records.length === 0) {
        return "Analiz edilecek veri bulunamadı.";
      }

      // Prepare data for the prompt
      const dataSummary = JSON.stringify(records.slice(0, 50)); // Limit to 50 for token efficiency

      const prompt = `
        Sen uzman bir finansal analistsin. Aşağıda bir firmanın Çek/Senet takip tablosundan alınan veriler (JSON formatında) bulunmaktadır.
        
        Veriler:
        ${dataSummary}

        Lütfen yöneticiler için Türkçe olarak şu analizi yap:
        1. Genel Tahsilat Durumu (Bekleyen vs Ödenen oranları).
        2. Vadesi geçmiş ama ödenmemiş (DURUM=BEKLIYOR ve TARH bugünden eski) riskli kayıtlar var mı?
        3. Nakit akışı için kısa bir özet (Gelecek vadeler).
        4. Varsa dikkat çeken riskli firmalar.

        Yanıtını HTML formatında değil, sadece düz metin (veya Markdown) olarak ver. Kısa, öz ve profesyonel bir dil kullan.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', // Updated to recommended model for text tasks
        contents: prompt,
      });

      return response.text || "Analiz oluşturulamadı.";
    } catch (error) {
      console.error("Gemini Hatası:", error);
      return "Yapay zeka servisine şu an erişilemiyor. Lütfen API anahtarınızı kontrol edin.";
    }
  }
};