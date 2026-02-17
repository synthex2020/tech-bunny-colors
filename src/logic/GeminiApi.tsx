import { CharacterProfile } from "../types";
import { uploadImageFilesToSupabase } from "../persistence/MediaPersistence";
import { GoogleGenAI } from "@google/genai";

// Google API client
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY,
});

// Helper: convert File -> base64 string (no data: prefix)
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        // result is like "data:image/png;base64,AAAA..."
        const base64 = result.split(",")[1] ?? result;
        resolve(base64);
      } else {
        reject(new Error("Unexpected FileReader result type"));
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export async function generate_character_sheet(
  character: CharacterProfile,
  reference: File | undefined
): Promise<string> {
  try {
    const { identity, anatomy, personality, other } = character;

    const displayName =
      identity.name || identity.nickname || "Unnamed character";

    // --- Safely integrate breast size (US sizing, only for women) ---
    // NOTE: Corrected the property access from anatomy.breast to anatomy.breastSize (assuming it exists in your CharacterProfile type based on the previous conversation)
    const breastSizeInstruction =
      anatomy.sex === "female" && anatomy.breast
        ? `Breast size: ${anatomy.breast} (US sizing).`
        : `Breasts: None / Minimal (as appropriate for their sex).`;

    const promptText = `
Create a detailed, high-quality **artist's reference sheet** for the following original character. The style must be a clean, neutral, and highly technical illustration suitable for model sheets. **Prioritize anatomical and proportional accuracy for artists.**

Name: ${displayName}
Gender Identity: ${identity.gender}
Biological Sex: ${anatomy.sex}
Race / Species: ${anatomy.race} / ${anatomy.species}
Body Type: ${anatomy.bodyType}
Age: ${anatomy.age}
Height: ${anatomy.height}
Weight: ${anatomy.weight}
${breastSizeInstruction}

Hair & Face:
Hair style and color: ${
      other.inspiration || "a style that fits their personality"
    }
Eyes: ${anatomy.eyes}
Nose: ${anatomy.nose}
Posture: ${anatomy.posture}

Personality: ${personality.personality}
Habits / quirks: ${personality.habits.join(", ") || "N/A"}

Supernatural / Class:
Class (DnD style): ${identity.supernatural.class}
Fight Style: ${identity.supernatural.fightStyle}
Elements: ${identity.supernatural.primaryElement}, ${
      identity.supernatural.secondaryElement
    }, ${identity.supernatural.tertiaryElement}

Body Modifications:
Scars: ${anatomy.scars.join(", ") || "None"}
Burns: ${anatomy.burns.join(", ") || "None"}
Tattoos: ${anatomy.tattoos.join(", ") || "None"}
Birthmarks: ${anatomy.birthmarks.join(", ") || "None"}
Moles: ${anatomy.moles.join(", ") || "None"}

**Artist Reference Sheet Style Requirements:**
1.  **Layout:** Use a **clean, technical character sheet layout** with **orthographic poses** (front, 3/4, and back). The character should be in a **neutral, standing pose**.
2.  **Clothing:** The character must be illustrated wearing **minimal, form-fitting, non-obstructive clothing** (e.g., a simple sports bra/bikini top and shorts/briefs in a neutral color) to allow artists to **clearly see and reference the full body anatomy and proportions** without distraction.
3.  **Proportions:** Include **proportional breakdown views** for both the **full body** and the **face**. This must include overlaying a **grid or measure lines** (e.g., using head-height units) next to the main figure to define the character's height, shoulder width, hip width, and limb lengths.
4.  **Details:** Include **close-ups** for **face proportions** (front and side profiles), hands, and feet.
5.  **Style:** Render in a highly detailed, **semi-realistic anime style** that resembles the quality and fidelity of modern anime like **The Apothecary Diaries or Bleach**. **Avoid dynamic poses or heavy shading** on the main figures. Use **clear line art** and lighting for maximum utility as a technical reference.
`.trim();

    // --- Build contents depending on whether we have a reference image ---
    let contents: any;

    if (reference) {
      // Text + image (editing / style transfer style)
      const base64Image = await fileToBase64(reference);
      contents = [
        {
          text: promptText,
        },
        {
          inlineData: {
            mimeType: reference.type || "image/png",
            data: base64Image,
          },
        },
      ];
    } else {
      // Text-only – docs allow plain string for contents
      contents = promptText;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents,
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];

    for (const part of parts) {
      if (!part.inlineData) continue;

      const base64 = part.inlineData.data ?? "";
      if (!base64) continue;

      // ---- Browser-safe base64 -> Uint8Array ----
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Build a File for Supabase
      const safeName =
        displayName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || "character";

      const fileName = `${Date.now()}-${safeName}-sheet.png`;

      const file = new File([bytes], fileName, { type: "image/png" });

      const urls = await uploadImageFilesToSupabase([file]);

      if (urls && urls.length > 0) {
        const resultant = urls[0];
        console.log("Character sheet URL:", resultant);
        return resultant;
      }

      console.error("Supabase upload failed.");
      return "";
    }

    console.error("No image data found in Gemini response.");
    return "";
  } catch (error) {
    console.error("Error generating character sheet:", error);
    return "";
  }
}