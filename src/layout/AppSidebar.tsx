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
  {
    icon: <ShootingStarIcon />,
    name: "Quảng cáo",
    subItems: [
      { name: "Tổng quan", path: "ads-overview", pro: false, icon: <GridIcon /> },
      { name: "GMV Max sản phẩm", path: "gmv-max-product", pro: false, icon: <BoxCubeIcon /> },
      { name: "GMV Max Live", path: "gmv-max-live", pro: false, icon: <VideoIcon /> }
    ],
  },
  {
    icon: <UserIcon />,
    name: "Creator",
    subItems: [
      { name: "Thống kê nguồn doanh thu", path: "creator-analytics", pro: false, icon: <PieChartIcon /> },
      { name: "Thống kê hoa hồng ADS và Tự Nhiên", path: "creator-commission", pro: false, icon: <DollarLineIcon /> }
    ],
  },
  {
    icon: <UserCircleIcon />,
    name: "Quản trị hiệu suất",
    subItems: [
      { name: "Tiến độ sản xuất video", path: "video-management", pro: false, icon: <VideoIcon /> },
      { name: "Quản lý hiệu suất Booking", path: "booking-management", pro: false, icon: <CalenderIcon /> },
      { name: "Danh sách nhân sự", path: "staff-list", pro: false, icon: <UserIcon /> }
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "Cửa hàng",
    subItems: [
      { name: "Quản lí Sản phẩm", path: "product-management", pro: false, icon: <BoxCubeIcon /> },
      { name: "Đơn hàng & Fulfillment", path: "orders-fulfillment", pro: false, icon: <TableIcon /> },
      { name: "Logistics", path: "logistics-tracking", pro: false, icon: <BoxIcon /> },
      { name: "Phân tích Shop", path: "shop-analytics", pro: false, icon: <PieChartIcon /> },
      { name: "Phân tích Hủy/Trả/Hoàn tiền", path: "aftersales-analytics", pro: false, icon: <DollarLineIcon /> }
    ],
  },
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
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
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
                }`}
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
