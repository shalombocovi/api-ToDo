
import express from "express";
import mongoose from "mongoose";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// ======================================
// GET : afficher toutes les tâches
// ======================================
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();

        res.status(200).json(tasks);

    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des tâches",
            erreur: error.message
        });
    }
});

// ======================================
// GET : afficher une tâche par son ID
// ======================================
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si l'identifiant est valide
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Identifiant de tâche invalide"
            });
        }

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({
                message: "Tâche introuvable"
            });
        }

        res.status(200).json(task);

    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération de la tâche",
            erreur: error.message
        });
    }
});

// ======================================
// POST : ajouter une tâche
// ======================================
router.post("/", async (req, res) => {
    try {
        const { nom, description, statut } = req.body;

        if (!nom || !statut) {
            return res.status(400).json({
                message: "Le nom et le statut sont obligatoires"
            });
        }

        const nouvelleTache = await Task.create({
            nom,
            description,
            statut
        });

        res.status(201).json({
            message: "Tâche ajoutée avec succès",
            task: nouvelleTache
        });

    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Erreur de validation",
                erreur: error.message
            });
        }

        res.status(500).json({
            message: "Erreur lors de la création de la tâche",
            erreur: error.message
        });
    }
});

// ======================================
// PUT : modifier une tâche
// ======================================
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, description, statut } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Identifiant de tâche invalide"
            });
        }

        if (!nom || !statut) {
            return res.status(400).json({
                message: "Le nom et le statut sont obligatoires"
            });
        }

        const taskModifiee = await Task.findByIdAndUpdate(
            id,
            {
                nom,
                description,
                statut
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!taskModifiee) {
            return res.status(404).json({
                message: "Tâche introuvable"
            });
        }

        res.status(200).json({
            message: "Tâche modifiée avec succès",
            task: taskModifiee
        });

    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Erreur de validation",
                erreur: error.message
            });
        }

        res.status(500).json({
            message: "Erreur lors de la modification de la tâche",
            erreur: error.message
        });
    }
});

// ======================================
// DELETE : supprimer une tâche
// ======================================
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Identifiant de tâche invalide"
            });
        }

        const taskSupprimee = await Task.findByIdAndDelete(id);

        if (!taskSupprimee) {
            return res.status(404).json({
                message: "Tâche introuvable"
            });
        }

        res.status(200).json({
            message: "Tâche supprimée avec succès",
            task: taskSupprimee
        });

    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la suppression de la tâche",
            erreur: error.message
        });
    }
});

export default router;
