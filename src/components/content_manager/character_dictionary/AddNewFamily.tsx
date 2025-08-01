import { useState } from "react";
import { Family } from "../../../types";
import { add_new_family } from "../../../persistence/FamilyPersistence";

export default function AddNewFamily() {
  const [familyName, setFamilyName] = useState("");
  const [patron, setPatron] = useState("");
  const [history, setHistory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const newFamily: Omit<Family, "id"> = {
      familyName,
      patron,
      history,
    };

    try {
      // Replace with your actual backend API route
      const response = await add_new_family(newFamily);

      if (!response) {
        throw new Error("Failed to create family");
      }

      setSuccess(true);

      // Optional: redirect or reset
      setFamilyName("");
      setPatron("");
      setHistory("");

    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-primary shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Add New Family</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {success ? <p className="text-green-400 mb-2">Success</p>
       : <></>
        }

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Family Name</label>
          <input
            type="text"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Patron</label>
          <input
            type="text"
            value={patron}
            onChange={(e) => setPatron(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium">History</label>
          <textarea
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            className="textarea textarea-bordered w-full"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Family"}
        </button>
      </form>
    </div>
  );
}
