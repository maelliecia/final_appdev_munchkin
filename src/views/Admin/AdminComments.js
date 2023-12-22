import AdminLayout from '../../components/layouts/AdminLayout';
import TableComments from '../../components/TableComments';

export default function AdminComments() {

  return (
    <>
      <AdminLayout>
        <h1>User Comments</h1>
        <TableComments />
      </AdminLayout>
    </>
  );
}