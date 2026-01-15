// ============================================
// IMPORTS - Modules nécessaires
// ============================================
import {
	getAllRecipes,
	createRecipe,
	searchRecipes,
	deletOneRecipe,
} from "./api.js"
import { renderRecipeCard, clearRecipesList } from "./ui.js"

// ============================================
// INITIALISATION DE L'APPLICATION
// ============================================
// Cette fonction est appelée automatiquement au chargement de la page
// Elle charge et affiche toutes les recettes

document.addEventListener("DOMContentLoaded", () => {
	// console.log("Application chargée")
	loadRecipes()
	setupEventListeners()
})

// ============================================
// CHARGER ET AFFICHER LES RECETTES
// ============================================
// Cette fonction est fournie comme EXEMPLE de référence
// Étudiez-la pour comprendre le pattern async/await et le flow de données

const loadRecipes = async () => {
	try {
		// 1. Appeler l'API pour récupérer toutes les recettes
		const recipes = await getAllRecipes()

		// console.log("Recettes chargées:", recipes)

		// 2. Afficher les recettes dans la grid
		displayRecipes(recipes)
	} catch (error) {
		console.error("Erreur lors du chargement des recettes:", error)
		alert(
			"Impossible de charger les recettes. Vérifiez que le serveur est démarré."
		)
	}
}

// ============================================
// AFFICHER LES RECETTES DANS LA GRID
// ============================================
// Fonction fournie - génère le HTML pour toutes les recettes

const displayRecipes = (recipes) => {
	// Récupérer le conteneur où afficher les recettes
	const recipesContainer = document.getElementById("recipes-container")

	// Vider le conteneur avant d'ajouter les nouvelles recettes
	clearRecipesList(recipesContainer)

	// Si aucune recette, afficher un message
	if (recipes.length === 0) {
		recipesContainer.innerHTML = `
			<div class="col-12">
				<div class="alert alert-info text-center" role="alert">
					Aucune recette disponible. Ajoutez-en une !
				</div>
			</div>
		`
		return
	}

	// Générer et afficher chaque recette
	recipes.forEach((recipe) => {
		const cardHTML = renderRecipeCard(recipe)
		recipesContainer.innerHTML += cardHTML
		console.log("Recette:", recipe)
	})
}

// ============================================
// CONFIGURATION DES EVENT LISTENERS
// ============================================

const setupEventListeners = () => {
	// Event listener pour le formulaire d'ajout de recette
	const addRecipeForm = document.getElementById("addRecipeForm")
	const searchInput = document.getElementById("searchInput")
	const recipesContainer = document.getElementById("recipes-container")

	if (addRecipeForm) {
		addRecipeForm.addEventListener("submit", handleAddRecipe)
	}

	if (searchInput) {
		searchInput.addEventListener("input", handleSearchInput)
	}

	if (recipesContainer) {
		recipesContainer.addEventListener("click", handleRecipesContainerClick)
	}
}

// ============================================
// AJOUTER UNE NOUVELLE RECETTE
// ============================================
// TODO: Compléter cette fonction pour gérer l'ajout d'une recette
// Cette fonction est appelée quand l'utilisateur soumet le formulaire dans le modal

export const handleAddRecipe = async (event) => {
	event.preventDefault()

	try {
		const name = document.getElementById('recipeName').value
		const ingredients = document.getElementById('recipeIngredients').value.split(',').map(ing => ing.trim()).filter(ing => ing !== '')
		const instructions = document.getElementById('recipeInstructions').value
		const prepTime = parseInt(document.getElementById('recipePrepTime').value)
		const imageUrl = document.getElementById('recipeImageUrl').value

		const newRecipe = {
			name,
			ingredients,
			instructions,
			prepTime
		}

		if (imageUrl) {
			newRecipe.image = imageUrl
		}

		await createRecipe(newRecipe)

		const modal = bootstrap.Modal.getInstance(document.getElementById('addRecipeModal'))
		modal.hide()

		alert('Recette ajoutée avec succès!')

		loadRecipes()

		event.target.reset()
	} catch (error) {
		console.error("Erreur lors de l'ajout de la recette:", error)
		alert("Erreur lors de l'ajout de la recette. Veuillez réessayer.")
	}
}

// ============================================
// RECHERCHE DE RECETTES
// ============================================

const handleSearchInput = async (event) => {
	const term = event.target.value.trim()

	try {
		const recipes = await searchRecipes(term)
		displayRecipes(recipes)
	} catch (error) {
		console.error("Erreur lors de la recherche de recettes:", error)
		alert(
			"Impossible de rechercher les recettes. Vérifiez que le serveur est démarré."
		)
	}
}

// ============================================
// GESTION DES BOUTONS MODIFIER / SUPPRIMER
// ============================================

const handleRecipesContainerClick = async (event) => {
	const deleteButton = event.target.closest(".btn-delete-recipe")
	const editButton = event.target.closest(".btn-edit-recipe")

	if (deleteButton) {
		const recipeId = deleteButton.dataset.recipeId
		if (!recipeId) return

		const confirmDelete = confirm(
			"Êtes-vous sûr de vouloir supprimer cette recette ?"
		)
		if (!confirmDelete) return

		try {
			await deletOneRecipe(recipeId)
			alert("Recette supprimée avec succès.")
			loadRecipes()
		} catch (error) {
			console.error("Erreur lors de la suppression de la recette:", error)
			alert("Erreur lors de la suppression de la recette.")
		}
	}

	if (editButton) {
		const recipeId = editButton.dataset.recipeId
		if (!recipeId) return

		// Pour rester simple, on redirige vers la page de détail
		// où une future édition pourrait être implémentée.
		window.location.href = `recipe.html?id=${recipeId}`
	}
}
