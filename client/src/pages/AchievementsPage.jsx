import Card from "../components/ui/Card";
import AchievementsForm from "../components/Resume/Forms/AchievementsForm";

const AchievementsPage = () => {
  return (
    <Card title="Achievements" subtitle="Honors and wins from your saved resume.">
      <AchievementsForm />
    </Card>
  );
};

export default AchievementsPage;
