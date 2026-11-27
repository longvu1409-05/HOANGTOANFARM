import React, { useEffect, useState } from 'react';
import { HEADER_ASSETS } from '../../../constants/assets';
import { NAV_ITEMS } from '../../../data/navigationData';
import { fetchProducts } from '../../../services/productApi';
import { ProductItem } from '../../../types/farm.types';

interface NavbarProps {
  cartCount: number;
  onOpenOrderModal: () => void;
  onSelectProduct: (product: ProductItem) => void;
}

/**
 * Thanh điều hướng chính: Logo, Menu trang, Tìm kiếm (gọi API), Giỏ hàng và Chọn ngôn ngữ
 */
export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenOrderModal,
  onSelectProduct,
}) => {
  const [activeNav, setActiveNav] = useState<string>('home');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<ProductItem[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!searchOpen || !searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = window.setTimeout(() => {
      fetchProducts({ q: searchQuery })
        .then(setSearchResults)
        .catch(() => setSearchResults([]));
    }, 200);

    return () => window.clearTimeout(timer);
  }, [searchOpen, searchQuery]);

  return (
    <div className="htf-navbar" data-node-id="987:183">
      <div className="htf-container htf-navbar__inner">
        <a
          href="#trang-chu"
          className="htf-navbar__logo"
          data-node-id="675:160"
          aria-label="Hoàng Toàn Farm"
        >
          <img
            src={HEADER_ASSETS.headerLogo}
            alt="Hoàng Toàn Farm"
            className="htf-svg-intrinsic"
          />
        </a>

        <nav className="htf-navbar__menu" data-node-id="675:139" aria-label="Điều hướng chính">
          <ul className="htf-navbar__list">
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <li key={item.id} className="htf-navbar__item">
                  <a
                    href={item.href}
                    className={`htf-navbar__link ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveNav(item.id)}
                  >
                    <span className={isActive ? 'htf-green-grad-text htf-fw-bold' : ''}>
                      {item.label}
                    </span>

                    {isActive && (
                      <span className="htf-navbar__active-line" data-node-id="675:142">
                        <img src={HEADER_ASSETS.navActiveLine} alt="" className="htf-line-svg" />
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="htf-navbar__actions">
            <button
              type="button"
              className="htf-icon-btn"
              aria-label="Tìm kiếm"
              onClick={() => setSearchOpen((prev) => !prev)}
              data-node-id="675:150"
            >
              <img src={HEADER_ASSETS.iconSearch} alt="" className="htf-svg-intrinsic" />
            </button>

            <button
              type="button"
              className="htf-icon-btn"
              aria-label="Giỏ hàng"
              onClick={onOpenOrderModal}
              data-node-id="675:151"
            >
              <img src={HEADER_ASSETS.iconCartBadge} alt="" className="htf-svg-intrinsic" />
              {cartCount > 0 && <span className="htf-cart-count-override">{cartCount}</span>}
            </button>

            <button
              type="button"
              className="htf-icon-btn"
              aria-label="Ngôn ngữ Tiếng Việt"
              data-node-id="675:156"
            >
              <img src={HEADER_ASSETS.iconLangFlag} alt="" className="htf-svg-intrinsic" />
            </button>

            <button
              type="button"
              className="htf-mobile-toggle"
              aria-label="Mở menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>
      </div>

      {searchOpen && (
        <div className="htf-search-bar">
          <div className="htf-container htf-search-bar__inner">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm: Vú sữa Hoàng Kim, Giỏ quà trái cây..."
              className="htf-search-bar__input"
              autoFocus
            />
            <button
              type="button"
              className="htf-search-bar__close"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery('');
              }}
            >
              Đóng
            </button>
          </div>

          {searchQuery.trim() && (
            <div className="htf-container htf-search-results">
              {searchResults.length === 0 ? (
                <p className="htf-search-results__empty">
                  Không tìm thấy sản phẩm phù hợp với &ldquo;{searchQuery}&rdquo;.
                </p>
              ) : (
                searchResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="htf-search-results__item"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                      onSelectProduct(item);
                    }}
                  >
                    <span>{item.name}</span>
                    <strong>{item.price}</strong>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {mobileMenuOpen && (
        <div className="htf-mobile-nav">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="htf-mobile-nav__link"
              onClick={() => {
                setActiveNav(item.id);
                setMobileMenuOpen(false);
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
