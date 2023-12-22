import AdminLayout from '../../components/layouts/AdminLayout';
import TableUsers from '../../components/TableUsers';

export default function AdminArticles() {

  return (
    <>
      <AdminLayout>
        <h1>Users</h1>
        <TableUsers />
      </AdminLayout>
    </>
  );
}