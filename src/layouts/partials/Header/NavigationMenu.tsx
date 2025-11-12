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
              {/*
                Use a stable, unique id per menu (index-based). The checkbox is visually hidden
                but remains in the DOM for the CSS `peer-checked` selector to work on small screens.
                We hide the checkbox behavior on lg via `lg:hidden` so hover styles take over.
              */}
              <input
                type="checkbox"
                id={`submenu-${i}`}
                className="peer sr-only lg:hidden"
              />
              <label
                htmlFor={`submenu-${i}`}
                className={`nav-link inline-flex items-center cursor-pointer lg:inline-flex`}
                aria-controls={`submenu-list-${i}`}
              >
                {menu.name}
                <svg
                  className="h-4 w-4 fill-current ml-2"
                  viewBox="0 0 20 20"
                  aria-hidden
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </label>

              <ul
                id={`submenu-list-${i}`}
                className="nav-dropdown-list hidden peer-checked:block lg:invisible lg:absolute lg:block lg:opacity-0 lg:group-hover:visible lg:group-hover:opacity-100"
              >
                {menu.children?.map((child, childIndex) => (
                  <NavItem variant="dropdown" key={childIndex}>
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
