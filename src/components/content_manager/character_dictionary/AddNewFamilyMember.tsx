import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Relation } from "../../../types";
import useCharacterStore from "../../../store/CharacterStore";
import useFamilyStore from "../../../store/FamilyStore";
import { add_new_family_member } from "../../../persistence/FamilyPersistence";
import { fetch_series_characters } from "../../../persistence/CharactersPersistence";
import { fetch_series_families } from "../../../persistence/SeriesPerisistence";


function AddNewFamilyMember() {
  const { id: seriesId } = useParams<{ id: string }>();

  const {
    characters,
    setCharacters,
  } = useCharacterStore();

  const {
    families, setFamilies
  } = useFamilyStore();

  const [selectedFamilyId, setSelectedFamilyId] = useState<string>("");
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>("");

  // Load characters on mount
  useEffect(() => {

    if (seriesId) {
      fetch_series_families(seriesId).then(setFamilies);
      fetch_series_characters(seriesId).then(setCharacters);
    }
  }, [seriesId, setCharacters, setFamilies]);
 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFamilyId || !selectedCharacterId) {
      alert("Please select both a character and a family.");
      return;
    }

    const newRelation: Relation = {
      familyId: selectedFamilyId,
      characterId: selectedCharacterId,
    };

    const success = await add_new_family_member(newRelation);

    if (success) {
      alert("Relation successfully added!");
      setSelectedCharacterId("");
      setSelectedFamilyId("");
    } else {
      alert("An error occurred while adding the relation.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Family Relation</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Family Dropdown */}
        <div>
          <label className="block mb-1 font-medium">Select Family</label>
          <select
            className="select select-bordered w-full"
            value={selectedFamilyId}
            onChange={(e) => {
              setSelectedFamilyId(e.target.value);
              setSelectedCharacterId(""); // Reset character selection
            }}
          >
            <option value="">-- Choose a Family --</option>
            {families.map((family) => (
              <option key={family.id} value={family.id}>
                {family.familyName}
              </option>
            ))}
          </select>
        </div>

        {/* Character Dropdown (filtered) */}
        <div>
          <label className="block mb-1 font-medium">Select Character</label>
          <select
            className="select select-bordered w-full"
            value={selectedCharacterId}
            onChange={(e) => setSelectedCharacterId(e.target.value)}
            disabled={!selectedFamilyId}
          >
            <option value="">-- Choose a Character --</option>
            {characters.map((character) => (
              <option key={character.id} value={character.id}>
                {character.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Add Relation
        </button>
      </form>
    </div>
  );
}

export default AddNewFamilyMember;
