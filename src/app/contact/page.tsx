import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import config from "@/config/config.json";
import { getListPage } from "@/lib/contentParser";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import { RegularPage } from "@/types";

const Contact = async () => {
  const data: RegularPage = getListPage("contact/_index.md");
  const { frontmatter } = data;
  const { title, description, meta_title, image } = frontmatter;
  const { contact_form_action } = config.params;

  return (
    <>
      <SeoMeta
        title={title}
        meta_title={meta_title}
        description={description}
        image={image}
      />
      <PageHeader title={title} />
      <section className="section-sm">
        <div className="container">
          <div className="row">
            <div className="mx-auto md:col-10 lg:col-6">
              <form action={contact_form_action} method="POST">
                <div className="mb-6">
                  <Label htmlFor="name">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Full Name"
                    color="gray"
                    type="text"
                    name="name"
                    required
                  />
                </div>
                <div className="mb-6">
                  <Label htmlFor="name">
                    Working Mail <span className="text-red-500">*</span>{" "}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="john.doe@email.com"
                    type="email"
                    required
                  />
                </div>
                <div className="mb-6">
                  <Label htmlFor="message">
                    {" "}
                    Anything else? <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    placeholder="Message goes here..."
                    id="message"
                    rows={8}
                  />
                </div>
                <Button type="submit" className="btn btn-primary">
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
