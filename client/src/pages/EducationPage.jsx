import Card from "../components/ui/Card";
import EducationForm from "../components/Resume/Forms/EducationForm";

const EducationPage = () => {
  return (
    <Card title="Education" subtitle="Your degrees and schools from the database.">
      <EducationForm />
    </Card>
  );
};

export default EducationPage;
