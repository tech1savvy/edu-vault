import Card from "../components/ui/Card";
import Skills from "../components/Resume/Skills";

const SkillsPage = () => {
  return (
    <Card title="Skills" subtitle="Skills load from the database after login.">
      <Skills isInput embedded />
    </Card>
  );
};

export default SkillsPage;
