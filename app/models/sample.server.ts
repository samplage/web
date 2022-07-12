import type { User, Sample, Category } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Sample } from "@prisma/client";

export function createSample({
  transcript,
  title,
	userId,
	categoryId,
}: Pick<Sample, "transcript" | "title" | "categoryId"> & {
		userId: User["id"];
		categoryId: Category["id"]
}) {
  return prisma.sample.create({
    data: {
      title,
			transcript,
			category: {
				connect: {
					id: categoryId,
				}
			},
      author: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function createCategory({ name }: Pick<Category, "name">) {
  return prisma.category.create({
    data: {
      name,
    },
  });
}

export function getCategories() {
  return prisma.category.findMany({
    select: { id: true, name: true },
  });
}

export function getSamples() {
  return prisma.sample.findMany({
    select: { id: true, title: true, transcript: true, category: true },
  });
}