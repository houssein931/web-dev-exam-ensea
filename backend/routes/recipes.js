import { Router } from "express"
import { getRecipes, getRecipeById } from "../controllers/recipesController.js"

const router = Router()

router.get("/", getRecipes)
router.get("/:id", getRecipeById)

export default router
