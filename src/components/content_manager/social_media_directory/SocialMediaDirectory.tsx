import React from 'react';
import ProjectUpdatePosts from "./ProjectUpdatePosts";

// Separate data into its own file for better organization
const projectUpdates = [
  {
    title: "Cyberpunk",
    media: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/City_Scene_in_the_style_of_Blade_Runner_02.jpg/640px-City_Scene_in_the_style_of_Blade_Runner_02.jpg",
    caption: "A thrilling dive into the neon-lit underworld of cybernetic rebellion!",
    hashtags: "#Cyberpunk #Dystopia #SciFi",
    tags: "graphic novel, cyberpunk, futuristic",
    targetAudience: "Sci-fi enthusiasts, gamers, tech lovers",
    adRun: true,
    cost: "$500"
  },
  // ... other project updates (kept same as original)
];

const projectPromotionals = [
  {
    "title": "Cyberpunk Mythology",
    "media": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/City_Scene_in_the_style_of_Blade_Runner_02.jpg/640px-City_Scene_in_the_style_of_Blade_Runner_02.jpg",
    "caption": "A thrilling dive into the neon-lit underworld of cybernetic rebellion!",
    "hashtags": "#Cyberpunk #Dystopia #SciFi",
    "tags": "graphic novel, cyberpunk, futuristic",
    "targetAudience": "Sci-fi enthusiasts, gamers, tech lovers",
    "adRun": true,
    "cost": "$500"
  },
  {
    "title": "Mythos Reborn",
    "media": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/2021-09-29_lofi_cyberpunk_by_david-revoy.jpg/640px-2021-09-29_lofi_cyberpunk_by_david-revoy.jpg",
    "caption": "Experience classic mythology reimagined for a modern audience.",
    "hashtags": "#Mythology #Legends #Fantasy",
    "tags": "mythology, fantasy, adventure",
    "targetAudience": "History buffs, fantasy lovers, classic literature fans",
    "adRun": false,
    "cost": "$250"
  },
  {
    "title": "Galactic Outlaws",
    "media": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Cyberpunk_girl_3.jpg/640px-Cyberpunk_girl_3.jpg",
    "caption": "Rogue space adventurers on a mission to reclaim the galaxy!",
    "hashtags": "#SpaceOpera #SciFi #Adventure",
    "tags": "space, sci-fi, adventure",
    "targetAudience": "Sci-fi readers, Star Wars fans, space enthusiasts",
    "adRun": true,
    "cost": "$600"
  },
  {
    "title": "Shadowborn",
    "media": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Cyberpunk_city_created_by_Stable_Diffusion.webp/640px-Cyberpunk_city_created_by_Stable_Diffusion.webp.png",
    "caption": "A dark and gritty noir mystery filled with twists and betrayal.",
    "hashtags": "#Noir #Mystery #Crime",
    "tags": "detective, noir, crime",
    "targetAudience": "Mystery lovers, thriller fans, crime fiction readers",
    "adRun": false,
    "cost": "$300"
  },
  {
    "title": "Neon Samurai",
    "media": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Cyberpunk_women.png/640px-Cyberpunk_women.png",
    "caption": "Honor, betrayal, and cybernetic warriors clash in this epic saga.",
    "hashtags": "#Samurai #Cyberpunk #Action",
    "tags": "samurai, cyberpunk, action",
    "targetAudience": "Anime fans, martial arts enthusiasts, cyberpunk lovers",
    "adRun": true,
    "cost": "$700"
  }
];

const projectPosts = [
  {
    title: "Cyberpunk",
    media: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/City_Scene_in_the_style_of_Blade_Runner_02.jpg/640px-City_Scene_in_the_style_of_Blade_Runner_02.jpg",
    caption: "A thrilling dive into the neon-lit underworld of cybernetic rebellion!",
    hashtags: "#Cyberpunk #Dystopia #SciFi",
    tags: "graphic novel, cyberpunk, futuristic",
    targetAudience: "Sci-fi enthusiasts, gamers, tech lovers",
    adRun: true,
    budget: "$500",
    facebook: [
      {
        title: "Cyberpunk Sneak Peek",
        thumbnail: "https://img.freepik.com/free-vector/sport-youtube-thumbnail-template_23-2148689986.jpg",
        media: "https://example.com/media1",
        caption: "Explore the neon-drenched streets of the future!",
        hashtags: "#Cyberpunk #Future",
        mentions: "@Cyberworld",
        adCost: "200",
        adRun: true
      }
    ],
    tiktok: [
      {
        title: "Cyberpunk Teaser",
        thumbnail: "https://via.placeholder.com/100",
        media: "https://example.com/media2",
        caption: "A glimpse into a dystopian world!",
        hashtags: "#Dystopia #CyberRebels",
        mentions: "@SciFiLife",
        adCost: "300",
        adRun: true
      }
    ],
    medium: [],
    linkedIn: [],
    youtube: [],
    instagram: [],
    twitter: []
  },
  {
    title: "Mythos Reborn",
    media: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/2021-09-29_lofi_cyberpunk_by_david-revoy.jpg/640px-2021-09-29_lofi_cyberpunk_by_david-revoy.jpg",
    caption: "Experience classic mythology reimagined for a modern audience.",
    hashtags: "#Mythology #Legends #Fantasy",
    tags: "mythology, fantasy, adventure",
    targetAudience: "History buffs, fantasy lovers, classic literature fans",
    adRun: false,
    budget: "$250",
    facebook: [],
    tiktok: [],
    medium: [
      {
        title: "Greek Gods in a New Era",
        thumbnail: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/f12372163447587.63e5cf894637b.jpg",
        media: "https://example.com/media3",
        caption: "A deep dive into ancient myths in a modern world.",
        hashtags: "#GreekMyth #MythosReborn",
        mentions: "@MythLover",
        adCost: "150",
        adRun: false
      }
    ],
    linkedIn: [],
    youtube: [],
    instagram: [],
    twitter: []

  },
  {
    title: "Galactic Outlaws",
    media: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Cyberpunk_girl_3.jpg/640px-Cyberpunk_girl_3.jpg",
    caption: "Rogue space adventurers on a mission to reclaim the galaxy!",
    hashtags: "#SpaceOpera #SciFi #Adventure",
    tags: "space, sci-fi, adventure",
    targetAudience: "Sci-fi readers, Star Wars fans, space enthusiasts",
    adRun: true,
    budget: "$600",
    facebook: [
      {
        title: "Meet the Outlaws",
        thumbnail: "https://img.freepik.com/free-psd/digital-marketing-agency-corporate-web-banner-template_120329-2077.jpg",
        media: "https://example.com/media4",
        caption: "Join the intergalactic rebellion!",
        hashtags: "#SpaceWars #GalacticRebels",
        mentions: "@StarBound",
        adCost: "400",
        adRun: true
      }
    ],
    tiktok: [],
    medium: [],
    linkedIn: [],
    youtube: [],
    instagram: [],
    twitter: []

  },
  {
    title: "Shadowborn",
    media: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Cyberpunk_city_created_by_Stable_Diffusion.webp/640px-Cyberpunk_city_created_by_Stable_Diffusion.webp.png",
    caption: "A dark and gritty noir mystery filled with twists and betrayal.",
    hashtags: "#Noir #Mystery #Crime",
    tags: "detective, noir, crime",
    targetAudience: "Mystery lovers, thriller fans, crime fiction readers",
    adRun: false,
    budget: "$300",
    facebook: [],
    tiktok: [],
    medium: [],
    linkedIn: [
      {
        title: "Behind the Shadows",
        thumbnail: "https://3veta.com/wp-content/uploads/2022/02/92.-How-To-Promote-Your-Consulting-Business-On-Social-Media-Thumbnail.png",
        media: "https://example.com/media5",
        caption: "A deep look into crime fiction’s most intriguing mysteries.",
        hashtags: "#CrimeStory #Detective",
        mentions: "@ThrillerFans",
        adCost: "250",
        adRun: false
      }
    ],
    youtube: [],
    instagram: [],
    twitter: []

  },
  {
    title: "Neon Samurai",
    media: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Cyberpunk_women.png/640px-Cyberpunk_women.png",
    caption: "Honor, betrayal, and cybernetic warriors clash in this epic saga.",
    hashtags: "#Samurai #Cyberpunk #Action",
    tags: "samurai, cyberpunk, action",
    targetAudience: "Anime fans, martial arts enthusiasts, cyberpunk lovers",
    adRun: true,
    budget: "$700",
    facebook: [],
    tiktok: [],
    medium: [],
    linkedIn: [],
    youtube: [
      {
        title: "Neon Samurai Trailer",
        thumbnail: "https://cdn.prod.website-files.com/61cdf3c5e0b8152652e01082/65ca5b8dab2dd8c1f35ae594_thumbnail_How-to-Use-Hyperlocal-Social-Media-Marketing-to-Improve-Conversions.jpg",
        media: "https://example.com/media6",
        caption: "Watch the stunning trailer for Neon Samurai!",
        hashtags: "#SamuraiShowdown #NeonFighter",
        mentions: "@AnimeWorld",
        adCost: "600",
        adRun: true
      }
    ],
    instagram: [],
    twitter: []

  }
];

// Extracted data for cleaner component
function SocialMediaDirectory() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Creative Project Showcase
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our collection of unique creative projects, each representing a distinct narrative world.
          Every card below is a standalone project, meticulously crafted with its own unique theme,
          target audience, and multi-platform marketing strategy. From cyberpunk adventures to mythological
          reimaginings, each project tells a compelling story across different social media channels.
        </p>
      </div>

      <div className="space-y-4">
        <ProjectUpdatePosts
          projects={projectPosts}
        />
      </div>

    </div>
  );
}

export default SocialMediaDirectory;

// Optional: Create a separate file for data constants
export { projectUpdates, projectPromotionals, projectPosts };