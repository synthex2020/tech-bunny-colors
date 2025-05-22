// src/components/TranslateText.tsx
import { useState, ChangeEvent, FormEvent } from "react";

interface TranslateRequest {
  fromLanguage: string;
  toLanguage: string;
  content: string;
}

function TranslateText() {
  const [formData, setFormData] = useState<TranslateRequest>({
    fromLanguage: "",
    toLanguage: "",
    content: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Translate Request Payload:", JSON.stringify(formData, null, 2));
  };

  return (
    <div className="p-6 mt-10 border border-base-300 rounded-md bg-base-100">
      <h2 className="text-2xl font-bold mb-4">Translate Text</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="fromLanguage" className="font-semibold">Input Language</label>
          <select
            name="fromLanguage"
            id="fromLanguage"
            className="select select-bordered"
            value={formData.fromLanguage}
            onChange={handleChange}
          >
            <option value="">Select Language</option>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="de">German</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="toLanguage" className="font-semibold">Output Language</label>
          <select
            name="toLanguage"
            id="toLanguage"
            className="select select-bordered"
            value={formData.toLanguage}
            onChange={handleChange}
          >
            <option value="">Select Language</option>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="de">German</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="content" className="font-semibold">Text to Translate</label>
          <textarea
            name="content"
            id="content"
            className="textarea textarea-bordered"
            value={formData.content}
            onChange={handleChange}
            placeholder="Enter text to translate"
          />
        </div>

        <button type="submit" className="btn btn-primary w-fit">Translate (Console Only)</button>
      </form>
    </div>
  );
}

export default TranslateText;
