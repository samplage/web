import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";
import { Select } from "flowbite-react";

import { createSample, getCategories } from "~/models/sample.server";
import { requireUserId } from "~/session.server";

import type { LoaderFunction } from "@remix-run/node";

type ActionData = {
  errors?: {
    title?: string;
    transcript?: string;
    categoryId?: string;
  };
};

type LoaderData = {
  categories: Awaited<ReturnType<typeof getCategories>>;
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const transcript = formData.get("transcript");
  const categoryId = formData.get("category");

  if (typeof title !== "string" || title.length === 0) {
    return json<ActionData>(
      { errors: { title: "Title is required" } },
      { status: 400 }
    );
  }

  if (typeof transcript !== "string" || transcript.length === 0) {
    return json<ActionData>(
      { errors: { transcript: "Transcript is required" } },
      { status: 400 }
    );
  }

  if (typeof categoryId !== "string" || categoryId.length === 0) {
    return json<ActionData>(
      { errors: { categoryId: "categoryId is required" } },
      { status: 400 }
    );
  }

  const sample = await createSample({
    title,
    transcript,
    userId,
    categoryId,
  });
  console.log(sample);

  return redirect(`/admin/new/`);
};

export const loader: LoaderFunction = async () => {
  const categories = await getCategories();
  return json<LoaderData>({ categories });
};

export default function NewNotePage() {
  const actionData = useActionData() as ActionData;
  const titleRef = React.useRef<HTMLInputElement>(null);
  const transcriptRef = React.useRef<HTMLTextAreaElement>(null);
  const categoryRef = React.useRef<HTMLSelectElement>(null);
  const { categories } = useLoaderData() as LoaderData;

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.transcript) {
      transcriptRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            ref={titleRef}
            name="title"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.title && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        )}
      </div>

      <div>
        <Select ref={categoryRef} name="category">
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Transcript: </span>
          <textarea
            ref={transcriptRef}
            name="transcript"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
            aria-invalid={actionData?.errors?.transcript ? true : undefined}
            aria-errormessage={
              actionData?.errors?.transcript ? "body-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.transcript && (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.transcript}
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
