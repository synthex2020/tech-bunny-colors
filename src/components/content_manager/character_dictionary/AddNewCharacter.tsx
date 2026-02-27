import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useParams } from "react-router";
import useFamilyStore from "../../../store/FamilyStore";
import { fetch_series_families } from "../../../persistence/SeriesPerisistence";
import { add_new_character } from "../../../persistence/CharactersPersistence";
import type { CharacterProfile } from "../../../types";
import {
  uploadImageFilesToSupabase,
  uploadJsonFileToSupabase,
} from "../../../persistence/MediaPersistence";
import { generate_character_sheet } from "../../../logic/GeminiApi";
import AddCharacterPreview from "../../ui/add-character-preview";
import QuickPrefillPanel from "./QuickFillPanel";

// --- helpers & constants (could be moved to separate file) ---
// Each line = one item, and we strip commas entirely
const linesToArray = (value: string): string[] =>
  value
    .split("\n")
    .map((s) => s.replace(/,/g, "").trim())
    .filter(Boolean);

const arrayToLines = (arr: string[]): string => arr.join("\n");

// Used for backend formatting (no change to API)
const listToString = (arr: string[]) => arr.join(", ");

const DND_CLASS_DESCRIPTIONS: Record<string, string> = {
  Artificer:
    "Inventors and tinkerers who infuse objects with arcane power—magical engineers.",
  Barbarian:
    "Primal warriors who rely on rage and toughness to crush their foes.",
  Bard: "Charismatic performers whose music and words weave subtle, versatile magic.",
  Cleric:
    "Divine spellcasters channeling the power of a deity—healers and holy warriors.",
  Druid:
    "Guardians of nature, wielding primal magic and the ability to turn into animals.",
  Fighter: "Martial experts who can specialize in almost any style of combat.",
  Monk: "Disciplined martial artists who harness ki for agility and powerful strikes.",
  Paladin:
    "Holy knights bound by sacred oaths, mixing martial prowess with divine power.",
  Ranger:
    "Hunters and trackers who excel in the wilderness—often with an animal companion.",
  Rogue:
    "Stealthy, nimble characters who excel at precision strikes and trickery.",
  Sorcerer:
    "Innate spellcasters whose magic flows from bloodlines or strange inner power.",
  Warlock:
    "Casters who form pacts with powerful patrons to gain eldritch magic.",
  Wizard:
    "Scholars of arcane lore who learn spells through study and experimentation.",
};

type ExtraFields = {
  titles: string;
  hair: string;
  fashion: string;
  equipment: string;
  powers: string;
  orientation: string;
  bodyModifications: string;
  model: string;
};

const initialProfile: CharacterProfile = {
  identity: {
    name: "",
    nickname: "",
    gender: "",
    family: "",
    education: "",
    address: "",
    languages: [],
    career: [],
    pets: [],
    plants: [],
    religion: "",
    favouriteColor: "",
    favouriteFood: "",
    favouriteObject: "",
    luckyNumber: 0,
    fears: [],
    supernatural: {
      fightStyle: "",
      class: "",
      strengths: [],
      weaknesses: [],
      primaryElement: "",
      secondaryElement: "",
      tertiaryElement: "",
    },
  },
  anatomy: {
    age: 15,
    sex: "Male",
    race: "",
    species: "",
    bodyType: "",
    bloodType: "",
    height: "",
    weight: "",
    eyesight: "",
    colorBlind: "",
    glasses: false,
    handed: "",
    voice_type: "",
    scars: [],
    burns: [],
    skinDamage: [],
    tattoos: [],
    birthmarks: [],
    nose: "",
    eyes: "",
    posture: "",
    breast: "",
    legs: "",
    moles: [],
  },
  personality: {
    sayings: "",
    hobbies: "",
    habits: [],
    personality: "",
    insecurities: [],
  },
  bio: {
    dob: "",
    dod: "",
    birthplace: "",
    surgeries: [],
    cavities: [],
    sexualHistory: [],
    currentLovers: [],
    pastLovers: [],
    relationshipStatus: "",
    problemRelationships: "",
    familyRelationships: "",
    friends: [],
    rivals: [],
    admires: [],
    hates: [],
    philosphyLove: "",
    phiolosphyRelationships: "",
    childhood: "",
    criminalRecord: [],
    fears: [],
    successes: [],
    failures: [],
    dreams: [],
  },
  other: {
    inspiration: "",
    referenceImage: null,
  },
};



const initialExtra: ExtraFields = {
  titles: "",
  hair: "",
  fashion: "",
  equipment: "",
  powers: "",
  orientation: "Heterosexual",
  bodyModifications: "",
  model: "",
};

function AddNewCharacter() {
  const { families, setFamilies } = useFamilyStore();
  const { id } = useParams<{ id: string }>();
  const seriesId = id!;

  const [profile, setProfile] = useState<CharacterProfile>(initialProfile);
  const [epubGenProfile, setEpubGenProfile] =
    useState<CharacterProfile>(initialProfile);
  const [extra, setExtra] = useState<ExtraFields>(initialExtra);
  const [images, setImages] = useState<string[]>([]);
  const [referenceImages, setReferenceImages] = useState<File[]>();
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [anatomyJson, setAnatomyJson] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clearForm, setClearForm] = useState<boolean>(false);
  const [characterSheetDisplay, setCharacterSheetDisplay] =
    useState<string>("");

  useEffect(() => {
    if (seriesId) {
      fetch_series_families(seriesId).then(setFamilies);
    }
  }, [seriesId, setFamilies]);

  const applyPrefill = (
  prefillProfile: CharacterProfile,
  prefillExtra: typeof extra,
) => {
  setProfile(prefillProfile);
  setExtra(prefillExtra);
  setCurrentStep(0); // Jump back to step 1 so user sees the filled data
};

  // ---- generic updaters ----
  const updateIdentity = (
    field: keyof CharacterProfile["identity"],
    value: any,
  ) => {
    setProfile((prev) => ({
      ...prev,
      identity: { ...prev.identity, [field]: value },
    }));
  };

  const updateIdentitySupernatural = (
    field: keyof CharacterProfile["identity"]["supernatural"],
    value: any,
  ) => {
    setProfile((prev) => ({
      ...prev,
      identity: {
        ...prev.identity,
        supernatural: {
          ...prev.identity.supernatural,
          [field]: value,
        },
      },
    }));
  };

  const updateAnatomy = (
    field: keyof CharacterProfile["anatomy"],
    value: any,
  ) => {
    setProfile((prev) => ({
      ...prev,
      anatomy: { ...prev.anatomy, [field]: value },
    }));
  };

  const updatePersonality = (
    field: keyof CharacterProfile["personality"],
    value: any,
  ) => {
    setProfile((prev) => ({
      ...prev,
      personality: { ...prev.personality, [field]: value },
    }));
  };

  const updateBio = (field: keyof CharacterProfile["bio"], value: any) => {
    setProfile((prev) => ({
      ...prev,
      bio: { ...prev.bio, [field]: value },
    }));
  };

  const updateOther = (field: keyof CharacterProfile["other"], value: any) => {
    setProfile((prev) => ({
      ...prev,
      other: { ...prev.other, [field]: value },
    }));
  };

  const updateExtra = (field: keyof ExtraFields, value: any) => {
    setExtra((prev) => ({ ...prev, [field]: value }));
  };

  // ---- file handlers ----
  const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const arrayFiles = Array.from(files);
    setReferenceImages(arrayFiles);
    const imageSrcs = arrayFiles.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...imageSrcs]);

    // Set first as "referenceImage" if none yet
    if (!profile.other.referenceImage && imageSrcs[0]) {
      updateOther("referenceImage", imageSrcs[0]);
    }
  };

  const handleJsonDataInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);

        if (!json.character) {
          alert("Invalid JSON: Missing 'character' key.");
          return;
        }

        if (json.image) {
          setImages((prev) => [...prev, json.image]);
          if (!profile.other.referenceImage) {
            updateOther("referenceImage", json.image);
          }
        }

        // Store raw anatomy JSON string; backend still expects `anatomy` field
        setAnatomyJson(JSON.stringify(json.character));
      } catch (err) {
        console.error("Failed to parse JSON:", err);
        alert("Invalid JSON file.");
      }
    };

    reader.readAsText(file);
  };

  // ---- submit ----
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    // Build body modifications string from detailed arrays + manual field
    const autoBodyModsParts: string[] = [];
    if (profile.anatomy.scars.length)
      autoBodyModsParts.push(`Scars: ${listToString(profile.anatomy.scars)}`);
    if (profile.anatomy.burns.length)
      autoBodyModsParts.push(`Burns: ${listToString(profile.anatomy.burns)}`);
    if (profile.anatomy.tattoos.length)
      autoBodyModsParts.push(
        `Tattoos: ${listToString(profile.anatomy.tattoos)}`,
      );
    if (profile.anatomy.birthmarks.length)
      autoBodyModsParts.push(
        `Birthmarks: ${listToString(profile.anatomy.birthmarks)}`,
      );
    if (profile.anatomy.skinDamage.length)
      autoBodyModsParts.push(
        `Skin Damage: ${listToString(profile.anatomy.skinDamage)}`,
      );
    if (profile.anatomy.moles.length)
      autoBodyModsParts.push(`Moles: ${listToString(profile.anatomy.moles)}`);

    const bodyModsCombined = [
      extra.bodyModifications,
      autoBodyModsParts.join(" | "),
    ]
      .filter(Boolean)
      .join(" || ");

    // Build backstory from bio/personality/identity bits
    const backstoryParts: string[] = [];
    if (profile.bio.childhood)
      backstoryParts.push(`[Childhood]: ${profile.bio.childhood}`);
    if (profile.bio.birthplace)
      backstoryParts.push(`[Birthplace]: ${profile.bio.birthplace}`);
    if (profile.bio.philosphyLove)
      backstoryParts.push(`[Love Philosophy]: ${profile.bio.philosphyLove}`);
    if (profile.bio.phiolosphyRelationships)
      backstoryParts.push(
        `[Relationship Philosophy]: ${profile.bio.phiolosphyRelationships}`,
      );
    if (profile.bio.successes.length)
      backstoryParts.push(
        `[Successes]: ${listToString(profile.bio.successes)}`,
      );
    if (profile.bio.failures.length)
      backstoryParts.push(`[Failures]: ${listToString(profile.bio.failures)}`);
    if (profile.bio.dreams.length)
      backstoryParts.push(`[Dreams]: ${listToString(profile.bio.dreams)}`);
    if (profile.bio.criminalRecord.length)
      backstoryParts.push(
        `[Criminal Record]: ${listToString(profile.bio.criminalRecord)}`,
      );

    if (profile.identity.family)
      backstoryParts.unshift(
        `[Familial Relations (free text)]: ${profile.identity.family}`,
      );

    const backstory = backstoryParts.join("\n");

    // Build powers string – combine explicit powers + supernatural info
    const powerParts: string[] = [];
    if (extra.powers) powerParts.push(extra.powers);
    if (profile.identity.supernatural.class)
      powerParts.push(`Class: ${profile.identity.supernatural.class}`);
    if (profile.identity.supernatural.fightStyle)
      powerParts.push(
        `Fight Style: ${profile.identity.supernatural.fightStyle}`,
      );
    if (profile.identity.supernatural.primaryElement)
      powerParts.push(
        `Primary Element: ${profile.identity.supernatural.primaryElement}`,
      );
    if (profile.identity.supernatural.secondaryElement)
      powerParts.push(
        `Secondary Element: ${profile.identity.supernatural.secondaryElement}`,
      );
    if (profile.identity.supernatural.tertiaryElement)
      powerParts.push(
        `Tertiary Element: ${profile.identity.supernatural.tertiaryElement}`,
      );
    if (profile.identity.supernatural.strengths.length)
      powerParts.push(
        `Strengths: ${listToString(profile.identity.supernatural.strengths)}`,
      );
    if (profile.identity.supernatural.weaknesses.length)
      powerParts.push(
        `Weaknesses: ${listToString(profile.identity.supernatural.weaknesses)}`,
      );
    const powers = powerParts.join(" | ");

    // Upload JSON profile
    const jsonResult = await uploadJsonFileToSupabase(profile);

    // Create a character sheet image and upload it to Supabase
    const referenceAgent = referenceImages![0] ?? undefined;

    const characterSheetResult = await generate_character_sheet(
      profile,
      referenceAgent,
    );

    //  Generate the needed Files
    const temporary: string[] = [];
    temporary.push(characterSheetResult);
    setCharacterSheetDisplay(characterSheetResult);
    setEpubGenProfile(profile);

    if (referenceImages && referenceImages.length != 0) {
      const referenceResult = await uploadImageFilesToSupabase(referenceImages);
      if (referenceResult) {
        for (var ref in referenceResult) {
          temporary.push(referenceResult[ref]);
        } // end for
      } // end if
    } // end if

    // Backend payload (keeps old field names)
    const characterEntry = {
      createdAt: new Date().toISOString(),
      titles: extra.titles,
      name: profile.identity.name,
      sex: profile.anatomy.sex,
      gender: profile.identity.gender,
      species: profile.anatomy.species,
      personality: profile.personality.personality,
      hair: extra.hair,
      fashion: extra.fashion,
      quirks: listToString(profile.personality.habits),
      relationships: profile.bio.relationshipStatus,
      orientation: extra.orientation,
      race: profile.anatomy.race,
      age: profile.anatomy.age.toString(),
      powers,
      martialArts: profile.identity.supernatural.fightStyle,
      hobbies: profile.personality.hobbies,
      equipment: extra.equipment,
      backstory,
      references: profile.other.inspiration,
      characterSheet: images[0] ?? profile.other.referenceImage ?? "",
      bodyMods: bodyModsCombined,
      anatomy: jsonResult ?? "",
      model: extra.model,
      family: selectedFamilyId ? [selectedFamilyId] : [],
      referenceMedia: [characterSheetResult ?? ""],
      media: temporary,
      character_sheet: characterSheetResult ?? "",
    };
    console.log(characterEntry);

    const ok = await add_new_character({
      character: characterEntry,
      seriesId,
    });

    if (ok) {
      alert("Character Added");
      if (clearForm) {
        setProfile(initialProfile);
      }
      setExtra(initialExtra);
      setImages([]);
      setSelectedFamilyId("");
      setAnatomyJson("");
      setCurrentStep(0);

      setIsLoading(false);
      (document.getElementById("my_modal_3") as HTMLDialogElement).showModal();
    } else {
      alert("Failed to upload character");
    }
  };

  // ---- step rendering ----
  const renderIdentityStep = () => {
    const selectedClass = profile.identity.supernatural.class;
    return (
      <div className="card bg-base-100 shadow-md p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-2">Identity</h2>
        <p className="text-sm opacity-70 mb-4">
          Basic information about who your character is in everyday life.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Name / nickname */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Character Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="e.g. Jennifer Malik"
              value={profile.identity.name}
              onChange={(e) => updateIdentity("name", e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Nickname / Alias</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="e.g. Jenn, The Silver Fox"
              value={profile.identity.nickname}
              onChange={(e) => updateIdentity("nickname", e.target.value)}
            />
          </div>

          {/* Gender */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Gender</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={profile.identity.gender}
              onChange={(e) => updateIdentity("gender", e.target.value)}
            >
              <option value="">Pick a gender</option>
              <option>Man</option>
              <option>Woman</option>
              <option>Trans-Woman</option>
              <option>Trans-Man</option>
              <option>Non-Binary</option>
              <option>Other</option>
            </select>
            <span className="label-text-alt text-xs mt-1">
              This is how they identify (socially), separate from biological
              sex.
            </span>
          </div>

          {/* Titles */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Titles / Honorifics
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Dr, Lord, Detective, Captain..."
              value={extra.titles}
              onChange={(e) => updateExtra("titles", e.target.value)}
            />
          </div>

          {/* Family free text */}
          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold">
                Family (free text)
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Notes about their family or lineage."
              value={profile.identity.family}
              onChange={(e) => updateIdentity("family", e.target.value)}
            />
          </div>

          {/* Address / home base */}
          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold">
                Address / Home Base
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Where do they live? (City, neighborhood, or something more abstract.)"
              value={profile.identity.address}
              onChange={(e) => updateIdentity("address", e.target.value)}
            />
          </div>

          {/* Education + Career (per line) */}
          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold">Education</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Education (e.g. Engineering degree, self-taught hacker)"
              value={profile.identity.education}
              onChange={(e) => updateIdentity("education", e.target.value)}
            />
          </div>

          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold">
                Career roles (one per line)
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder={"Detective, Private security, Part-time barista"}
              value={profile.identity.career}
              onChange={(e) => updateIdentity("career", e.target.value)}
            />
          </div>

          {/* Languages */}
          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold">
                Languages (one per line)
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder={"English, Japanese, Elvish"}
              value={profile.identity.languages}
              onChange={(e) => updateIdentity("languages", e.target.value)}
            />
            <span className="label-text-alt text-xs mt-1">
              One language per line. Commas are removed automatically.
            </span>
          </div>

          {/* Religion */}
          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold">
                Religion / Belief System
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="e.g. Catholic, Atheist, Follows the Flame"
              value={profile.identity.religion}
              onChange={(e) => updateIdentity("religion", e.target.value)}
            />
          </div>

          {/* Pets */}
          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold">Pets</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder={"Black cat, Cybernetically enhanced goldfish"}
              value={profile.identity.pets}
              onChange={(e) => updateIdentity("pets", e.target.value)}
            />
          </div>

          {/* Plants */}
          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold">Plants</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder={"Bonsai tree, Carnivorous plant"}
              value={profile.identity.plants}
              onChange={(e) => updateIdentity("plants", e.target.value)}
            />
          </div>

          {/* Favourite things + lucky number */}
          <div className="grid md:grid-cols-2 gap-4 md:col-span-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Favourite Color
                </span>
              </label>
              <input
                className="input input-bordered w-full"
                value={profile.identity.favouriteColor}
                onChange={(e) =>
                  updateIdentity("favouriteColor", e.target.value)
                }
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Favourite Food</span>
              </label>
              <input
                className="input input-bordered w-full"
                value={profile.identity.favouriteFood}
                onChange={(e) =>
                  updateIdentity("favouriteFood", e.target.value)
                }
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Favourite Object
                </span>
              </label>
              <input
                className="input input-bordered w-full"
                value={profile.identity.favouriteObject}
                onChange={(e) =>
                  updateIdentity("favouriteObject", e.target.value)
                }
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Lucky Number</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={profile.identity.luckyNumber}
                onChange={(e) => updateIdentity("luckyNumber", e.target.value)}
              />
            </div>
          </div>

          {/* Identity fears */}
          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold">
                Fears (one per line)
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder={"Heights, Abandonment, Deep water"}
              value={profile.identity.fears}
              onChange={(e) => updateIdentity("fears", e.target.value)}
            />
          </div>

          {/* Supernatural / DnD flavored */}
          <div className="flex flex-col w-full gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Supernatural Class (DnD-style)
                </span>
              </label>
              <select
                className="select select-bordered w-full"
                value={profile.identity.supernatural.class}
                onChange={(e) =>
                  updateIdentitySupernatural("class", e.target.value)
                }
              >
                <option value="">Pick a class</option>
                {Object.keys(DND_CLASS_DESCRIPTIONS).map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
              {selectedClass && (
                <span className="label-text-alt text-xs mt-1">
                  {DND_CLASS_DESCRIPTIONS[selectedClass]}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Fight Style</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Sword & shield, sniper, unarmed martial arts..."
                value={profile.identity.supernatural.fightStyle}
                onChange={(e) =>
                  updateIdentitySupernatural("fightStyle", e.target.value)
                }
              />
              <span className="label-text-alt text-xs mt-1">
                How they fight physically or magically.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAnatomyStep = () => (
    <div className="card bg-base-100 shadow-md p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-2">Anatomy</h2>
      <p className="text-sm opacity-70 mb-4">
        Physical traits and body-related details. Sex refers to biological
        characteristics, separate from gender.
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Age</span>
          </label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={profile.anatomy.age}
            onChange={(e) => updateAnatomy("age", Number(e.target.value))}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Biological Sex</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={profile.anatomy.sex}
            onChange={(e) => updateAnatomy("sex", e.target.value)}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Intersex</option>
            <option>Unknown</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Race</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Human, Elf, Android..."
            value={profile.anatomy.race}
            onChange={(e) => updateAnatomy("race", e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Species</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="e.g. Human, Tiefling, Cyborg"
            value={profile.anatomy.species}
            onChange={(e) => updateAnatomy("species", e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Height (e.g. 170cm)
            </span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={profile.anatomy.height}
            onChange={(e) => updateAnatomy("height", e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Weight (e.g. 60kg)</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={profile.anatomy.weight}
            onChange={(e) => updateAnatomy("weight", e.target.value)}
          />
        </div>
      </div>

      {/* Body type / blood / handed / voice / color blind */}
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Body Type</span>
          </label>
          <input
            className="input input-bordered w-full"
            value={profile.anatomy.bodyType}
            onChange={(e) => updateAnatomy("bodyType", e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Blood Type</span>
          </label>
          <input
            className="input input-bordered w-full"
            value={profile.anatomy.bloodType}
            onChange={(e) =>
              updateAnatomy("bloodType", e.target.value.replace(/,/g, ""))
            }
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Handedness</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={profile.anatomy.handed}
            onChange={(e) => updateAnatomy("handed", e.target.value)}
          >
            <option value="">Pick one</option>
            <option>Right</option>
            <option>Left</option>
            <option>Ambidextrous</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Eyesight</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="20/20, myopic, etc."
            value={profile.anatomy.eyesight}
            onChange={(e) =>
              updateAnatomy("eyesight", e.target.value.replace(/,/g, ""))
            }
          />
          <span className="label-text-alt text-xs mt-1">
            Add notes like near-sighted, far-sighted, etc.
          </span>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Color Blindness</span>
          </label>
          <input
            className="input input-bordered w-full"
            placeholder="e.g. None, Deuteranopia, Protanopia"
            value={profile.anatomy.colorBlind}
            onChange={(e) => updateAnatomy("colorBlind", e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Voice Type</span>
          </label>
          <input
            className="input input-bordered w-full"
            value={profile.anatomy.voice_type}
            onChange={(e) => updateAnatomy("voice_type", e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Glasses</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={profile.anatomy.glasses ? "True" : "False"}
            onChange={(e) =>
              updateAnatomy("glasses", e.target.value === "True")
            }
          >
            <option value="True">True (wears glasses)</option>
            <option value="False">False (does not wear glasses)</option>
          </select>
        </div>
      </div>

      {/* Breast / legs */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Breast (shape/size descriptor)
            </span>
          </label>
          <input
            className="input input-bordered w-full"
            value={profile.anatomy.breast}
            onChange={(e) => updateAnatomy("breast", e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Leg Type</span>
          </label>
          <input
            className="input input-bordered w-full"
            value={profile.anatomy.legs}
            onChange={(e) => updateAnatomy("legs", e.target.value)}
          />
        </div>
      </div>

      {/* Nose / eyes / posture + body mods summary */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Nose Shape / Eyes Shape / Posture
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Describe their nose, eyes, and posture in detail."
            value={`${profile.anatomy.nose}\n${profile.anatomy.eyes}\n${profile.anatomy.posture}`}
            onChange={(e) => {
              const lines = e.target.value.split("\n");
              updateAnatomy("nose", (lines[0] ?? "").replace(/,/g, ""));
              updateAnatomy("eyes", (lines[1] ?? "").replace(/,/g, ""));
              updateAnatomy("posture", (lines[2] ?? "").replace(/,/g, ""));
            }}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Body Modifications (free text)
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Summarize scars, tattoos, burns, birthmarks, etc."
            value={extra.bodyModifications}
            onChange={(e) => updateExtra("bodyModifications", e.target.value)}
          />
          <span className="label-text-alt text-xs mt-1">
            We&apos;ll also auto-append details from the lists below.
          </span>
        </div>
      </div>

      {/* TODO: Change listing type - Detailed lists */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Scars, Burns, Tattoos, Birthmarks, Moles, Skin Damage (one per
              line)
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full mb-2"
            placeholder="Scars (one per line)"
            value={arrayToLines(profile.anatomy.scars)}
            onChange={(e) => updateAnatomy("scars", [e.target.value])}
          />
          <textarea
            className="textarea textarea-bordered w-full mb-2"
            placeholder="Burns (one per line)"
            value={arrayToLines(profile.anatomy.burns)}
            onChange={(e) => updateAnatomy("burns", [e.target.value])}
          />
          <textarea
            className="textarea textarea-bordered w-full mb-2"
            placeholder="Tattoos (one per line)"
            value={arrayToLines(profile.anatomy.tattoos)}
            onChange={(e) => updateAnatomy("tattoos", [e.target.value])}
          />
          <textarea
            className="textarea textarea-bordered w-full mb-2"
            placeholder="Birthmarks (one per line)"
            value={arrayToLines(profile.anatomy.birthmarks)}
            onChange={(e) => updateAnatomy("birthmarks", [e.target.value])}
          />
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Moles (one per line)"
            value={arrayToLines(profile.anatomy.moles)}
            onChange={(e) => updateAnatomy("moles", [e.target.value])}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Skin Damage (one per line)
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full mb-4"
            placeholder="Old burns, chemical damage, etc."
            value={arrayToLines(profile.anatomy.skinDamage)}
            onChange={(e) => updateAnatomy("skinDamage", [e.target.value])}
          />

          <label className="label">
            <span className="label-text font-semibold">
              Orientation (Sexual)
            </span>
          </label>
          <select
            className="select select-bordered w-full"
            value={extra.orientation}
            onChange={(e) => updateExtra("orientation", e.target.value)}
          >
            <option value="Heterosexual">Heterosexual (Straight)</option>
            <option value="Homosexual">Homosexual (Gay)</option>
            <option value="Pansexual">Pansexual</option>
            <option value="Asexual">Asexual</option>
            <option value="Unknown">Unknown</option>
          </select>
          <span className="label-text-alt text-xs mt-1">
            Used as the character&apos;s orientation field in the backend.
          </span>
        </div>
      </div>
    </div>
  );

  const renderPersonalityStep = () => (
    <div className="card bg-base-100 shadow-md p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-2">Personality</h2>
      <p className="text-sm opacity-70 mb-4">
        How they act, what they enjoy, and what shapes their behavior.
      </p>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Personality Summary</span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Describe their core personality. Are they stoic, bubbly, ruthless, kind?"
          value={profile.personality.personality}
          onChange={(e) => updatePersonality("personality", e.target.value)}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">
            Hobbies (short sentence)
          </span>
        </label>
        <input
          className="input input-bordered w-full"
          placeholder="e.g. Loves baking, amateur photography, and sword practice."
          value={profile.personality.hobbies}
          onChange={(e) => updatePersonality("hobbies", e.target.value)}
        />
      </div>

      {/* Habits / quirks */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">
            Habits / Quirks (one per line)
          </span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder={
            "Taps fingers when thinking\nAlways early\nCollects teacups"
          }
          value={arrayToLines(profile.personality.habits)}
          onChange={(e) => updatePersonality("habits", [e.target.value])}
        />
        <span className="label-text-alt text-xs mt-1">
          These will become the{" "}
          <code className="badge badge-ghost badge-sm">quirks</code> field in
          the backend.
        </span>
      </div>

      {/* Insecurities */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">
            Insecurities (one per line)
          </span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder={
            "Feels inferior to older sister\nWorries about being abandoned"
          }
          value={arrayToLines(profile.personality.insecurities)}
          onChange={(e) => updatePersonality("insecurities", [e.target.value])}
        />
      </div>

      {/* Sayings */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">
            Sayings / Catchphrases
          </span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder='Things they often say, e.g. "Failure is data."'
          value={profile.personality.sayings}
          onChange={(e) => updatePersonality("sayings", e.target.value)}
        />
      </div>
    </div>
  );

  const renderBioStep = () => (
    <div className="card bg-base-100 shadow-md p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-2">Bio & Relationships</h2>
      <p className="text-sm opacity-70 mb-4">
        Backstory, relationships, and big life events. These will be folded into
        the backstory field for the backend.
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Date of Birth</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="YYYY-MM-DD or vague (e.g. Late Winter 2098)"
            value={profile.bio.dob}
            onChange={(e) => updateBio("dob", e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Date of Death (if applicable)
            </span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Leave empty if alive"
            value={profile.bio.dod}
            onChange={(e) => updateBio("dod", e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Relationship Status
            </span>
          </label>
          <select
            className="select select-bordered w-full"
            value={profile.bio.relationshipStatus}
            onChange={(e) => updateBio("relationshipStatus", e.target.value)}
          >
            <option value="">Pick status</option>
            <option>Single</option>
            <option>Dating</option>
            <option>Situationship</option>
            <option>Engaged</option>
            <option>Married</option>
            <option>Separated</option>
            <option>Divorced</option>
            <option>Widowed</option>
          </select>
        </div>
      </div>

      {/* Birthplace */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Birthplace</span>
        </label>
        <input
          className="input input-bordered w-full"
          placeholder="City, world, or vague location."
          value={profile.bio.birthplace}
          onChange={(e) => updateBio("birthplace", e.target.value)}
        />
      </div>

      {/* Childhood */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Childhood Summary</span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="What was their childhood like?"
          value={profile.bio.childhood}
          onChange={(e) => updateBio("childhood", e.target.value)}
        />
      </div>

      {/* Family relationships */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Family Relationships</span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Describe their parents, siblings, and key family dynamics."
          value={profile.bio.familyRelationships}
          onChange={(e) => updateBio("familyRelationships", e.target.value)}
        />
      </div>

      {/* Problem relationships */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">
            Problematic Relationships
          </span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Any important strained relationships."
          value={profile.bio.problemRelationships}
          onChange={(e) => updateBio("problemRelationships", e.target.value)}
        />
      </div>

      {/* Friends / rivals */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Friends (one per line)
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={arrayToLines(profile.bio.friends)}
            onChange={(e) => updateBio("friends", [e.target.value])}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Rivals / Enemies (one per line)
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={arrayToLines(profile.bio.rivals)}
            onChange={(e) => updateBio("rivals", [e.target.value])}
          />
        </div>
      </div>

      {/* Lovers */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Current Lovers (one per line)
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={arrayToLines(profile.bio.currentLovers)}
            onChange={(e) => updateBio("currentLovers", [e.target.value])}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Past Lovers (one per line)
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={arrayToLines(profile.bio.pastLovers)}
            onChange={(e) => updateBio("pastLovers", [e.target.value])}
          />
        </div>
      </div>

      {/* Surgeries / cavities */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Surgeries (one per line)
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={arrayToLines(profile.bio.surgeries)}
            onChange={(e) => updateBio("surgeries", [e.target.value])}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Dental Cavities (one per line)
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={arrayToLines(profile.bio.cavities)}
            onChange={(e) => updateBio("cavities", [e.target.value])}
          />
        </div>
      </div>

      {/* Sexual history */}
      <div className="form-control mt-4">
        <label className="label">
          <span className="label-text font-semibold">
            Sexual History (one event per line)
          </span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full"
          value={arrayToLines(profile.bio.sexualHistory)}
          onChange={(e) => updateBio("sexualHistory", [e.target.value])}
        />
      </div>

      {/* Admires / hates */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              People they admire (one per line)
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={arrayToLines(profile.bio.admires)}
            onChange={(e) => updateBio("admires", [e.target.value])}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              People they hate (one per line)
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={arrayToLines(profile.bio.hates)}
            onChange={(e) => updateBio("hates", [e.target.value])}
          />
        </div>
      </div>

      {/* Philosophies */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Philosophy of Love</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={profile.bio.philosphyLove}
            onChange={(e) => updateBio("philosphyLove", e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Philosophy of Relationships
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={profile.bio.phiolosphyRelationships}
            onChange={(e) =>
              updateBio("phiolosphyRelationships", e.target.value)
            }
          />
        </div>
      </div>

      {/* Criminal record / fears / successes / failures / dreams */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Criminal Record (one offence per line)
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={arrayToLines(profile.bio.criminalRecord)}
            onChange={(e) => updateBio("criminalRecord", [e.target.value])}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Deep Fears (one per line)
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={arrayToLines(profile.bio.fears)}
            onChange={(e) => updateBio("fears", [e.target.value])}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Successes (one per line)
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={arrayToLines(profile.bio.successes)}
            onChange={(e) => updateBio("successes", [e.target.value])}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Failures (one per line)
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={arrayToLines(profile.bio.failures)}
            onChange={(e) => updateBio("failures", [e.target.value])}
          />
        </div>
      </div>

      <div className="form-control mt-4">
        <label className="label">
          <span className="label-text font-semibold">
            Dreams & Long-term Goals (one per line)
          </span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full"
          value={arrayToLines(profile.bio.dreams)}
          onChange={(e) => updateBio("dreams", [e.target.value])}
        />
      </div>
    </div>
  );

  const renderExtras = () => (
    <div className="card bg-base-100 shadow-md p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-2">Appearance Extras & Gear</h2>
      <p className="text-sm opacity-70 mb-4">
        High-level appearance notes, fashion style, combat kit, and how this
        character ties back to your 3D / model pipeline.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Hair */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Hair (style & color)
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="e.g. Long silver hair in a messy ponytail with undercut."
            value={extra.hair}
            onChange={(e) => updateExtra("hair", e.target.value)}
          />
          <span className="label-text-alt text-xs mt-1">
            This is a free-form description; it&apos;s separate from anatomy but
            will be folded into the prompt / reference text.
          </span>
        </div>

        {/* Fashion */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Fashion / Outfit Style
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="e.g. Cyberpunk streetwear, crop jacket, cargo pants, combat boots."
            value={extra.fashion}
            onChange={(e) => updateExtra("fashion", e.target.value)}
          />
          <span className="label-text-alt text-xs mt-1">
            General clothing vibe. Helps drive how the character appears in most
            scenes.
          </span>
        </div>
      </div>

      {/* Equipment / Powers */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Equipment / Gear</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Weapons, gadgets, iconic items (e.g. custom pistol, drone, enchanted locket)."
            value={extra.equipment}
            onChange={(e) => updateExtra("equipment", e.target.value)}
          />
          <span className="label-text-alt text-xs mt-1">
            These end up in the <code>equipment</code> field in the backend.
          </span>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Powers (free text)</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="High-level summary of powers or special abilities."
            value={extra.powers}
            onChange={(e) => updateExtra("powers", e.target.value)}
          />
          <span className="label-text-alt text-xs mt-1">
            This text is combined with supernatural class / elements when
            building the final powers string.
          </span>
        </div>
      </div>

      {/* Orientation & Body Mods quick summary */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Orientation (Sexual)
            </span>
          </label>
          <select
            className="select select-bordered w-full"
            value={extra.orientation}
            onChange={(e) => updateExtra("orientation", e.target.value)}
          >
            <option value="Heterosexual">Heterosexual (Straight)</option>
            <option value="Homosexual">Homosexual (Gay)</option>
            <option value="Pansexual">Pansexual</option>
            <option value="Asexual">Asexual</option>
            <option value="Unknown">Unknown</option>
          </select>
          <span className="label-text-alt text-xs mt-1">
            This value is written to the <code>orientation</code> field on the
            character record.
          </span>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Body Modifications (summary)
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="High-level summary of cyberware, augmentations, piercings, etc."
            value={extra.bodyModifications}
            onChange={(e) => updateExtra("bodyModifications", e.target.value)}
          />
          <span className="label-text-alt text-xs mt-1">
            We also auto-append detailed lists from the Anatomy step (scars,
            tattoos, etc.) into the final backend <code>bodyMods</code> string.
          </span>
        </div>
      </div>

      {/* Model / pipeline hook */}
      <div className="form-control mt-4 md:col-span-2">
        <label className="label">
          <span className="label-text font-semibold">
            Model / 3D Template Identifier
          </span>
        </label>
        <input
          className="input input-bordered w-full"
          placeholder="e.g. mblab_female_base_01, blender_rig_v2, custom_model_id"
          value={extra.model}
          onChange={(e) => updateExtra("model", e.target.value)}
        />
        <span className="label-text-alt text-xs mt-1">
          Optional: use this to tie the character to a specific Blender / MB-Lab
          / rig template in your pipeline.
        </span>
      </div>
    </div>
  );

  const renderOtherStep = () => (
    <div className="card bg-base-100 shadow-md p-6 space-y-4">
      <>{renderExtras()}</>

      <h2 className="text-2xl font-bold mb-2">Visuals & Extras</h2>
      <p className="text-sm opacity-70 mb-4">
        Reference images and general inspiration for this character.
      </p>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">
            Inspiration / References
          </span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="List media, characters, aesthetics that inspired this character."
          value={profile.other.inspiration}
          onChange={(e) => updateOther("inspiration", e.target.value)}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Reference Images</span>
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          className="file-input file-input-bordered w-full"
          onChange={handleImageInputChange}
        />
        <span className="label-text-alt text-xs mt-1">
          The first image will be used as the character sheet preview in the
          backend.
        </span>
      </div>

      {/* Anatomy JSON file */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Anatomy File (JSON)</span>
        </label>
        <input
          type="file"
          accept=".json"
          className="file-input file-input-bordered w-full"
          onChange={handleJsonDataInputChange}
        />
        <span className="label-text-alt text-xs mt-1">
          This is the exported anatomy JSON. It will be stored in the existing{" "}
          <code>anatomy</code> field.
        </span>
      </div>

      {/* Family selection (from store) */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">
            Select a Family (optional)
          </span>
        </label>
        <select
          className="select select-bordered w-full"
          value={selectedFamilyId}
          onChange={(e) => setSelectedFamilyId(e.target.value)}
        >
          <option value="">-- Choose a Family --</option>
          {families.map((family) => (
            <option key={family.id} value={family.id}>
              {family.familyName}
            </option>
          ))}
        </select>
      </div>

      {/* Image preview carousel */}
      {images.length > 0 && (
        <div className="mt-4">
          <div className="carousel w-full rounded-box border border-base-300">
            {images.map((image, index) => (
              <div key={index} className="carousel-item w-full justify-center">
                <img
                  src={image}
                  alt={`Reference ${index + 1}`}
                  className="object-contain max-h-80"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const steps = [
    renderIdentityStep(),
    renderAnatomyStep(),
    renderPersonalityStep(),
    renderBioStep(),
    renderOtherStep(),
  ];

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-4xl font-bold mb-2">Create a New Character</h1>
      <p className="opacity-70 max-w-3xl">
        Fill in your character profile step-by-step. We&apos;ll map this
        structured data back into your existing backend fields, so your API and
        database stay exactly the same.
      </p>

      <div>
        <QuickPrefillPanel onApply={applyPrefill} />
      </div>

      {/* Steps indicator */}
      <ul className="steps steps-horizontal w-full mb-4">
        <li className={`step ${currentStep >= 0 ? "step-primary" : ""}`}>
          Identity
        </li>
        <li className={`step ${currentStep >= 1 ? "step-primary" : ""}`}>
          Anatomy
        </li>
        <li className={`step ${currentStep >= 2 ? "step-primary" : ""}`}>
          Personality
        </li>
        <li className={`step ${currentStep >= 3 ? "step-primary" : ""}`}>
          Bio
        </li>
        <li className={`step ${currentStep >= 4 ? "step-primary" : ""}`}>
          Other
        </li>
      </ul>

      <form onSubmit={onSubmit} className="space-y-4">
        {steps[currentStep]}

        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="btn"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          >
            « Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              className="btn btn-neutral"
              // className={`btn btn-neutral ${isLoading ? "btn-disabled" : ""}`}
              //disabled={isLoading}
              onClick={() =>
                setCurrentStep((s) => Math.min(steps.length - 1, s + 1))
              }
            >
              {/* {isLoading ? "Loading..." : "Next »"} */}
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary"
              // className={`btn btn-primary ${isLoading ? "btn-disabled" : ""}`}
              // disabled={isLoading}
            >
              {/* {isLoading ? "Saving..." : "Save Character"} */}
              Save Character
            </button>
          )}
        </div>
      </form>

      <AddCharacterPreview
        characterProfile={epubGenProfile}
        characterSheet={characterSheetDisplay}
        clearForm={clearForm}
        clearFormFn={setClearForm}
      />
    </div>
  );
}

export default AddNewCharacter;
