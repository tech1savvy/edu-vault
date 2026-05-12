import Card from "../components/ui/Card";
import CertificationsForm from "../components/Resume/Forms/CertificationsForm";

const CertificationsPage = () => {
  return (
    <Card title="Certifications" subtitle="Credentials stored for your account.">
      <CertificationsForm />
    </Card>
  );
};

export default CertificationsPage;
