import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get team configuration for a match
export const getByMatch = query({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args) => {
    const config = await ctx.db
      .query("teamConfigurations")
      .withIndex("by_partidoId", (q) => q.eq("partidoId", args.matchId))
      .first();
    return config;
  },
});

// Save (create or update) team configuration
export const save = mutation({
  args: {
    partidoId: v.id("matches"),
    nombreEquipoBlanco: v.optional(v.string()),
    nombreEquipoOscuro: v.optional(v.string()),
    asignaciones: v.optional(v.array(v.object({
      jugadorId: v.id("players"),
      equipo: v.string(),
      rol: v.string(),
      posicion: v.optional(v.string()),
      coordenadaX: v.optional(v.number()),
      coordenadaY: v.optional(v.number()),
    }))),
    formacionEquipoBlanco: v.optional(v.string()),
    formacionEquipoOscuro: v.optional(v.string()),
    createdBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { partidoId, ...updates } = args;
    const now = new Date().toISOString();
    
    // Check if config exists
    const existing = await ctx.db
      .query("teamConfigurations")
      .withIndex("by_partidoId", (q) => q.eq("partidoId", partidoId))
      .first();
    
    if (existing) {
      // Update existing config
      const filteredUpdates: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
          filteredUpdates[key] = value;
        }
      }
      
      await ctx.db.patch(existing._id, {
        ...filteredUpdates,
        version: existing.version + 1,
        updatedAt: now,
      });
      
      return existing._id;
    } else {
      // Create new config with defaults
      const configId = await ctx.db.insert("teamConfigurations", {
        partidoId,
        nombreEquipoBlanco: updates.nombreEquipoBlanco ?? "Equipo Blanco",
        nombreEquipoOscuro: updates.nombreEquipoOscuro ?? "Equipo Oscuro",
        asignaciones: updates.asignaciones ?? [],
        formacionEquipoBlanco: updates.formacionEquipoBlanco ?? "4-3-3",
        formacionEquipoOscuro: updates.formacionEquipoOscuro ?? "4-3-3",
        version: 1,
        createdBy: updates.createdBy ?? "current_user",
        createdAt: now,
        updatedAt: now,
      });
      
      return configId;
    }
  },
});

// Get or create team configuration (returns the config, creating default if needed)
export const getOrCreate = mutation({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args) => {
    // Check if config exists
    const existing = await ctx.db
      .query("teamConfigurations")
      .withIndex("by_partidoId", (q) => q.eq("partidoId", args.matchId))
      .first();
    
    if (existing) {
      return existing;
    }
    
    // Create default config
    const now = new Date().toISOString();
    const configId = await ctx.db.insert("teamConfigurations", {
      partidoId: args.matchId,
      nombreEquipoBlanco: "Equipo Blanco",
      nombreEquipoOscuro: "Equipo Oscuro",
      asignaciones: [],
      formacionEquipoBlanco: "4-3-3",
      formacionEquipoOscuro: "4-3-3",
      version: 1,
      createdBy: "current_user",
      createdAt: now,
      updatedAt: now,
    });
    
    return await ctx.db.get(configId);
  },
});
