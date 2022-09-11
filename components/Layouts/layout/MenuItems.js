import React, { useEffect } from "react";
import { Menu } from "antd";
import { useRouteMatch } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import propTypes from "prop-types";
import { withRouter } from "next/router";
import NavLink from "next/link";
import { useSelector } from "react-redux";

const { SubMenu } = Menu;
const navItems = [
  {
    title: "Inicio",
    key: "home",
    route: "/home",
    icon: "home",
    can: ["super_admin", "company_admin"],
    children: [],
  },
  {
    title: "Carta Porte",
    key: "moving-note",
    route: "/moving-note",
    icon: "mail",
    can: ["company_admin"],
    children: [
      {
        title: "Figuras",
        key: "figuras",
        route: "/moving-note/figures/",
      },
      {
        title: "Vehiculos",
        key: "vehiculos",
        route: "/moving-note/vehicles/",
      },
      {
        title: "Ubicaciones",
        key: "ubicaciones",
        route: "/moving-note/locations/",
      },
      {
        title: "Permisos SCT",
        key: "permisos-sct",
        route: "/moving-note/sct-types/",
      },
      {
        title: "Polizas de seguros",
        key: "polizas-de-seguros",
        route: "/moving-note/insurance-policies/",
      },
    ],
  },
  {
    title: "Clientes",
    key: "clientes",
    route: "/customers",
    icon: "user",
    can: ["company_admin"],
    children: [],
  },
  {
    title: "Fletes",
    key: "fletes",
    route: "/freights",
    icon: "truck",
    can: ["company_admin"],
    children: [],
  },
  {
    title: "Producto",
    key: "producto",
    route: "/products",
    icon: "shopping-bag",
    can: ["company_admin"],
    children: [],
  },
  {
    title: "Configuracion",
    key: "configuracion",
    route: "/settings",
    icon: "settings",
    can: ["company_admin"],
    children: [
      {
        title: "Catalogos",
        key: "catalogos",
        route: "/settings/catalogs/",
      },
      {
        title: "Mi Compañia",
        key: "mi-compania",
        route: "/settings/my-company",
      },
    ],
  },
  {
    title: "CFDI",
    key: "cfdi",
    route: "/cfdi",
    icon: "inbox",
    can: ["company_admin"],
    children: [],
  },
  {
    title: "Planes",
    key: "plans",
    route: "/plans",
    icon: "layers",
    can: ["super_admin"],
    children: [],
  },
  {
    title: "Precios",
    key: "prices",
    route: "/prices",
    icon: "archive",
    can: ["super_admin"],
    children: [],
  },
  {
    title: "Modulos",
    key: "resources",
    route: "/resources",
    icon: "database",
    can: ["super_admin"],
    children: [],
  },
  {
    title: "Cupones",
    key: "coupons",
    route: "/coupons",
    icon: "award",
    can: ["super_admin"],
    children: [],
  },
  {
    title: "Suscripciones",
    key: "subscription",
    route: "/subscription/settings",
    icon: "shopping-bag",
    can: ["company_admin"],
    children: [],
  },
];

const MenuItems = (props) => {
  const { darkMode, toggleCollapsed, topMenu } = props;
  const { path } = useRouteMatch();
  const { currentUser } = useSelector((state) => state.auth);
  const [openKeys, setOpenKeys] = React.useState([]);

  const onOpenChange = (keys) => {
    setOpenKeys(
      keys[keys.length - 1] !== "recharts"
        ? [keys.length && keys[keys.length - 1]]
        : keys
    );
  };

  const onClick = (item) => {
    if (item.keyPath.length === 1) setOpenKeys([]);
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const pathName = window.location.pathname;
      const pathArray = pathName.split(path);
      let newArr = pathArray.filter((val) => val != "");
      if (newArr.length === 2) {
        setOpenKeys([newArr[0]]);
      }
    }

    return () => (mounted = false);
  }, []);

  const getDefault = () => {
    const pathName = window.location.pathname;
    const pathArray = pathName.split(path);
    let newArr = pathArray.filter((val) => val != "");
    if (newArr.length === 1) {
      return newArr[0];
    } else if (newArr.length === 2) {
      return newArr[1];
    }
  };

  return (
    <Menu
      onOpenChange={onOpenChange}
      onClick={onClick}
      mode={!topMenu || window.innerWidth <= 991 ? "inline" : "horizontal"}
      theme={darkMode && "dark"}
      defaultSelectedKeys={getDefault}
      overflowedIndicator={<FeatherIcon icon="more-vertical" />}
      openKeys={openKeys}
    >
      {navItems.map((item) => {
        const isAllowed = currentUser?.roles?.some((role) =>
          item.can.includes(role)
        );
        if (!isAllowed) return null;

        if (item.children.length) {
          return (
            <SubMenu
              key={item.key}
              icon={!topMenu && <FeatherIcon icon={item.icon} />}
              title={item.title}
            >
              {item.children.map((value) => {
                return (
                  <Menu.Item key={value.key}>
                    <NavLink
                      className="menu-item-link"
                      onClick={toggleCollapsed}
                      href={value.route}
                    >
                      {value.title}
                    </NavLink>
                  </Menu.Item>
                );
              })}
            </SubMenu>
          );
        } else {
          return (
            <Menu.Item
              icon={
                !topMenu && (
                  <NavLink className="menuItem-iocn" href={item.route}>
                    <FeatherIcon icon={item.icon} />
                  </NavLink>
                )
              }
              key={item.key}
            >
              <NavLink
                className="menu-item-link"
                onClick={toggleCollapsed}
                href={item.route}
              >
                {item.title}
              </NavLink>
            </Menu.Item>
          );
        }
      })}
    </Menu>
  );
};

MenuItems.propTypes = {
  darkMode: propTypes.bool,
  topMenu: propTypes.bool,
  toggleCollapsed: propTypes.func,
};

export default withRouter(MenuItems);
