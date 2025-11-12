"use client";

import { Button } from "@/layouts/components/ui/button";
import { FormEvent } from "react";
import { toast } from "sonner";

export function ContactForm() {
  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    if (!name) return toast.warning("Enter your name first");
    toast.success(`Hey ${name}, You clicked to submit button`);
  };

  return (
    <form onSubmit={handleSubmit} method="POST">
      <div className="mb-6">
        <label htmlFor="name" className="form-label">
          Full Name <span className="text-destructive">*</span>
        </label>
        <input
          id="name"
          name="name"
          className="form-input"
          placeholder="John Doe"
          type="text"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="email" className="form-label">
          Working Mail <span className="text-destructive">*</span>
        </label>
        <input
          id="email"
          name="email"
          className="form-input"
          placeholder="john.doe@email.com"
          type="email"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="message" className="form-label">
          Anything else? <span className="text-destructive">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          className="form-input"
          placeholder="Message goes here..."
          rows={8}
        ></textarea>
      </div>
      <Button type="submit" className="btn btn-primary">
        Submit
      </Button>
    </form>
  );
}
