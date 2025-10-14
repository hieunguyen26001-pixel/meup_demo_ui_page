import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
  DollarLineIcon,
  VideoIcon,
  UserIcon,
  FolderIcon,
  BoxIcon,
  ShootingStarIcon,
  ChatIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean; icon?: React.ReactNode }[];
};

const navItems: NavItem[] = [
  // ========== 1. QUẢNG CÁO (3 features) ==========
  {
    icon: <ShootingStarIcon />,
    name: "Quảng cáo",
    subItems: [
      { name: "Tổng quan quảng cáo", path: "ads-overview", pro: false, icon: <GridIcon /> },
      { name: "TikTok Ads", path: "tiktok-ads", pro: false, icon: <VideoIcon /> },
      { name: "Shopee Ads", path: "shopee-ads", pro: false, icon: <BoxIcon /> }
    ],
  },

  // ========== 2. QUY TRÌNH & WORKFLOW (8 features) ==========
  {
    icon: <GridIcon />,
    name: "Quy trình & Workflow",
    subItems: [
      { name: "Quản lý quy trình", path: "workflow-management", pro: false, icon: <GridIcon /> },
      { name: "Tự động hóa quy trình", path: "process-automation", pro: false, icon: <BoxIcon /> },
      { name: "Quy trình phê duyệt", path: "approval-workflows", pro: false, icon: <TableIcon /> },
      { name: "Phân công nhiệm vụ", path: "task-assignment", pro: false, icon: <UserIcon /> },
      { name: "Tạo biểu mẫu", path: "form-builder", pro: false, icon: <TableIcon /> },
      { name: "Mẫu quy trình", path: "process-templates", pro: false, icon: <GridIcon /> },
      { name: "Trường tùy chỉnh", path: "custom-fields", pro: false, icon: <TableIcon /> },
      { name: "Giám sát quy trình", path: "process-monitoring", pro: false, icon: <PieChartIcon /> }
    ],
  },

  // ========== 3. GIAO TIẾP & CỘNG TÁC (8 features) ==========
  {
    icon: <ChatIcon />,
    name: "Giao tiếp & Cộng tác",
    subItems: [
      { name: "Chat nhóm", path: "team-chat", pro: false, icon: <ChatIcon /> },
      { name: "Họp video", path: "video-conferencing", pro: false, icon: <VideoIcon /> },
      { name: "Quản lý cuộc họp", path: "meeting-management", pro: false, icon: <CalenderIcon /> },
      { name: "Ghi chú chung", path: "shared-notes", pro: false, icon: <TableIcon /> },
      { name: "Chia sẻ tệp", path: "file-sharing", pro: false, icon: <BoxIcon /> },
      { name: "Thông báo đẩy", path: "push-notifications", pro: false, icon: <ChatIcon /> },
      { name: "Lên lịch họp", path: "meeting-scheduler", pro: false, icon: <CalenderIcon /> },
      { name: "Cộng tác nhóm", path: "team-collaboration", pro: false, icon: <UserIcon /> }
    ],
  },

  // ========== 4. SẢN PHẨM THÔNG MINH (12 features) ==========
  {
    icon: <BoxCubeIcon />,
    name: "Sản phẩm thông minh",
    subItems: [
      { name: "Quản lý sản phẩm", path: "product-management", pro: false, icon: <BoxCubeIcon /> },
      { name: "Đồng bộ tồn kho AI", path: "inventory-sync", pro: true, icon: <BoxIcon /> },
      { name: "Tối ưu giá AI", path: "price-optimization", pro: true, icon: <DollarLineIcon /> },
      { name: "Phân tích SKU", path: "sku-analytics", pro: false, icon: <PieChartIcon /> },
      { name: "Sản phẩm hot AI", path: "hot-products", pro: true, icon: <ShootingStarIcon /> },
      { name: "Dự báo nhu cầu AI", path: "demand-forecast", pro: true, icon: <GridIcon /> },
      { name: "Cảnh báo tồn kho", path: "stock-alerts", pro: false, icon: <ShootingStarIcon /> },
      { name: "Phân tích lợi nhuận", path: "margin-analysis", pro: false, icon: <DollarLineIcon /> },
      { name: "Bán chéo AI", path: "cross-selling-ai", pro: true, icon: <BoxCubeIcon /> },
      { name: "Bán thêm AI", path: "upselling-ai", pro: true, icon: <BoxCubeIcon /> },
      { name: "Tự động đặt hàng AI", path: "auto-reorder", pro: true, icon: <BoxIcon /> },
      { name: "Hệ thống gợi ý AI", path: "recommendation-engine", pro: true, icon: <BoxCubeIcon /> }
    ],
  },

  // ========== 5. ĐƠN HÀNG THÔNG MINH (10 features) ==========
  {
    icon: <TableIcon />,
    name: "Đơn hàng thông minh",
    subItems: [
      { name: "Quản lý đơn hàng", path: "order-management", pro: false, icon: <TableIcon /> },
      { name: "Fulfillment tự động AI", path: "auto-fulfillment", pro: true, icon: <BoxIcon /> },
      { name: "Tối ưu vận chuyển", path: "shipping-optimization", pro: false, icon: <BoxIcon /> },
      { name: "Theo dõi đơn hàng", path: "order-tracking", pro: false, icon: <GridIcon /> },
      { name: "Quản lý COD", path: "cod-management", pro: false, icon: <DollarLineIcon /> },
      { name: "Đổi trả hàng", path: "returns-exchange", pro: false, icon: <TableIcon /> },
      { name: "Phân tích đơn hàng", path: "order-analytics", pro: false, icon: <PieChartIcon /> },
      { name: "Chatbot hỗ trợ AI", path: "ai-chatbot", pro: true, icon: <ChatIcon /> },
      { name: "Xử lý thanh toán", path: "payment-processing", pro: false, icon: <DollarLineIcon /> },
      { name: "Hiệu suất đơn hàng", path: "order-performance", pro: false, icon: <PieChartIcon /> }
    ],
  },

  // ========== 6. THÔNG TIN KHÁCH HÀNG (8 features) ==========
  {
    icon: <UserCircleIcon />,
    name: "Thông tin khách hàng",
    subItems: [
      { name: "Cơ sở dữ liệu khách hàng", path: "customer-database", pro: false, icon: <TableIcon /> },
      { name: "Phân khúc khách hàng AI", path: "customer-segmentation", pro: true, icon: <GridIcon /> },
      { name: "Giá trị trọn đời", path: "customer-ltv", pro: false, icon: <DollarLineIcon /> },
      { name: "Chương trình khách hàng thân thiết", path: "loyalty-program", pro: false, icon: <ShootingStarIcon /> },
      { name: "Phân tích khách hàng AI", path: "customer-analytics", pro: true, icon: <PieChartIcon /> },
      { name: "Chat trực tiếp", path: "live-chat", pro: false, icon: <ChatIcon /> },
      { name: "Hành trình khách hàng", path: "customer-journey", pro: false, icon: <GridIcon /> },
      { name: "Phân tích cảm xúc AI", path: "sentiment-analysis", pro: true, icon: <PieChartIcon /> }
    ],
  },

  // ========== 7. TÀI CHÍNH & BÁO CÁO (8 features) ==========
  {
    icon: <DollarLineIcon />,
    name: "Tài chính & Báo cáo",
    subItems: [
      { name: "Phân tích doanh thu", path: "revenue-analytics", pro: false, icon: <PieChartIcon /> },
      { name: "Lãi lỗ", path: "profit-loss", pro: false, icon: <TableIcon /> },
      { name: "Dòng tiền", path: "cash-flow", pro: false, icon: <DollarLineIcon /> },
      { name: "Dự báo tài chính AI", path: "financial-forecast", pro: true, icon: <GridIcon /> },
      { name: "Phân tích chi phí", path: "cost-analysis", pro: false, icon: <DollarLineIcon /> },
      { name: "Thông tin kinh doanh", path: "business-intelligence", pro: false, icon: <PieChartIcon /> },
      { name: "Theo dõi ROI", path: "roi-tracking", pro: false, icon: <DollarLineIcon /> },
      { name: "Báo cáo tài chính", path: "financial-reports", pro: false, icon: <TableIcon /> }
    ],
  },

  // ========== 8. NHÓM & VẬN HÀNH (8 features) ==========
  {
    icon: <UserIcon />,
    name: "Nhóm & Vận hành",
    subItems: [
      { name: "Quản lý nhóm", path: "team-management", pro: false, icon: <UserIcon /> },
      { name: "Dashboard KPI", path: "kpi-dashboard", pro: false, icon: <PieChartIcon /> },
      { name: "Quản lý nhiệm vụ", path: "task-management", pro: false, icon: <TableIcon /> },
      { name: "Đánh giá hiệu suất", path: "performance-review", pro: false, icon: <PieChartIcon /> },
      { name: "Tự động hóa workflow", path: "workflow-automation", pro: false, icon: <GridIcon /> },
      { name: "Trung tâm thông báo", path: "notification-center", pro: false, icon: <ChatIcon /> },
      { name: "Cài đặt hệ thống", path: "system-settings", pro: false, icon: <GridIcon /> },
      { name: "Bảo mật", path: "security", pro: false, icon: <ShootingStarIcon /> }
    ],
  }
];

const othersItems: NavItem[] = [];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => {
      const fullPath = `/${path}`;
      // For exact match
      if (location.pathname === fullPath) return true;
      // For nested routes like campaign-video/:id
      if (path === 'gmv-max-product' && location.pathname.startsWith('/campaign-video/')) return true;
      return false;
    },
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              const key = `${menuType}-${index}`;
              setOpenSubmenus((prevOpenSubmenus) => {
                const newSet = new Set(prevOpenSubmenus);
                newSet.add(key);
                return newSet;
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      // Keep all menus closed by default
      setOpenSubmenus(new Set());
    }
  }, [location, isActive]);

  useEffect(() => {
    openSubmenus.forEach((key) => {
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    });
  }, [openSubmenus]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    const key = `${menuType}-${index}`;
    setOpenSubmenus((prevOpenSubmenus) => {
      const newSet = new Set(prevOpenSubmenus);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenus.has(`${menuType}-${index}`)
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer lg:justify-start`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenus.has(`${menuType}-${index}`)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenus.has(`${menuType}-${index}`)
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                } lg:justify-start`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenus.has(`${menuType}-${index}`)
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-6">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.icon && (
                        <span className="w-5 h-5 flex items-center justify-center">
                          {subItem.icon}
                        </span>
                      )}
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-6 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 shadow-lg lg:shadow-none
        ${
          isExpanded || isMobileOpen
            ? "w-[300px]"
            : isHovered
            ? "w-[300px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex py-2 ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="images/logo/meup_logo.png"
                alt="Logo"
                width={150}
                height={32}
              />
              <img
                className="hidden dark:block"
                src="./images/logo/meup_logo.png"
                alt="Logo"
                width={150}
                height={32}
              />
            </>
          ) : (
            <img
              src="./images/logo/meup_logo.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar flex-1">
        <nav className="py-6">
          <div className="flex flex-col gap-3">
            <div>
              <h2
                className={`mb-6 text-xs uppercase flex leading-[20px] text-gray-400 font-semibold tracking-wider ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
