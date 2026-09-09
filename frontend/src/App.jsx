import { useEffect, useState } from "react";
import "./App.css";
import AdminDashboard from "./AdminDashboard";

const API_URL = "http://127.0.0.1:8000/api";

function App() {
  // =========================
  // PRODUCTS
  // =========================

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // CART
  // =========================

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // =========================
  // AUTH
  // =========================

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // =========================
  // CHECKOUT
  // =========================

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // =========================
  // ADMIN
  // =========================

  const [showAdmin, setShowAdmin] = useState(false);

  // =========================
  // CHECKOUT FORM
  // =========================

  const [checkoutForm, setCheckoutForm] = useState({
    shipping_name: "",
    shipping_phone: "",
    shipping_address: "",
  });

  // =========================
  // LOAD PRODUCTS
  // =========================

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load products:", error);
        setLoading(false);
      });
  }, []);

  // =========================
  // CHECK LOGIN
  // =========================

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("auth_token", tokenFromUrl);

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }

    const token =
      tokenFromUrl || localStorage.getItem("auth_token");

    if (!token) {
      setAuthLoading(false);
      return;
    }

    fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Authentication failed");
        }

        return response.json();
      })
      .then((data) => {
        setUser(data.user);
      })
      .catch((error) => {
        console.error("Authentication error:", error);

        localStorage.removeItem("auth_token");
        setUser(null);
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, []);

  // =========================
  // GOOGLE LOGIN
  // =========================

  const loginWithGoogle = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = async () => {
    const token = localStorage.getItem("auth_token");

    try {
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("auth_token");

    setUser(null);
    setShowAdmin(false);
  };

  // =========================
  // ADD TO BAG
  // =========================

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    // Open bag after adding
    setCartOpen(true);
  };

  // =========================
  // INCREASE QUANTITY
  // =========================

  const increaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // =========================
  // DECREASE QUANTITY
  // =========================

  const decreaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // =========================
  // REMOVE FROM BAG
  // =========================

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  };

  // =========================
  // CART COUNT
  // =========================

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // =========================
  // CART SUBTOTAL
  // =========================

  const cartSubtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  // Free shipping above ₹999
  const shipping = cartSubtotal >= 999 ? 0 : 99;

  const cartTotal = cartSubtotal + shipping;

  // =========================
  // OPEN CHECKOUT
  // =========================

  const openCheckout = () => {
    if (cart.length === 0) {
      alert("Your bag is empty.");
      return;
    }

    if (!user) {
      alert("Please login with Google before placing an order.");
      loginWithGoogle();
      return;
    }

    setCheckoutForm({
      shipping_name: user.name || "",
      shipping_phone: "",
      shipping_address: "",
    });

    setCartOpen(false);
    setCheckoutOpen(true);
  };

  // =========================
  // CHECKOUT FORM CHANGE
  // =========================

  const handleCheckoutChange = (event) => {
    const { name, value } = event.target;

    setCheckoutForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================
  // PLACE ORDER
  // =========================

  const placeOrder = async (event) => {
    event.preventDefault();

    if (!user) {
      alert("Please login first.");
      return;
    }

    if (cart.length === 0) {
      alert("Your bag is empty.");
      return;
    }

    if (
      !checkoutForm.shipping_name.trim() ||
      !checkoutForm.shipping_phone.trim() ||
      !checkoutForm.shipping_address.trim()
    ) {
      alert("Please fill in all shipping details.");
      return;
    }

    const token = localStorage.getItem("auth_token");

    if (!token) {
      alert("Please login with Google first.");
      return;
    }

    setPlacingOrder(true);

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },

        body: JSON.stringify({
          shipping_name: checkoutForm.shipping_name,
          shipping_phone: checkoutForm.shipping_phone,
          shipping_address: checkoutForm.shipping_address,

          payment_method: "cod",

          items: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Order error:", data);

        alert(
          data.message ||
            "Something went wrong while placing the order."
        );

        return;
      }

      console.log("Order created:", data);

      // Show success popup
      setOrderSuccess(data.order);

      // Empty bag
      setCart([]);

      // Close checkout
      setCheckoutOpen(false);
    } catch (error) {
      console.error("Place order error:", error);

      alert(
        "Could not connect to the Laravel backend. Make sure Laravel is running."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // =========================
  // ADMIN DASHBOARD
  // =========================

  if (showAdmin && user?.role === "admin") {
    return (
      <AdminDashboard
        user={user}
        onBack={() => setShowAdmin(false)}
        onLogout={logout}
      />
    );
  }

  // =========================
  // MAIN WEBSITE
  // =========================

  return (
    <div className="app">

      {/* =========================
          ANNOUNCEMENT BAR
      ========================== */}

      <div className="announcement">
        FREE SHIPPING ON ORDERS ABOVE ₹999
      </div>

      {/* =========================
          NAVBAR
      ========================== */}

      <header className="navbar">

        <div className="nav-left">
          <span>SHOP</span>
          <span>NEW ARRIVALS</span>
          <span>BESTSELLERS</span>
        </div>

        <div className="logo">
          ESTELLE
        </div>

        <div className="nav-right">

          {/* Search */}
          <span className="nav-icon">
            ⌕
          </span>

          {/* Wishlist */}
          <span className="nav-icon">
            ♡
          </span>

          {/* Logged in user */}
          {user ? (
            <>
              {/* ADMIN BUTTON */}

              {user.role === "admin" && (
                <button
                  className="admin-button"
                  onClick={() => setShowAdmin(true)}
                >
                  ADMIN
                </button>
              )}

              {/* USER BUTTON */}

              <button
                className="user-button"
                onClick={logout}
                title="Logout"
              >
                {user.name?.charAt(0).toUpperCase() || "U"}
              </button>
            </>
          ) : (

            /* LOGIN */

            <button
              className="login-button"
              onClick={loginWithGoogle}
              disabled={authLoading}
            >
              {authLoading ? "..." : "LOGIN"}
            </button>
          )}

          {/* =========================
              SHOPPING BAG
          ========================== */}

          <button
            className="cart-button"
            onClick={() => setCartOpen(true)}
            aria-label="Open shopping bag"
          >
            🛍

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </button>

        </div>
      </header>

      {/* =========================
          HERO
      ========================== */}

      <section className="hero">

        <div className="hero-content">

          <p>
            TIMELESS JEWELLERY
          </p>

          <h1>
            Jewellery that
            <br />
            tells your story.
          </h1>

          <p className="hero-text">
            Discover elegant pieces designed to
            make every moment special.
          </p>

          <button>
            SHOP COLLECTION
          </button>

        </div>

      </section>

      {/* =========================
          CATEGORIES
      ========================== */}

      <section className="categories">

        <div className="section-heading">

          <p>
            EXPLORE
          </p>

          <h2>
            Shop By Category
          </h2>

        </div>

        <div className="category-grid">

          {/* NECKLACES */}

          <div className="category-card">

            <div className="category-image necklace">
              ✨
            </div>

            <h3>
              Necklaces
            </h3>

            <p>
              Explore Collection →
            </p>

          </div>

          {/* EARRINGS */}

          <div className="category-card">

            <div className="category-image earrings">
              ◇
            </div>

            <h3>
              Earrings
            </h3>

            <p>
              Explore Collection →
            </p>

          </div>

          {/* RINGS */}

          <div className="category-card">

            <div className="category-image rings">
              💍
            </div>

            <h3>
              Rings
            </h3>

            <p>
              Explore Collection →
            </p>

          </div>

          {/* BRACELETS */}

          <div className="category-card">

            <div className="category-image bracelets">
              ○
            </div>

            <h3>
              Bracelets
            </h3>

            <p>
              Explore Collection →
            </p>

          </div>

        </div>

      </section>

      {/* =========================
          FEATURED PRODUCTS
      ========================== */}

      <section className="featured">

        <div className="section-heading">

          <p>
            OUR PICKS
          </p>

          <h2>
            Featured Jewellery
          </h2>

        </div>

        {/* LOADING */}

        {loading ? (

          <p className="loading">
            Loading products...
          </p>

        ) : products.length === 0 ? (

          /* NO PRODUCTS */

          <p className="loading">
            No products available.
          </p>

        ) : (

          /* PRODUCTS */

          <div className="product-grid">

            {products.map((product) => (

              <div
                className="product-card"
                key={product.id}
              >

                {/* PRODUCT IMAGE */}

                <div className="product-image">

                  <span className="wishlist-icon">
                    ♡
                  </span>

                  {product.image ? (

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                  ) : (

                    <div className="product-placeholder">
                      ✦
                    </div>

                  )}

                </div>

                {/* PRODUCT NAME */}

                <h3>
                  {product.name}
                </h3>

                {/* PRICE */}

                <p>
                  ₹
                  {Number(product.price).toLocaleString(
                    "en-IN"
                  )}
                </p>

                {/* =========================
                    ADD TO BAG
                ========================== */}

                <button
                  className="add-to-bag-button"
                  onClick={() => addToCart(product)}
                >
                  ADD TO BAG
                </button>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* ==================================================
          SHOPPING BAG DRAWER
      ================================================== */}

      {cartOpen && (

        <div
          className="cart-overlay"
          onClick={() => setCartOpen(false)}
        >

          <div
            className="cart-drawer"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* BAG HEADER */}

            <div className="cart-header">

              <div>

                <p className="cart-label">
                  YOUR BAG
                </p>

                <h2>
                  Shopping Bag
                </h2>

              </div>

              <button
                className="cart-close"
                onClick={() =>
                  setCartOpen(false)
                }
              >
                ×
              </button>

            </div>

            {/* =========================
                EMPTY BAG
            ========================== */}

            {cart.length === 0 ? (

              <div className="empty-cart">

                <div className="empty-cart-icon">
                  🛍
                </div>

                <h3>
                  Your bag is empty
                </h3>

                <p>
                  Add some beautiful jewellery
                  to your bag.
                </p>

                <button
                  onClick={() =>
                    setCartOpen(false)
                  }
                >
                  CONTINUE SHOPPING
                </button>

              </div>

            ) : (

              /* =========================
                 BAG ITEMS
              ========================== */

              <>

                <div className="cart-items">

                  {cart.map((item) => (

                    <div
                      className="cart-item"
                      key={item.id}
                    >

                      {/* ITEM IMAGE */}

                      <div className="cart-item-image">

                        {item.image ? (

                          <img
                            src={item.image}
                            alt={item.name}
                          />

                        ) : (

                          <span>
                            ✦
                          </span>

                        )}

                      </div>

                      {/* ITEM DETAILS */}

                      <div className="cart-item-details">

                        <h3>
                          {item.name}
                        </h3>

                        <p>
                          ₹
                          {Number(item.price).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        {/* QUANTITY */}

                        <div className="quantity-row">

                          <button
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                          >
                            −
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(item.id)
                            }
                          >
                            +
                          </button>

                        </div>

                        {/* REMOVE */}

                        <button
                          className="remove-item"
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

                {/* =========================
                    BAG SUMMARY
                ========================== */}

                <div className="cart-summary">

                  <div className="summary-row">

                    <span>
                      Subtotal
                    </span>

                    <span>
                      ₹
                      {cartSubtotal.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                  <div className="summary-row">

                    <span>
                      Shipping
                    </span>

                    <span>
                      {shipping === 0
                        ? "FREE"
                        : "₹99"}
                    </span>

                  </div>

                  <div className="summary-total">

                    <span>
                      Total
                    </span>

                    <span>
                      ₹
                      {cartTotal.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                  {/* CHECKOUT */}

                  <button
                    className="checkout-button"
                    onClick={openCheckout}
                  >
                    PROCEED TO CHECKOUT
                  </button>

                </div>

              </>

            )}

          </div>

        </div>

      )}

      {/* ==================================================
          CHECKOUT MODAL
      ================================================== */}

      {checkoutOpen && (

        <div className="checkout-overlay">

          <div className="checkout-modal">

            {/* CLOSE */}

            <button
              className="checkout-close"
              onClick={() =>
                setCheckoutOpen(false)
              }
            >
              ×
            </button>

            {/* HEADER */}

            <div className="checkout-header">

              <p>
                CHECKOUT
              </p>

              <h2>
                Complete Your Order
              </h2>

            </div>

            {/* FORM */}

            <form onSubmit={placeOrder}>

              {/* =========================
                  SHIPPING INFORMATION
              ========================== */}

              <div className="checkout-section">

                <h3>
                  Shipping Information
                </h3>

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="shipping_name"
                  value={checkoutForm.shipping_name}
                  onChange={handleCheckoutChange}
                  placeholder="Enter your name"
                  required
                />

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="shipping_phone"
                  value={checkoutForm.shipping_phone}
                  onChange={handleCheckoutChange}
                  placeholder="Enter your phone number"
                  required
                />

                <label>
                  Delivery Address
                </label>

                <textarea
                  name="shipping_address"
                  value={checkoutForm.shipping_address}
                  onChange={handleCheckoutChange}
                  placeholder="Enter your complete address"
                  rows="4"
                  required
                />

              </div>

              {/* =========================
                  PAYMENT
              ========================== */}

              <div className="checkout-section">

                <h3>
                  Payment Method
                </h3>

                <div className="payment-option">

                  <input
                    type="radio"
                    checked
                    readOnly
                  />

                  <span>
                    Cash on Delivery
                  </span>

                </div>

              </div>

              {/* =========================
                  ORDER SUMMARY
              ========================== */}

              <div className="checkout-order-summary">

                <div>

                  <span>
                    Subtotal
                  </span>

                  <span>
                    ₹
                    {cartSubtotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                <div>

                  <span>
                    Shipping
                  </span>

                  <span>
                    {shipping === 0
                      ? "FREE"
                      : "₹99"}
                  </span>

                </div>

                <div className="checkout-total">

                  <span>
                    Total
                  </span>

                  <span>
                    ₹
                    {cartTotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

              </div>

              {/* PLACE ORDER */}

              <button
                className="place-order-button"
                type="submit"
                disabled={placingOrder}
              >
                {placingOrder
                  ? "PLACING ORDER..."
                  : "PLACE ORDER"}
              </button>

            </form>

          </div>

        </div>

      )}

      {/* ==================================================
          ORDER SUCCESS
      ================================================== */}

      {orderSuccess && (

        <div className="success-overlay">

          <div className="success-modal">

            <div className="success-icon">
              ✓
            </div>

            <p className="success-label">
              ORDER CONFIRMED
            </p>

            <h2>
              Thank You!
            </h2>

            <p>
              Your order has been placed
              successfully.
            </p>

            <p className="order-number">
              Order #{orderSuccess.id}
            </p>

            <button
              onClick={() =>
                setOrderSuccess(null)
              }
            >
              CONTINUE SHOPPING
            </button>

          </div>

        </div>

      )}

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer>

        <div className="footer-logo">
          ESTELLE
        </div>

        <p>
          Elegant jewellery for every occasion.
        </p>

        <div className="footer-links">

          <span>
            About Us
          </span>

          <span>
            Contact
          </span>

          <span>
            Shipping
          </span>

          <span>
            Privacy
          </span>

        </div>

        <p className="copyright">
          © 2026 Estelle Store. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default App;