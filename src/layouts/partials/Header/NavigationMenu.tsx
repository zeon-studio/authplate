import Link from "next/link";
import NavLink from "../NavLink";
import NavItem from "./NavItem";

interface NavigationMenuProps {
  main: Array<{
    name: string;
    url: string;
    hasChildren?: boolean;
    children?: Array<{
      name: string;
      url: string;
    }>;
  }>;
  navigationButton: {
    enable: boolean;
    label: string;
    link: string;
  };
}

export function NavigationMenu({
  main,
  navigationButton,
}: NavigationMenuProps) {
  return (
    <ul
      id="nav-menu"
      className="navbar-nav order-3 hidden w-full pb-6 lg:order-1 lg:flex lg:w-auto lg:space-x-2 lg:pb-0 xl:space-x-8"
    >
      {main.map((menu, i) => (
        <NavItem key={i} variant={menu.hasChildren ? "dropdown" : "default"}>
          {menu.hasChildren && menu.children?.length ? (
            <>
              <span className={`nav-link inline-flex items-center`}>
                {menu.name}
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </span>
              <ul className="nav-dropdown-list hidden group-hover:block lg:invisible lg:absolute lg:block lg:opacity-0 lg:group-hover:visible lg:group-hover:opacity-100">
                {menu.children?.map((child, i) => (
                  <NavItem variant="dropdown" key={i}>
                    <NavLink
                      href={child.url}
                      className="nav-dropdown-link block"
                    >
                      {child.name}
                    </NavLink>
                  </NavItem>
                ))}
              </ul>
            </>
          ) : (
            <NavLink
              href={menu.url}
              className="nav-link inline-flex items-center"
            >
              {menu.name}
            </NavLink>
          )}
        </NavItem>
      ))}
      {navigationButton.enable && (
        <li className="mt-4 inline-block lg:hidden">
          <Link
            className="btn btn-outline-primary btn-sm"
            href={navigationButton.link}
          >
            {navigationButton.label}
          </Link>
        </li>
      )}
    </ul>
  );
}
