import Link from "next/link";
import { buttonVariants } from "../components/ui/button";

const Button = ({
  label,
  link,
  style,
  rel,
}: {
  label: string;
  link: string;
  style?: string;
  rel?: string;
}) => {
  return (
    <Link
      href={link}
      target={link.startsWith("http") ? "_blank" : "_self"}
      rel={`noopener noreferrer ${rel ? (rel === "follow" ? "" : rel) : "nofollow"
        }`}
      className={`no-underline ${buttonVariants({ variant: style === "outline" ? "outline" : "default" })}`}
    >
      {label}
    </Link>
  );
};

export default Button;
