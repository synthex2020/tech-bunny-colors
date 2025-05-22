import { useEffect, useState } from "react";
import ProjectUpdatePosts from "./ProjectUpdatePosts";
import { fetch_projects, Project } from "../../../persistence/ProjectsPersistence";

function SocialMediaDirectory() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      const data = await fetch_projects();
      if (data) {
        setProjects(data);
      }
      setLoading(false);
    }
    loadProjects();
  }, []);

  return (
    <div>
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Our Projects</h1>
          <p className="text-sm max-w-2xl mx-auto">
            Explore our collection of unique creative projects, each representing a distinct narrative world.
            Every card below is a standalone project, meticulously crafted with its own unique theme,
            target audience, and multi-platform marketing strategy. From cyberpunk adventures to mythological
            reimaginings, each project tells a compelling story across different social media channels.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading projects...</div>
        ) : (
          <div className="space-y-4">
            <ProjectUpdatePosts projects={projects} />
          </div>
        )}
      </div>
    </div>
  );
}

export default SocialMediaDirectory;
