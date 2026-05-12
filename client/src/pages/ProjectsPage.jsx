import Card from "../components/ui/Card";
import ProjectsForm from "../components/Resume/Forms/ProjectsForm";

const ProjectsPage = () => {
  return (
    <Card title="Projects" subtitle="Projects tied to your user; same data as your portfolio and CV.">
      <ProjectsForm />
    </Card>
  );
};

export default ProjectsPage;
