```ts
// [entity].router.ts
import { z } from "zod"
import { createTRPCRouter, protectedProcedure, baseProcedure } from "@/trpc/init"
import { TRPCError } from "@trpc/server"
import * as [entity]Service from "./[entity].service"
import { create[Entity]Schema, update[Entity]Schema, delete[Entity]Schema } from "../schema/[entity].schema"

export const [entity]Router = createTRPCRouter({
  // baseProcedure = public, protectedProcedure = auth required
  list: baseProcedure.query(() => [entity]Service.list()),

  get: baseProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ input }) => {
      try {
        return await [entity]Service.get(input.id)
      } catch (err) {
        if (err instanceof NotFoundError) throw new TRPCError({ code: "NOT_FOUND", message: err.message })
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to get [entity]" })
      }
    }),

  create: protectedProcedure
    .input(createProductSchema)
    .mutation(async ({ input }) => {
      try {
        return await [entity]Service.create(input)
      } catch (err) {
        if (err instanceof ConflictError) throw new TRPCError({ code: "CONFLICT", message: err.message })
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create [entity]" })
      }
    }),

  // update: protectedProcedure — destructure { id, ...data }, call service.update(id, data)
  // delete: protectedProcedure — call service.remove(input.id)
})
```