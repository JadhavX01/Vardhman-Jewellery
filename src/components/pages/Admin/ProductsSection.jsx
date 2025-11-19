import { useState, useMemo } from "react";
import { Search, Eye, Edit, Package, ChevronLeft, ChevronRight, X, SlidersHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import API from "../../../utils/api";
import ViewProductModal from "./modals/ViewProductModal";
import EditProductModal from "./modals/EditProductModal";
import DeleteConfirmDialog from "./modals/DeleteConfirmDialog";
import styles from "./ProductsSection.module.css";

const ProductsSection = ({ products, onProductsChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetItemNo, setDeleteTargetItemNo] = useState(null);
  const itemsPerPage = viewMode === "grid" ? 24 : 50;

  // Extract unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.Description).filter(Boolean))];
    return ["All", ...uniqueCategories.sort()];
  }, [products]);

  const getCategoryCount = (category) => {
    if (category === "All") return products.length;
    return products.filter(p => p.Description === category).length;
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (selectedCategory !== "All") {
      filtered = filtered.filter(p => p.Description === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.Description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ItemNo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [products, selectedCategory, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle View Product
  const handleViewProduct = (product) => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  };

  // Handle Edit Product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  // Handle Delete Product
  const handleDeleteProduct = (itemNo) => {
    setDeleteTargetItemNo(itemNo);
    setDeleteDialogOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteTargetItemNo) return;
    setIsDeleting(true);
    try {
      const response = await API.delete(`/products/admin/${deleteTargetItemNo}`);
      if (response.data.success) {
        toast.success("✅ Product deleted from inventory");
        onProductsChange();
      } else {
        toast.error(response.data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setDeleteTargetItemNo(null);
    }
  };

  // Get responsive grid columns
  const getGridClass = () => {
    if (viewMode !== "grid") return "";
    if (window.innerWidth >= 1280) return styles.productsGridXL;
    if (window.innerWidth >= 1024) return styles.productsGridLG;
    if (window.innerWidth >= 640) return styles.productsGridMD;
    return styles.productsGridSM;
  };

  return (
    <div className={styles.container}>
      {/* ========== FILTER SIDEBAR ========== */}
      <div className={`${styles.filterSidebar} ${showFilters ? styles.filterSidebarOpen : styles.filterSidebarClosed}`}>
        <div className={styles.filterContent}>
          <div className={styles.filterHeader}>
            <h3 className={styles.filterTitle}>
              <SlidersHorizontal size={20} color="#a855f7" />
              Filters
            </h3>
            <button className={styles.filterCloseBtn} onClick={() => setShowFilters(false)}>
              <X size={18} color="#6b7280" />
            </button>
          </div>

          <div className={styles.filterListContainer}>
            <p className={styles.filterLabel}>Categories ({categories.length})</p>
            <div className={styles.categoryList}>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`${styles.categoryBtn} ${selectedCategory === category ? styles.categoryBtnActive : ""}`}
                >
                  <span className={styles.categoryBtnText}>{category}</span>
                  <span className={`${styles.categoryBadge} ${selectedCategory === category ? styles.categoryBadgeActive : styles.categoryBadgeInactive}`}>
                    {getCategoryCount(category)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {selectedCategory !== "All" && (
            <button className={styles.clearFiltersBtn} onClick={() => handleCategoryChange("All")}>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* ========== OVERLAY ========== */}
      {showFilters && window.innerWidth < 1024 && (
        <div className={styles.filterOverlay} onClick={() => setShowFilters(false)} />
      )}

      {/* ========== MAIN CONTENT ========== */}
      <div className={styles.mainContent}>
        {/* ========== HEADER CONTROLS (FIXED) ========== */}
        <div className={styles.headerControls}>
          <div className={styles.controlsTop}>
            <button
              className={`${styles.filterToggleBtn} ${showFilters ? styles.filterToggleBtnActive : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={18} />
              <span className={styles.filterToggleBtnText}>Filters</span>
            </button>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewBtn} ${viewMode === "grid" ? styles.viewBtnActive : ""}`}
                onClick={() => setViewMode("grid")}
              >
                Grid
              </button>
              <button
                className={`${styles.viewBtn} ${viewMode === "list" ? styles.viewBtnActive : ""}`}
                onClick={() => setViewMode("list")}
              >
                List
              </button>
            </div>
          </div>

          <div className={styles.resultsInfo}>
            <div className={styles.resultsInfoLeft}>
              {selectedCategory !== "All" && (
                <span className={styles.categoryTag}>{selectedCategory}</span>
              )}
              <span className={styles.resultsText}>
                <span className={styles.resultsTextShort}>
                  <span className={styles.resultsCount}>{startIndex + 1}-{Math.min(endIndex, filteredProducts.length)}</span> of{" "}
                  <span className={styles.resultsCount}>{filteredProducts.length.toLocaleString()}</span>
                </span>
                <span className={styles.resultsTextFull}>
                  Showing <span className={styles.resultsCount}>{startIndex + 1}-{Math.min(endIndex, filteredProducts.length)}</span> of{" "}
                  <span className={styles.resultsCount}>{filteredProducts.length.toLocaleString()}</span> products
                </span>
              </span>
            </div>
            <span className={styles.resultsText}>
              <span className={styles.resultsTextShort}>
                P<span className={styles.resultsCount}>{currentPage}</span>/<span className={styles.resultsCount}>{totalPages}</span>
              </span>
              <span className={styles.resultsTextFull}>
                Page <span className={styles.resultsCount}>{currentPage}</span> of{" "}
                <span className={styles.resultsCount}>{totalPages.toLocaleString()}</span>
              </span>
            </span>
          </div>
        </div>

        {/* ========== SCROLLABLE CONTENT AREA ========== */}
        <div className={styles.scrollableContent}>
          {/* ========== PRODUCTS GRID ========== */}
          {viewMode === "grid" && (
            <div className={`${styles.productsGrid} ${getGridClass()}`}>
              {currentProducts.map((product) => {
                const basePrice = product.DisplayPrice || product.Price || product.OAmt || 0;
                const offerPrice = product.OfferPrice || 0;
                const hasOffer = offerPrice > 0 && offerPrice < basePrice;
                const discountPercent = hasOffer
                  ? Math.round(((basePrice - offerPrice) / basePrice) * 100)
                  : 0;

                return (
                  <div key={product.ItemNo} className={styles.productCard}>
                    {product.images && product.images[0] ? (
                      <div className={styles.productImageContainer}>
                        <img
                          src={`http://localhost:5000${product.images[0].FilePath || product.images[0]}`}
                          alt={product.Description}
                          className={styles.productImage}
                          onError={(e) => { e.target.src = "https://via.placeholder.com/300x200?text=No+Image"; }}
                        />
                        {hasOffer && (
                          <div className={styles.discountBadge}>
                            {discountPercent}% OFF
                          </div>
                        )}
                        <div className={styles.productImageBadge}>{product.Description}</div>
                      </div>
                    ) : (
                      <div className={styles.productImagePlaceholder}>
                        <Package size={48} color="#a855f7" />
                        <span className={styles.placeholderText}>
                          {product.Description}
                        </span>
                      </div>
                    )}

                    <div className={styles.productContent}>
                      <div className={styles.productHeader}>
                        <span className={styles.productItemNo}>{product.ItemNo}</span>
                        <span className={`${styles.productStatusBadge} ${product.Sold === 'Y' ? styles.productStatusSold : styles.productStatusAvailable}`}>
                          {product.Sold === 'Y' ? 'SOLD' : 'AVAILABLE'}
                        </span>
                      </div>
                      <div className={styles.productPriceSection}>
                        <p className={styles.productPrice}>
                          {hasOffer ? (
                            <>
                              <span className={styles.priceOriginal}>
                                ₹{basePrice.toLocaleString()}
                              </span>
                              <span className={styles.priceOffer}>
                                ₹{offerPrice.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <>₹{basePrice.toLocaleString()}</>
                          )}
                        </p>
                        <p className={styles.productWeight}>Weight: {product.GWT || "N/A"}g</p>
                      </div>
                      <div className={styles.productActions}>
                        <button className={`${styles.actionBtn} ${styles.viewBtn}`} onClick={() => handleViewProduct(product)}>
                          <Eye size={14} /><span>View</span>
                        </button>
                        <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => handleEditProduct(product)}>
                          <Edit size={14} /><span>Edit</span>
                        </button>
                        <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDeleteProduct(product.ItemNo)} disabled={isDeleting}>
                          <Trash2 size={14} /><span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ========== LIST VIEW ========== */}
          {viewMode === "list" && (
            <div className={styles.listViewContainer}>
              <table className={styles.productsTable}>
                <thead>
                  <tr>
                    <th>Item No</th>
                    <th>Description</th>
                    <th>Weight</th>
                    <th>Status</th>
                    <th>Price</th>
                    <th>Offer</th>
                    <th>Discount %</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product) => {
                    const basePrice = product.DisplayPrice || product.Price || product.OAmt || 0;
                    const offerPrice = product.OfferPrice || 0;
                    const hasOffer = offerPrice > 0 && offerPrice < basePrice;
                    const discountPercent = hasOffer
                      ? Math.round(((basePrice - offerPrice) / basePrice) * 100)
                      : 0;
                    return (
                      <tr key={product.ItemNo}>
                        <td className={styles.cellItemNo}>{product.ItemNo}</td>
                        <td className={styles.cellDescription}>{product.Description}</td>
                        <td>{product.GWT || "N/A"}g</td>
                        <td className={product.Sold === "Y" ? styles.cellSold : styles.cellAvailable}>
                          {product.Sold === "Y" ? "SOLD" : "AVAILABLE"}
                        </td>
                        <td className={styles.cellPrice}>₹{basePrice.toLocaleString()}</td>
                        <td className={styles.cellOffer}>
                          {hasOffer ? `₹${offerPrice.toLocaleString()}` : "--"}
                        </td>
                        <td className={styles.cellDiscount}>
                          {hasOffer ? `${discountPercent}%` : "--"}
                        </td>
                        <td>
                          <div className={styles.cellActions}>
                            <button className={`${styles.actionBtn} ${styles.viewBtn}`} onClick={() => handleViewProduct(product)}>
                              <Eye size={14} /><span>View</span>
                            </button>
                            <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => handleEditProduct(product)}>
                              <Edit size={14} /><span>Edit</span>
                            </button>
                            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDeleteProduct(product.ItemNo)} disabled={isDeleting}>
                              <Trash2 size={14} /><span>Del</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ========== EMPTY STATE ========== */}
          {filteredProducts.length === 0 && (
            <div className={styles.emptyState}>
              <Package size={64} color="#d1d5db" className={styles.emptyStateIcon} />
              <h3 className={styles.emptyStateTitle}>No products found</h3>
              <p className={styles.emptyStateText}>
                {selectedCategory !== "All"
                  ? `No products in "${selectedCategory}" category`
                  : "Try adjusting your search"}
              </p>
            </div>
          )}
        </div>

        {/* ========== PAGINATION (FIXED) ========== */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={`${styles.paginationBtn} ${styles.paginationBtnPrev} ${currentPage === 1 ? styles.paginationBtnDisabled : ""}`}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>
            <div className={styles.pageNumbers}>
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = index + 1;
                } else if (currentPage <= 3) {
                  pageNum = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + index;
                } else {
                  pageNum = currentPage - 2 + index;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`${styles.paginationBtn} ${currentPage === pageNum ? styles.paginationBtnActive : ""}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              className={`${styles.paginationBtn} ${styles.paginationBtnNext} ${currentPage === totalPages ? styles.paginationBtnDisabled : ""}`}
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* ========== MODALS ========== */}
      <ViewProductModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingProduct(null);
        }}
        product={viewingProduct}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSuccess={onProductsChange}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeleteTargetItemNo(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Product from Inventory"
        description="This product will be hidden from the customer dashboard. It will remain in the database but won't be visible to customers."
        itemName={deleteTargetItemNo}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ProductsSection;
