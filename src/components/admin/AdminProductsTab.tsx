import React, { useState } from 'react';
import {
  createProduct,
  deleteProduct,
  ProductPayload,
  updateProduct,
} from '../../services/productApi';
import { ProductItem } from '../../types/farm.types';
import { ImageUploaderField } from './ImageUploaderField';

interface AdminProductsTabProps {
  products: ProductItem[];
  onReload: () => Promise<void>;
  onNotify: (msg: string) => void;
}

const EMPTY_FORM: ProductPayload = {
  name: '',
  category: 'Trái cây tươi',
  description: '',
  spec1: 'Quả to 450 - 550g',
  spec2: 'Ngọt đậm, vỏ mỏng, ít hạt',
  unit: 'Hộp 6 quả',
  priceVnd: 450000,
  imageFile: 'imgRectangle222.png',
  stock: 50,
  isFeatured: false,
};

/**
 * Tab Quản lý Sản phẩm (Thêm mới / Tải ảnh Supabase Storage / Sửa / Xóa)
 */
export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  products,
  onReload,
  onNotify,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductPayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const startEdit = (item: ProductItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category || 'Trái cây tươi',
      description: item.description || '',
      spec1: item.spec1,
      spec2: item.spec2,
      unit: item.unit,
      priceVnd: item.priceVnd ?? 0,
      imageFile: item.imageFile || 'imgRectangle16.png',
      stock: item.stock ?? 50,
      isFeatured: Boolean(item.isFeatured),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const res = await updateProduct(editingId, form);
        onNotify(res.message || 'Đã cập nhật sản phẩm.');
      } else {
        const res = await createProduct(form);
        onNotify(res.message || 'Đã thêm sản phẩm mới.');
      }
      cancelEdit();
      await onReload();
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Lỗi lưu sản phẩm.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: ProductItem) => {
    if (!window.confirm(`Bạn muốn xóa sản phẩm "${item.name}"?`)) return;
    try {
      const res = await deleteProduct(item.id);
      onNotify(res.message || 'Đã xóa sản phẩm.');
      await onReload();
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Không thể xóa sản phẩm.');
    }
  };

  return (
    <div className="htf-admin__split">
      <section className="htf-admin__panel">
        <div className="htf-admin__panel-head">
          <h2>{editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
          {editingId && (
            <button type="button" className="htf-admin__btn-light" onClick={cancelEdit}>
              Hủy sửa
            </button>
          )}
        </div>

        <form className="htf-admin__form" onSubmit={handleSubmit}>
          <label>
            Tên sản phẩm *
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ví dụ: Vú sữa Hoàng Kim – Hộp 8 quả"
              required
            />
          </label>

          <div className="htf-admin__form-2">
            <label>
              Danh mục
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Trái cây tươi">Trái cây tươi</option>
                <option value="Quà biếu">Quà biếu</option>
                <option value="Combo">Combo</option>
              </select>
            </label>

            <label>
              Đơn vị đóng gói *
              <input
                type="text"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                placeholder="Hộp 6 quả, Giỏ quà, Túi 2kg..."
                required
              />
            </label>
          </div>

          <div className="htf-admin__form-2">
            <label>
              Giá bán (VNĐ) *
              <input
                type="number"
                min={1000}
                step={1000}
                value={form.priceVnd}
                onChange={(e) => setForm({ ...form, priceVnd: Number(e.target.value) })}
                required
              />
            </label>

            <label>
              Tồn kho *
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                required
              />
            </label>
          </div>

          <label>
            Thông số 1 *
            <input
              type="text"
              value={form.spec1}
              onChange={(e) => setForm({ ...form, spec1: e.target.value })}
              required
            />
          </label>

          <label>
            Thông số 2 *
            <input
              type="text"
              value={form.spec2}
              onChange={(e) => setForm({ ...form, spec2: e.target.value })}
              required
            />
          </label>

          <ImageUploaderField
            value={form.imageFile}
            onChange={(nextImg) => setForm({ ...form, imageFile: nextImg })}
            onNotify={onNotify}
            label="Ảnh sản phẩm (tải lên Supabase Storage)"
          />

          <label>
            Mô tả chi tiết
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Mô tả hương vị, nguồn gốc vùng trồng..."
            />
          </label>

          <label className="htf-admin__checkbox">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
            />
            <span>Hiển thị ở 4 thẻ nổi bật đầu trang chủ</span>
          </label>

          <button type="submit" className="htf-admin__btn-primary" disabled={saving}>
            {saving
              ? 'Đang lưu...'
              : editingId
                ? 'Lưu thay đổi sản phẩm'
                : '+ Thêm sản phẩm vào cửa hàng'}
          </button>
        </form>
      </section>

      <section className="htf-admin__panel">
        <h2>Tất cả sản phẩm ({products.length})</h2>
        <div className="htf-admin__table-wrap">
          <table className="htf-admin__table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Kho</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="htf-admin__prod-cell">
                      <img src={item.image} alt={item.name} />
                      <div>
                        <strong>{item.name}</strong>
                        <small>
                          {item.unit} {item.isFeatured ? '· ★ Nổi bật' : ''}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>{item.category || 'Trái cây tươi'}</td>
                  <td>{item.price}</td>
                  <td>{item.stock ?? 0}</td>
                  <td>
                    <div className="htf-admin__actions">
                      <button
                        type="button"
                        className="htf-admin__btn-sm"
                        onClick={() => startEdit(item)}
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        className="htf-admin__btn-danger"
                        onClick={() => handleDelete(item)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
