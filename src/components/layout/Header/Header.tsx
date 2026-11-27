import React from 'react';
import { ProductItem } from '../../../types/farm.types';
import { TopBar } from './TopBar';
import { Navbar } from './Navbar';
import './Header.css';

interface HeaderProps {
  cartCount: number;
  onOpenOrderModal: () => void;
  onSelectProduct: (product: ProductItem) => void;
}

/**
 * Phần đầu trang (Header): gồm TopBar màu xanh đậm và Navbar điều hướng chính
 */
export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenOrderModal,
  onSelectProduct,
}) => {
  return (
    <header className="htf-header-wrap" id="trang-chu">
      <TopBar />
      <Navbar
        cartCount={cartCount}
        onOpenOrderModal={onOpenOrderModal}
        onSelectProduct={onSelectProduct}
      />
    </header>
  );
};
