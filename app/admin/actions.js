'use server';
import { revalidatePath } from 'next/cache';
import db from '@/lib/db';
import { isAdmin } from '@/lib/admin';

const guard = async () => {
  if (!(await isAdmin())) throw new Error('Access denied: Admin credentials required.');
};

const specs = s => {
  return JSON.stringify(
    Object.fromEntries(
      String(s || '')
        .split(';')
        .filter(x => x.includes(':'))
        .map(x => x.split(':').map(y => y.trim()))
    )
  );
};

const done = () => {
  revalidatePath('/admin');
  revalidatePath('/');
  revalidatePath('/products');
};

export async function addProduct(f) {
  try {
    await guard();
    const name = f.get('name')?.toString().trim();
    const brand = f.get('brand')?.toString().trim();
    const part_no = f.get('part_no')?.toString().trim();
    const category_id = Number(f.get('category_id'));
    const price = Number(f.get('price')) || 0;
    const availability = f.get('availability')?.toString() || 'In Stock';
    const specsStr = specs(f.get('specs'));

    if (!name || !brand || !part_no) {
      return { success: false, error: 'Name, brand, and part number are required.' };
    }

    await db.run(
      'INSERT INTO products(name, brand, part_no, category_id, price, availability, specs) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, brand, part_no, category_id, price, availability, specsStr]
    );
    done();
    return { success: true, message: `Product "${name}" added successfully!` };
  } catch (err) {
    console.error('Error adding product:', err);
    return { success: false, error: err.message || 'Failed to add product.' };
  }
}

export async function updateProduct(f) {
  try {
    await guard();
    const id = Number(f.get('id'));
    const price = Number(f.get('price')) || 0;
    const availability = f.get('availability')?.toString() || 'In Stock';

    await db.run(
      'UPDATE products SET price = ?, availability = ? WHERE id = ?',
      [price, availability, id]
    );
    done();
    return { success: true, message: `Product #${id} updated successfully!` };
  } catch (err) {
    console.error('Error updating product:', err);
    return { success: false, error: err.message || 'Failed to update product.' };
  }
}

export async function delProduct(f) {
  try {
    await guard();
    const id = Number(f.get('id'));
    await db.run('DELETE FROM products WHERE id = ?', [id]);
    done();
    return { success: true, message: `Product #${id} deleted successfully!` };
  } catch (err) {
    console.error('Error deleting product:', err);
    return { success: false, error: err.message || 'Failed to delete product.' };
  }
}

export async function setStatus(f) {
  try {
    await guard();
    const id = Number(f.get('id'));
    const status = f.get('status')?.toString();

    await db.run('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    done();
    return { success: true, message: `Order #${id} status changed to ${status}!` };
  } catch (err) {
    console.error('Error changing status:', err);
    return { success: false, error: err.message || 'Failed to update order status.' };
  }
}
