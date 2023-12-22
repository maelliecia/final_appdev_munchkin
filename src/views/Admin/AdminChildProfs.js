import AdminLayout from '../../components/layouts/AdminLayout';
import TableProfiles from '../../components/TableProfiles';

export default function AdminChildProfs() {

  return (
    <>
      <AdminLayout>
        <h1>Child Profiles</h1>
        <TableProfiles />
      </AdminLayout>
    </>
  );
}