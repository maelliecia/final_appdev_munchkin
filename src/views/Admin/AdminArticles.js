import AdminLayout from '../../components/layouts/AdminLayout';
import TableArticles from '../../components/TableArticles';

export default function AdminArticles() {

  return (
    <>
      <AdminLayout>
        <h1>Articles</h1>
        <TableArticles />
      </AdminLayout>
    </>
  );
}