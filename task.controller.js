import Task from "../models/Task.js";

// LISTER LES TACHES
export const listerTaches = async (req, res) => {
    try {
        const taches = await Task.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json(taches);

    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des tâches."
        });
    }
};


// STATISTIQUES
export const statistiques = async (req, res) => {
    try {
        const total = await Task.countDocuments({
            user: req.user.id
        });

        const aFaire = await Task.countDocuments({
            user: req.user.id,
            statut: "à faire"
        });

        const enCours = await Task.countDocuments({
            user: req.user.id,
            statut: "en cours"
        });

        const terminees = await Task.countDocuments({
            user: req.user.id,
            statut: "terminée"
        });

        res.status(200).json({
            total,
            aFaire,
            enCours,
            terminees
        });

    } catch (error) {
        res.status(500).json({
            message: "Erreur lors du calcul des statistiques."
        });
    }
};


// OBTENIR UNE TACHE
export const obtenirTache = async (req, res) => {
    try {
        const tache = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!tache) {
            return res.status(404).json({
                message: "Tâche introuvable."
            });
        }

        res.status(200).json(tache);

    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération."
        });
    }
};


// CREER UNE TACHE
export const creerTache = async (req, res) => {
    try {
        const { nom, description, statut } = req.body;

        if (!nom || !nom.trim()) {
            return res.status(400).json({
                message: "Le nom de la tâche est obligatoire."
            });
        }

        const nouvelleTache = await Task.create({
            nom: nom.trim(),
            description,
            statut,
            user: req.user.id
        });

        res.status(201).json({
            message: "Tâche créée avec succès.",
            tache: nouvelleTache
        });

    } catch (error) {
        res.status(400).json({
            message: "Impossible de créer la tâche.",
            erreur: error.message
        });
    }
};


// REMPLACER UNE TACHE
export const remplacerTache = async (req, res) => {
    try {
        const { nom, description, statut } = req.body;

        if (!nom || !nom.trim() || !statut) {
            return res.status(400).json({
                message: "Le nom et le statut sont obligatoires."
            });
        }

        const tache = await Task.findOneAndReplace(
            {
                _id: req.params.id,
                user: req.user.id
            },
            {
                nom: nom.trim(),
                description: description || "",
                statut,
                user: req.user.id
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!tache) {
            return res.status(404).json({
                message: "Tâche introuvable."
            });
        }

        res.status(200).json({
            message: "Tâche remplacée avec succès.",
            tache
        });

    } catch (error) {
        res.status(400).json({
            message: "Erreur lors du remplacement.",
            erreur: error.message
        });
    }
};


// MODIFIER UNE TACHE
export const modifierTache = async (req, res) => {
    try {
        const champsAutorises = [
            "nom",
            "description",
            "statut"
        ];

        const modifications = {};

        for (const champ of champsAutorises) {
            if (req.body[champ] !== undefined) {
                modifications[champ] = req.body[champ];
            }
        }

        if (Object.keys(modifications).length === 0) {
            return res.status(400).json({
                message: "Aucune modification fournie."
            });
        }

        if (
            modifications.nom !== undefined &&
            (typeof modifications.nom !== "string" ||
             !modifications.nom.trim())
        ) {
            return res.status(400).json({
                message: "Le nom de la tâche est invalide."
            });
        }

        if (modifications.nom !== undefined) {
            modifications.nom = modifications.nom.trim();
        }

        const tache = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            modifications,
            {
                new: true,
                runValidators: true
            }
        );

        if (!tache) {
            return res.status(404).json({
                message: "Tâche introuvable."
            });
        }

        res.status(200).json({
            message: "Tâche modifiée avec succès.",
            tache
        });

    } catch (error) {
        res.status(400).json({
            message: "Erreur lors de la modification.",
            erreur: error.message
        });
    }
};


// SUPPRIMER UNE TACHE
export const supprimerTache = async (req, res) => {
    try {
        const tache = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!tache) {
            return res.status(404).json({
                message: "Tâche introuvable."
            });
        }

        res.status(200).json({
            message: "Tâche supprimée avec succès."
        });

    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la suppression."
        });
    }
};