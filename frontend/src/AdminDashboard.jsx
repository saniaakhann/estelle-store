import { useEffect, useState } from "react";
import "./AdminDashboard.css";

const API_URL = "http://127.0.0.1:8000/api";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: "",
    is_active: true,
  });

  // =====================================================
  // GET TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("auth_token");
  };

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);

      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        setMessage(data.message || "Unable to load orders.");
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      setMessage("Unable to load orders.");
    } finally {
      setLoadingOrders(false);
    }
  };

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);

      const response = await fetch(`${API_URL}/products`);

      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      } else {
        setMessage(data.message || "Unable to load products.");
      }
    } catch (error) {
      console.error("Error loading products:", error);
      setMessage("Unable to load products.");
    } finally {
      setLoadingProducts(false);
    }
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  // =====================================================
  // CHANGE FORM
  // =====================================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =====================================================
  // OPEN ADD PRODUCT FORM
  // =====================================================

  const openAddProduct = () => {
    setEditingProduct(null);

    setForm({
      name: "",
      description: "",
      price: "",
      image: "",
      category: "",
      stock: "",
      is_active: true,
    });

    setShowProductForm(true);
  };

  // =====================================================
  // OPEN EDIT PRODUCT FORM
  // =====================================================

  const openEditProduct = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      image: product.image || "",
      category: product.category || "",
      stock: product.stock ?? "",
      is_active: product.is_active,
    });

    setShowProductForm(true);
  };

  // =====================================================
  // SAVE PRODUCT
  // =====================================================

  const saveProduct = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const isEditing = editingProduct !== null;

      const url = isEditing
        ? `${API_URL}/products/${editingProduct.id}`
        : `${API_URL}/products`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          image: form.image || null,
          category: form.category,
          stock: Number(form.stock),
          is_active: form.is_active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Product save error:", data);

        setMessage(
          data.message ||
            "Unable to save product."
        );

        return;
      }

      setMessage(
        isEditing
          ? "Product updated successfully."
          : "Product added successfully."
      );

      setShowProductForm(false);
      setEditingProduct(null);

      setForm({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
        stock: "",
        is_active: true,
      });

      fetchProducts();
    } catch (error) {
      console.error("Save product error:", error);
      setMessage("Something went wrong.");
    }
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const deleteProduct = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to delete product."
        );

        return;
      }

      setMessage("Product deleted successfully.");

      fetchProducts();
    } catch (error) {
      console.error("Delete product error:", error);
      setMessage("Something went wrong.");
    }
  };

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateOrderStatus = async (
    orderId,
    status
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to update order."
        );

        return;
      }

      setMessage(
        `Order #${orderId} marked as ${status}.`
      );

      fetchOrders();
    } catch (error) {
      console.error("Update order error:", error);
      setMessage("Something went wrong.");
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("auth_token");

    window.location.href = "/";
  };

  // =====================================================
  // STORE
  // =====================================================

  const goToStore = () => {
    window.location.href = "/";
  };

  // =====================================================
  // ORDER COUNTS
  // =====================================================

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const acceptedOrders = orders.filter(
    (order) => order.status === "accepted"
  ).length;

  const rejectedOrders = orders.filter(
    (order) => order.status === "rejected"
  ).length;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="admin-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="admin-header">
        <div>
          <p className="admin-brand">
            ESTELLE STORE
          </p>

          <h1>Admin Dashboard</h1>

          <p className="admin-subtitle">
            Manage your store
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            className="admin-outline-button"
            onClick={goToStore}
          >
            ← Store
          </button>

          <button
            className="admin-outline-button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="admin-main">

        {/* =================================================
            MESSAGE
        ================================================= */}

        {message && (
          <div className="admin-message">
            <span>{message}</span>

            <button
              onClick={() => setMessage("")}
            >
              ×
            </button>
          </div>
        )}

        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="admin-stats">

          <div className="stat-card">
            <p>TOTAL ORDERS</p>

            <strong>
              {totalOrders}
            </strong>
          </div>

          <div className="stat-card">
            <p>PENDING</p>

            <strong>
              {pendingOrders}
            </strong>
          </div>

          <div className="stat-card">
            <p>ACCEPTED</p>

            <strong>
              {acceptedOrders}
            </strong>
          </div>

          <div className="stat-card">
            <p>REJECTED</p>

            <strong>
              {rejectedOrders}
            </strong>
          </div>

        </section>

        {/* =================================================
            ORDERS
        ================================================= */}

        <section className="admin-section">

          <div className="section-top">

            <div>
              <p className="section-label">
                MANAGEMENT
              </p>

              <h2>
                Customer Orders
              </h2>
            </div>

            <button
              className="dark-button"
              onClick={fetchOrders}
            >
              Refresh
            </button>

          </div>

          {loadingOrders ? (

            <div className="empty-state">
              Loading orders...
            </div>

          ) : orders.length === 0 ? (

            <div className="empty-state">
              No orders yet.
            </div>

          ) : (

            <div className="orders-table-wrapper">

              <table className="orders-table">

                <thead>
                  <tr>
                    <th>ORDER</th>
                    <th>CUSTOMER</th>
                    <th>ITEMS</th>
                    <th>TOTAL</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>

                  {orders.map((order) => (

                    <tr key={order.id}>

                      <td>
                        <strong>
                          #{order.id}
                        </strong>

                        <small>
                          {new Date(
                            order.created_at
                          ).toLocaleDateString()}
                        </small>
                      </td>

                      <td>
                        <strong>
                          {order.user?.name ||
                            order.shipping_name}
                        </strong>

                        <small>
                          {order.shipping_phone}
                        </small>
                      </td>

                      <td>
                        {order.items?.reduce(
                          (total, item) =>
                            total + item.quantity,
                          0
                        )}
                      </td>

                      <td>
                        ₹
                        {Number(
                          order.total_amount
                        ).toLocaleString("en-IN")}
                      </td>

                      <td>
                        <span
                          className={`status-badge status-${order.status}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td>

                        {order.status ===
                        "pending" ? (

                          <div className="order-actions">

                            <button
                              className="accept-button"
                              onClick={() =>
                                updateOrderStatus(
                                  order.id,
                                  "accepted"
                                )
                              }
                            >
                              Accept
                            </button>

                            <button
                              className="reject-button"
                              onClick={() =>
                                updateOrderStatus(
                                  order.id,
                                  "rejected"
                                )
                              }
                            >
                              Reject
                            </button>

                          </div>

                        ) : (

                          <span className="completed-text">
                            Completed
                          </span>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* =================================================
            PRODUCTS
        ================================================= */}

        <section className="admin-section">

          <div className="section-top">

            <div>
              <p className="section-label">
                INVENTORY
              </p>

              <h2>
                Products
              </h2>
            </div>

            <div className="section-actions">

              <button
                className="admin-outline-button dark-text"
                onClick={fetchProducts}
              >
                Refresh
              </button>

              <button
                className="dark-button"
                onClick={openAddProduct}
              >
                + Add Product
              </button>

            </div>

          </div>

          {loadingProducts ? (

            <div className="empty-state">
              Loading products...
            </div>

          ) : products.length === 0 ? (

            <div className="empty-state">
              No products found.
            </div>

          ) : (

            <div className="product-admin-grid">

              {products.map((product) => (

                <div
                  className="admin-product-card"
                  key={product.id}
                >

                  <div className="admin-product-image">

                    {product.image ? (

                      <img
                        src={product.image}
                        alt={product.name}
                      />

                    ) : (

                      <span>
                        ✦
                      </span>

                    )}

                  </div>

                  <div className="admin-product-info">

                    <p className="admin-product-category">
                      {product.category ||
                        "Jewellery"}
                    </p>

                    <h3>
                      {product.name}
                    </h3>

                    <p className="admin-product-price">
                      ₹
                      {Number(
                        product.price
                      ).toLocaleString("en-IN")}
                    </p>

                    <p className="admin-product-stock">
                      Stock: {product.stock}
                    </p>

                  </div>

                  <div className="product-actions">

                    <button
                      className="edit-button"
                      onClick={() =>
                        openEditProduct(product)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteProduct(product.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

      {/* =================================================
          ADD / EDIT PRODUCT MODAL
      ================================================= */}

      {showProductForm && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowProductForm(false)
          }
        >

          <div
            className="product-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="modal-close"
              onClick={() =>
                setShowProductForm(false)
              }
            >
              ×
            </button>

            <p className="section-label">
              {editingProduct
                ? "EDIT PRODUCT"
                : "NEW PRODUCT"}
            </p>

            <h2>
              {editingProduct
                ? "Edit Jewellery"
                : "Add Jewellery"}
            </h2>

            <form
              onSubmit={saveProduct}
              className="product-form"
            >

              {/* PRODUCT NAME */}

              <label>
                Product Name

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Classic Gold Necklace"
                  required
                />
              </label>

              {/* DESCRIPTION */}

              <label>
                Description

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Elegant jewellery piece..."
                  rows="3"
                />
              </label>

              {/* PRICE + STOCK */}

              <div className="form-row">

                <label>
                  Price

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="4999"
                    min="0"
                    required
                  />
                </label>

                <label>
                  Stock

                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="10"
                    min="0"
                    required
                  />
                </label>

              </div>

              {/* CATEGORY + IMAGE */}

              <div className="form-row">

                <label>
                  Category

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >

                    <option value="">
                      Select category
                    </option>

                    <option value="Necklaces">
                      Necklaces
                    </option>

                    <option value="Earrings">
                      Earrings
                    </option>

                    <option value="Rings">
                      Rings
                    </option>

                    <option value="Bracelets">
                      Bracelets
                    </option>

                  </select>

                </label>

                <label>
                  Image URL

                  <input
                    type="url"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://..."
                  />

                </label>

              </div>

              {/* ACTIVE */}

              <label className="checkbox-label">

                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                />

                Product is active

              </label>

              {/* SAVE */}

              <button
                type="submit"
                className="save-product-button"
              >
                {editingProduct
                  ? "UPDATE PRODUCT"
                  : "ADD PRODUCT"}
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminDashboard;