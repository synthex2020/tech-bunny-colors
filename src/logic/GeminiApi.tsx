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

    const breastSizeInstruction =
      anatomy.sex === "female" && anatomy.breast
        ? `Breast size: ${anatomy.breast} (US sizing).`
        : `Breasts: None / Minimal (as appropriate for their sex).`;

    const promptText = `
Create a detailed, high-quality **artist's reference sheet** for the following original character. 

**Core Style Directive:**
The art style must be a deliberate fusion of **The Boondocks (primary influence, ~70%)** and **One Punch Man (secondary influence, ~30%)**. 

From **The Boondocks**: Sharp, angular linework. Strong jaw and facial bone structure. Expressive, slightly exaggerated facial features — wide eyes with solid dark pupils, defined brow lines, and bold mouths. Characters have a grounded, real-world ethnic and racial specificity — avoid whitewashing or genericizing features. Clothing sits naturally with weight and drape. The line art is confident and heavy — no scratchy or sketchy strokes. Background characters feel like real people, not archetypes.

From **One Punch Man** (Yusuke Murata's manga style specifically): Extreme anatomical precision and musculature when the character calls for it. Dynamic implied energy even in neutral poses — a stillness that feels coiled. Clean technical linework at the same weight as Boondocks but with more rendering on form. Subtle speed-line-influenced shadow techniques for depth without full shading.

The **Boondocks aesthetic dominates** — flat color fills, strong outlines, slightly stylized proportions. One Punch Man influence shows up in the **body construction and rendering quality**, not in the overall visual language.

**Do not** produce generic anime style, chibi, moe, or shonen-magazine style. The result should look like it could appear in an Aaron McGruder production that hired Murata as a guest animator.

---

Character Data:

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
Hair style and color: ${other.inspiration || "a style that fits their personality"}
Eyes: ${anatomy.eyes}
Nose: ${anatomy.nose}
Posture: ${anatomy.posture}

Personality: ${personality.personality}
Habits / Quirks: ${personality.habits.join(", ") || "N/A"}

Supernatural / Class:
Class (DnD style): ${identity.supernatural.class}
Fight Style: ${identity.supernatural.fightStyle}
Elements: ${identity.supernatural.primaryElement}, ${identity.supernatural.secondaryElement}, ${identity.supernatural.tertiaryElement}

Body Modifications:
Scars: ${anatomy.scars.join(", ") || "None"}
Burns: ${anatomy.burns.join(", ") || "None"}
Tattoos: ${anatomy.tattoos.join(", ") || "None"}
Birthmarks: ${anatomy.birthmarks.join(", ") || "None"}
Moles: ${anatomy.moles.join(", ") || "None"}

---

**Reference Sheet Layout Requirements:**

1. **Poses:** Three orthographic views — **front, 3/4 turn, and back** — in a neutral standing pose. The 3/4 view may carry a subtle expression or weight shift to show personality, but must remain technically readable. Poses should feel lived-in and grounded in the Boondocks tradition — not stiff, not heroic.

2. **Clothing:** Minimal, form-fitting reference clothing (sports bra/briefs or equivalent in a flat neutral tone) to expose anatomy and proportions clearly. Clothing should have the natural drape and fabric weight characteristic of Boondocks costuming — no fantasy armor or costume unless part of the character design.

3. **Proportions:** Include a **head-height measurement grid** alongside the main figure. Mark shoulder width, hip width, and limb ratios. Face proportion guides (front + side profile) with landmark lines for eyes, nose, mouth, and ear placement — executed in the Boondocks facial geometry style (strong cheekbones, defined jawline, ethnic specificity honored).

4. **Detail Panels:** Close-up insets for:
   - Face (front-on and 3/4 profile)
   - Hands
   - Feet
   - Any significant body modifications (scars, tattoos, etc.) called out with small annotation lines

5. **Linework:** Heavy, confident outlines on silhouette edges. Slightly thinner interior lines. **Flat color fills with minimal gradient** — cel-shading only where it defines form. Shadow shapes should be bold and geometric in the Boondocks tradition, with Murata-style anatomical shadow placement on musculature.

6. **Color Palette:** Use a small, deliberate palette. Skin tones must be rendered with the racial accuracy that is a hallmark of The Boondocks — warm undertones for Black characters, correct olive/cool ranges for others. No desaturation or genericizing.

7. **Typography:** Include the character's name in clean, bold sans-serif lettering at the top of the sheet. Annotation labels (height, weight, notes) in a small, technical font alongside measurement guides.
`.trim();

    // --- Build contents depending on whether we have a reference image ---
    let contents: any;

    if (reference) {
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