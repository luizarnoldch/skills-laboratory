"use client"

import useCreateProduct from "../hooks/useCreateProduct"

const ProductCreateDialog = () => {
  const { form, isPending } = useCreateProduct()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.handleSubmit()
  }

  return (
    <form onSubmit={handleSubmit}>
      <form.Field name="name">
        {(field) => (
          <input
            name={field.name}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>
      <form.Field name="description">
        {(field) => (
          <input
            name={field.name}
            value={field.state.value ?? ""}
            onChange={(e) => field.handleChange(e.target.value || null)}
          />
        )}
      </form.Field>
      <form.Field name="price">
        {(field) => (
          <input
            name={field.name}
            type="number"
            value={field.state.value}
            onChange={(e) => field.handleChange(Number(e.target.value))}
          />
        )}
      </form.Field>
      <form.Field name="stock">
        {(field) => (
          <input
            name={field.name}
            type="number"
            value={field.state.value}
            onChange={(e) => field.handleChange(Number(e.target.value))}
          />
        )}
      </form.Field>
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create"}
      </button>
    </form>
  )
}

export default ProductCreateDialog
