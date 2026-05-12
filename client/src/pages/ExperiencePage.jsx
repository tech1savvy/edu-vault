import Card from "../components/ui/Card";
import ExperienceForm from "../components/Resume/Forms/ExperienceForm";

const ExperiencePage = () => {
  return (
    <Card title="Experience" subtitle="Work and roles from your account. Add, edit, or remove entries.">
      <ExperienceForm embedded />
    </Card>
  );
};

export default ExperiencePage;
