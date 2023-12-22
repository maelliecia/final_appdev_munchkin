import AdminLayout from '../../components/layouts/AdminLayout';
import TableReviews from '../../components/TableReviews';

export default function AdminReviews() {

  return (
    <>
      <AdminLayout>
        <h1>User Reviews</h1>
        <TableReviews />
      </AdminLayout>
    </>
  );
}