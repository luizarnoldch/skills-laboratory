import type { z } from "zod"
import * as productRepository from "./product.repository"
import type { CreateProductInput, UpdateProductInput } from "../schemas/product.schema"

export async function list() {
  return productRepository.findAll()
}

export async function get(id: string) {
  const product = await productRepository.findById(id)
  if (!product) {
    throw new Error("Product not found")
  }
  return product
}

export async function create(data: CreateProductInput) {
  const existing = await productRepository.findByName(data.name)
  if (existing) {
    throw new Error("Product already exists")
  }
  return productRepository.create(data)
}

export async function update(id: string, data: UpdateProductInput) {
  const product = await productRepository.findById(id)
  if (!product) {
    throw new Error("Product not found")
  }
  return productRepository.update(id, data)
}

export async function remove(id: string) {
  const product = await productRepository.findById(id)
  if (!product) {
    throw new Error("Product not found")
  }
  await productRepository.remove(id)
}
