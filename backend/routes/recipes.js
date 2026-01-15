import { Router } from "express"
import {
	getRecipes,
	getRecipeById,
	createRecipe,
	updateRecipe,
} from "../controllers/recipesController.js"

const router = Router()

router.get("/", getRecipes)
router.get("/:id", getRecipeById)
router.post("/", createRecipe)
router.put("/:id", updateRecipe)

export default router
