import { db } from "@/lib/db"
import type { CreateProductInput, UpdateProductInput } from "../schemas/product.schema"

export async function findAll() {
  return db.product.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function findById(id: string) {
  return db.product.findUnique({
    where: { id },
  })
}

export async function findByName(name: string) {
  return db.product.findFirst({
    where: { name },
  })
}

export async function create(data: CreateProductInput) {
  return db.product.create({
    data,
  })
}

export async function update(id: string, data: UpdateProductInput) {
  return db.product.update({
    where: { id },
    data,
  })
}

export async function remove(id: string) {
  return db.product.delete({
    where: { id },
  })
}
