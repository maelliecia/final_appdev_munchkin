import AdminLayout from '../../components/layouts/AdminLayout';
import TableRecipes from '../../components/TableRecipes';

export default function AdminRecipes() {

  return (
    <>
      <AdminLayout>
        <h1>Recipes</h1>
        <TableRecipes />
      </AdminLayout>
    </>
  );
}