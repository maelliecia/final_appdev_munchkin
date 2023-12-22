import AdminLayout from '../../components/layouts/AdminLayout';
import TableMessages from '../../components/TableMessages';

export default function AdminComments() {

  return (
    <>
      <AdminLayout>
        <h1>User Messages</h1>
        <TableMessages />
      </AdminLayout>
    </>
  );
}