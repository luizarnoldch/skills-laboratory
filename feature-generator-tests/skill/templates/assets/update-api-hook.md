```ts
// useUpdate[Entity].ts
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { update[Entity] } from "../server/[entity].api"
import { update[Entity]Schema } from "../schema/[entity].schema"
import type { Update[Entity]Request, [Entity] } from "../schema/[entity].schema"

type UseUpdate[Entity]Props = {
  [entity]: [Entity]
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

const useUpdate[Entity] = ({ [entity], onSuccess, onError }: UseUpdate[Entity]Props) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: Update[Entity]Request) => update[Entity](data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["[entity]s", "list"] })
      await queryClient.invalidateQueries({ queryKey: ["[entity]s", "detail", data.id] })
      toast.success("[Entity] updated successfully")
      onSuccess?.()
    },
    onError: (error) => {
      toast.error("Failed to update [entity]")
      onError?.(error)
    },
  })

  // [entity].id is included in Update[Entity]Request so the API knows which record to update
  const form = useForm({
    defaultValues: {
      id: [entity].id,
      name: [entity].name,
      price: [entity].price,
      categoryId: [entity].categoryId,
    } as Update[Entity]Request,
    validators: {
      onChange: update[Entity]Schema,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value)
    },
  })

  return {
    form,
    ...mutation,
  }
}

export default useUpdate[Entity]
```