
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ==========================================
// ROUTE D'INSCRIPTION : POST /register
// ==========================================

router.post("/register", async (req, res) => {
    try {
        const { nom, email, motDePasse } = req.body;

        // Vérification des champs
        if (!nom || !email || !motDePasse) {
            return res.status(400).json({
                message: "Tous les champs sont obligatoires"
            });
        }

        // Normalisation de l'email
        const emailNormalise = email.trim().toLowerCase();

        // Vérifier si l'utilisateur existe déjà
        const utilisateurExiste = await User.findOne({
            email: emailNormalise
        });

        if (utilisateurExiste) {
            return res.status(409).json({
                message: "Cet email est déjà utilisé"
            });
        }

        // Hacher le mot de passe
        const motDePasseHache = await bcrypt.hash(motDePasse, 12);

        // Créer le nouvel utilisateur
        const nouvelUtilisateur = await User.create({
            nom,
            email: emailNormalise,
            motDePasse: motDePasseHache
        });

        // Réponse au client
        return res.status(201).json({
            message: "Utilisateur inscrit avec succès",
            user: {
                id: nouvelUtilisateur._id,
                nom: nouvelUtilisateur.nom,
                email: nouvelUtilisateur.email
            }
        });

    } catch (error) {
        console.error("Erreur inscription :", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Cet email est déjà utilisé"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Erreur interne du serveur"
        });
    }
});


// ==========================================
// ROUTE DE CONNEXION : POST /login
// ==========================================

router.post("/login", async (req, res) => {
    try {
        const { email, motDePasse } = req.body;

        // Vérification des champs
        if (!email || !motDePasse) {
            return res.status(400).json({
                message: "Email et mot de passe obligatoires"
            });
        }

        // Normalisation de l'email
        const emailNormalise = email.trim().toLowerCase();

        // Recherche de l'utilisateur dans MongoDB
        const utilisateur = await User.findOne({
            email: emailNormalise
        });

        if (!utilisateur) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect"
            });
        }

        // Comparaison du mot de passe
        const motDePasseCorrect = await bcrypt.compare(
            motDePasse,
            utilisateur.motDePasse
        );

        if (!motDePasseCorrect) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect"
            });
        }

        // Vérification de la clé secrète JWT
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET n'est pas configuré");
        }

        // Génération du token JWT
        const token = jwt.sign(
            {
                id: utilisateur._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        // Réponse au client
        return res.status(200).json({
            message: "Connexion réussie",
            token,
            user: {
                id: utilisateur._id,
                nom: utilisateur.nom,
                email: utilisateur.email
            }
        });

    } catch (error) {
        console.error("Erreur connexion :", error);

        return res.status(500).json({
            message: "Erreur interne du serveur"
        });
    }
});

export default router;
