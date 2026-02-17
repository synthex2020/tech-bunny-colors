// src/logic/epubGenerator.ts
import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { CharacterProfile } from "../types";

const escapeXml = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const joinOrDash = (items: string[]) => {
  if (items) {
    return items.toString();
  }
  return "";
};

export async function downloadCharacterEpub(
  profile: CharacterProfile,
  characterSheetUrl: string | null | undefined
) {
  const zip = new JSZip();
  console.log(profile);
  const { identity, anatomy, personality, bio, other } = profile;

  const displayName =
    profile.identity.name || profile.identity.nickname || "Unnamed character";

  const safeName =
    displayName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "character";

  // --- 1) Required EPUB root files ---

  // `mimetype` MUST be first and uncompressed
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });

  // container.xml
  zip.file(
    "META-INF/container.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0"
  xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf"
              media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`
  );

  // --- 2) Optional: fetch character sheet image ---

  let hasImage = false;
  let imageExt = "png";

  if (characterSheetUrl) {
    try {
      const res = await fetch(characterSheetUrl);
      if (res.ok) {
        const contentType = res.headers.get("Content-Type") || "";
        if (contentType.includes("jpeg") || contentType.includes("jpg")) {
          imageExt = "jpg";
        } else if (contentType.includes("png")) {
          imageExt = "png";
        }
        const buffer = await res.arrayBuffer();
        zip.file(`OEBPS/images/character-sheet.${imageExt}`, buffer);
        hasImage = true;
      }
    } catch (e) {
      console.warn("Failed to fetch character sheet for EPUB:", e);
    }
  }

  // --- 3) HTML content pages ---

  const frontPageHtml = `<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
  <head>
    <title>${escapeXml(displayName)} – Character Sheet</title>
    <meta charset="utf-8" />
    <style>
      body { font-family: sans-serif; margin: 1.5rem; }
      h1 { font-size: 1.6rem; margin-bottom: 0.5rem; }
      h2 { font-size: 1.1rem; margin-top: 1.5rem; }
      .sheet-img {
        max-width: 100%;
        height: auto;
        border: 1px solid #aaa;
      }
      .meta { margin-top: 1rem; font-size: 0.9rem; color: #555; }
    </style>
  </head>
  <body>
    <h1>${escapeXml(displayName)}</h1>
    <p>${escapeXml(personality.personality || "Character sheet")}</p>
    ${
      hasImage
        ? `<figure>
             <img
               class="sheet-img"
               src="../images/character-sheet.${imageExt}"
               alt="Character sheet for ${escapeXml(displayName)}" />
             <figcaption>Character sheet reference</figcaption>
           </figure>`
        : `<p><em>No character sheet image available.</em></p>`
    }
    <div class="meta">
      <p><strong>Created from:</strong> Jennifer CharacterProfile data</p>
      ${
        other.inspiration
          ? `<p><strong>Inspiration:</strong> ${escapeXml(
              other.inspiration
            )}</p>`
          : ""
      }
    </div>
  </body>
</html>`;

  const detailsPageHtml = `<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
  <head>
    <title>${escapeXml(displayName)} – Details</title>
    <meta charset="utf-8" />
    <style>
      body { font-family: sans-serif; margin: 1.5rem; }
      h1 { font-size: 1.6rem; margin-bottom: 0.5rem; }
      h2 { font-size: 1.1rem; margin-top: 1.3rem; }
      table {
        border-collapse: collapse;
        width: 100%;
        margin-bottom: 1rem;
        table-layout: fixed;
      }
      th, td {
        border: 1px solid #999;
        padding: 0.35rem;
        font-size: 0.8rem;
        vertical-align: top;
      }
      th {
        background: #f2f2f2;
        text-align: left;
        width: 28%;
      }
      .section-title {
        background: #ddd;
        font-weight: bold;
        text-transform: uppercase;
      }
    </style>
  </head>
  <body>
    <h1>${escapeXml(displayName)} – Profile</h1>

    <h2>Core Data</h2>
    <table>
      <tr>
        <th>Names / Nicknames</th>
        <td>${escapeXml(
          [identity.name, identity.nickname].filter(Boolean).join(" / ") || "—"
        )}</td>
      </tr>
      <tr>
        <th>Birthday / Age</th>
        <td>${escapeXml(
          (bio.dob ? `${bio.dob}` : "—") + ` / Age: ${anatomy.age || "—"}`
        )}</td>
      </tr>
      <tr>
        <th>Sex / Gender</th>
        <td>${escapeXml(
          `${anatomy.sex || "—"} / ${identity.gender || "—"}`
        )}</td>
      </tr>
      <tr>
        <th>Birthplace</th>
        <td>${escapeXml(bio.birthplace || "—")}</td>
      </tr>
      <tr>
        <th>Height / Weight</th>
        <td>${escapeXml(
          `${anatomy.height || "—"} / ${anatomy.weight || "—"}`
        )}</td>
      </tr>
      <tr>
        <th>Blood Type</th>
        <td>${escapeXml(anatomy.bloodType || "—")}</td>
      </tr>
      <tr>
        <th>Race / Species</th>
        <td>${escapeXml(
          `${anatomy.race || "—"} / ${anatomy.species || "—"}`
        )}</td>
      </tr>
      <tr>
        <th>Religion</th>
        <td>${escapeXml(identity.religion || "—")}</td>
      </tr>
    </table>

    <h2>Physical Details</h2>
    <table>
      <tr>
        <th>Eyesight / Colour Blind / Glasses</th>
        <td>${escapeXml(
          `${anatomy.eyesight || "—"}; Color blind: ${
            anatomy.colorBlind || "—"
          }; Glasses: ${anatomy.glasses ? "Yes" : "No"}`
        )}</td>
      </tr>
      <tr>
        <th>Eye &amp; Hair Colour / Voice</th>
        <td>${escapeXml(
          `Eyes: ${anatomy.eyes || "—"}; Nose: ${anatomy.nose || "—"}; Hair: ${
            other.inspiration || "—"
          }; Voice: ${anatomy.voice_type || "—"}`
        )}</td>
      </tr>
      <tr>
        <th>Body Type / Posture / Legs / Breast</th>
        <td>${escapeXml(
          `Body type: ${anatomy.bodyType || "—"}; Posture: ${
            anatomy.posture || "—"
          }; Legs: ${anatomy.legs || "—"}; Chest: ${anatomy.breast || "—"}`
        )}</td>
      </tr>
      <tr>
        <th>Scars / Burns / Tattoos</th>
        <td>${escapeXml(
          `Scars: ${joinOrDash(anatomy.scars)}; Burns: ${joinOrDash(
            anatomy.burns
          )}; Tattoos: ${joinOrDash(anatomy.tattoos)}`
        )}</td>
      </tr>
      <tr>
        <th>Birthmarks / Moles / Skin Damage</th>
        <td>${escapeXml(
          `Birthmarks: ${joinOrDash(anatomy.birthmarks)}; Moles: ${joinOrDash(
            anatomy.moles
          )}; Skin damage: ${joinOrDash(anatomy.skinDamage)}`
        )}</td>
      </tr>
    </table>

    <h2>Medical &amp; History</h2>
    <table>
      <tr>
        <th>Surgeries / Illnesses</th>
        <td>${escapeXml(
          `Surgeries: ${joinOrDash(
            bio.surgeries
          )}; Cavities / dental: ${joinOrDash(bio.cavities)}`
        )}</td>
      </tr>
      <tr>
        <th>Criminal Record / Education</th>
        <td>${escapeXml(
          `Criminal record: ${joinOrDash(bio.criminalRecord)}; Education: ${
            identity.education || "—"
          }`
        )}</td>
      </tr>
      <tr>
        <th>Forming Experiences</th>
        <td>${escapeXml(bio.childhood || "—")}</td>
      </tr>
      <tr>
        <th>Sexual History / Lovers</th>
        <td>${escapeXml(
          `Sexual history: ${joinOrDash(
            bio.sexualHistory
          )}; Current lovers: ${joinOrDash(
            bio.currentLovers
          )}; Past lovers: ${joinOrDash(bio.pastLovers)}`
        )}</td>
      </tr>
      <tr>
        <th>Relationships</th>
        <td>${escapeXml(
          `Status: ${bio.relationshipStatus || "—"}; Family: ${
            bio.familyRelationships || "—"
          }; Problem relationships: ${bio.problemRelationships || "—"}`
        )}</td>
      </tr>
      <tr>
        <th>People admired / hated</th>
        <td>${escapeXml(
          `Admires: ${joinOrDash(bio.admires)}; Hates: ${joinOrDash(bio.hates)}`
        )}</td>
      </tr>
      <tr>
        <th>Dreams for the future</th>
        <td>${escapeXml(joinOrDash(bio.dreams))}</td>
      </tr>
      <tr>
        <th>Fears</th>
        <td>${escapeXml(joinOrDash(bio.fears))}</td>
      </tr>
    </table>

    <h2>Personality, Work &amp; Hobbies</h2>
    <table>
      <tr>
        <th class="section-title">Personality</th>
        <td>${escapeXml(personality.personality || "—")}</td>
      </tr>
      <tr>
        <th>Favorite sayings</th>
        <td>${escapeXml(personality.sayings || "—")}</td>
      </tr>
      <tr>
        <th>Insecurities</th>
        <td>${escapeXml(joinOrDash(personality.insecurities))}</td>
      </tr>
      <tr>
        <th>Employment / School</th>
        <td>${escapeXml(joinOrDash(identity.career))}</td>
      </tr>
      <tr>
        <th>Economic Status / Behaviour</th>
        <td>—</td>
      </tr>
      <tr>
        <th>Pets / Plants</th>
        <td>${escapeXml(
          `Pets: ${joinOrDash(identity.pets)}; Plants: ${joinOrDash(
            identity.plants
          )}`
        )}</td>
      </tr>
      <tr>
        <th>Hobbies / Recreation</th>
        <td>${escapeXml(`${personality.hobbies || "—"}`)}</td>
      </tr>
      <tr>
        <th>Favorite things</th>
        <td>${escapeXml(
          `Colour: ${identity.favouriteColor || "—"}; Food: ${
            identity.favouriteFood || "—"
          }; Object: ${identity.favouriteObject || "—"}; Lucky number: ${
            identity.luckyNumber ?? "—"
          }`
        )}</td>
      </tr>
      <tr>
        <th>Supernatural Abilities / Class</th>
        <td>${escapeXml(
          `Class: ${identity.supernatural.class || "—"}; Fight style: ${
            identity.supernatural.fightStyle || "—"
          }; Elements: ${
            [
              identity.supernatural.primaryElement,
              identity.supernatural.secondaryElement,
              identity.supernatural.tertiaryElement,
            ]
              .filter(Boolean)
              .join(", ") || "—"
          }; Strengths: ${joinOrDash(
            identity.supernatural.strengths
          )}; Weaknesses: ${joinOrDash(identity.supernatural.weaknesses)}`
        )}</td>
      </tr>
      <tr>
        <th>Successes / Failures</th>
        <td>${escapeXml(
          `Successes: ${joinOrDash(bio.successes)}; Failures: ${joinOrDash(
            bio.failures
          )}`
        )}</td>
      </tr>
      <tr>
        <th>Philosophy of Love / Relationships</th>
        <td>${escapeXml(
          `Love: ${bio.philosphyLove || "—"}; Relationships: ${
            bio.phiolosphyRelationships || "—"
          }`
        )}</td>
      </tr>
    </table>
  </body>
</html>`;

  zip.file("OEBPS/text/front.xhtml", frontPageHtml);
  zip.file("OEBPS/text/details.xhtml", detailsPageHtml);

  // --- 4) content.opf & nav (very minimal) ---

  const manifestItems = [
    `<item id="front" href="text/front.xhtml" media-type="application/xhtml+xml"/>`,
    `<item id="details" href="text/details.xhtml" media-type="application/xhtml+xml"/>`,
    `<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>`,
    hasImage
      ? `<item id="sheet" href="images/character-sheet.${imageExt}" media-type="image/${
          imageExt === "jpg" ? "jpeg" : "png"
        }"/>`
      : "",
  ]
    .filter(Boolean)
    .join("\n      ");

  const spineItems = `
      <itemref idref="front"/>
      <itemref idref="details"/>
  `;

  zip.file(
    "OEBPS/content.opf",
    `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf"
  unique-identifier="BookId"
  version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="BookId">urn:uuid:${crypto.randomUUID()}</dc:identifier>
    <dc:title>${escapeXml(displayName)} – Character Sheet</dc:title>
    <dc:language>en</dc:language>
  </metadata>
  <manifest>
      ${manifestItems}
  </manifest>
  <spine>
      ${spineItems}
  </spine>
</package>`
  );

  // simple nav
  zip.file(
    "OEBPS/nav.xhtml",
    `<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:epub="http://www.idpf.org/2007/ops">
  <head>
    <title>Navigation</title>
    <meta charset="utf-8" />
  </head>
  <body>
    <nav epub:type="toc" id="toc">
      <h1>Table of Contents</h1>
      <ol>
        <li><a href="text/front.xhtml">Character Sheet</a></li>
        <li><a href="text/details.xhtml">Profile Details</a></li>
      </ol>
    </nav>
  </body>
</html>`
  );

  // --- 5) Export ZIP as .epub ---

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${safeName || "character"}.epub`);
}
