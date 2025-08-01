import React, { useState } from "react";

const fields = [
  "eyeColor", "hairColor", "skinColor", "race", "species", "gender", "orientation",
  "age", "bodyBuild", "scars", "tattoos", "lips", "nose", "chest", "arms", "legs",
  "waist", "abdomen", "height", "weight"
] as const;

type CharacterForm = Record<typeof fields[number], string>;

export const CharacterCreator: React.FC = () => {
  const [form, setForm] = useState<CharacterForm>(() =>
    Object.fromEntries(fields.map((field) => [field, ""])) as CharacterForm
  );
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/generate-character", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      setResult(data.prompt || "Character generated successfully.");
    } catch (err) {
      console.error(err);
      setResult("Failed to generate character.");
    }
    setLoading(false);
  };

  const downloadResult = () => {
    if (!result) return;
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "character_sheet.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Hero Section */}
      <div className="hero bg-gradient-to-br from-indigo-100 to-purple-100 py-12 px-4">
        <div className="hero-content flex-col lg:flex-row">
          <img
            src="https://mkcijqngeshomivhjrbe.supabase.co/storage/v1/object/public/image-bucket/images/character_gen.png"
            className="max-w-sm rounded-lg shadow-2xl"
            alt="Character Illustration"
          />
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold">Character Creator</h1>
            <p className="py-6 text-lg text-gray-700">
              Craft a detailed prompt for your AI character with physical, identity, and personality traits. Perfect for storytelling, game design, or AI generation.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 py-10">
        <div className="card shadow-lg bg-white p-6">
          <h2 className="text-2xl font-semibold mb-4">Character Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <label key={field} className="form-control w-full">
                <div className="label">
                  <span className="label-text capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </span>
                </div>
                <input
                  type="text"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={`Enter ${field}`}
                  className="input input-bordered w-full"
                />
              </label>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              className={`btn btn-primary ${loading ? "loading" : ""}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
            {result && (
              <button className="btn btn-outline btn-secondary" onClick={downloadResult}>
                Download Character Sheet
              </button>
            )}
          </div>
        </div>

        {/* Result Section */}
        {result && (
          <div className="card bg-base-200 shadow-lg mt-10 p-6">
            <h3 className="text-xl font-semibold mb-3">Generated Prompt</h3>
            <pre className="bg-base-100 p-4 rounded-lg whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterCreator;
