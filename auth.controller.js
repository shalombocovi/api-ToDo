import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// INSCRIPTION
export const inscrire = async (req, res) => {
    try {
        const { nom, email, motDePasse } = req.body;

        if (!nom || !email || !motDePasse) {
            return res.status(400).json({
                message: "Tous les champs sont obligatoires."
            });
        }

        if (motDePasse.length < 8) {
            return res.status(400).json({
                message: "Le mot de passe doit contenir au moins 8 caractères."
            });
        }

        const emailNormalise = email.trim().toLowerCase();

        const utilisateurExiste = await User.findOne({
            email: emailNormalise
        });

        if (utilisateurExiste) {
            return res.status(409).json({
                message: "Cet email est déjà utilisé."
            });
        }

        const motDePasseHash = await bcrypt.hash(
            motDePasse,
            10
        );

        const nouvelUtilisateur = await User.create({
            nom: nom.trim(),
            email: emailNormalise,
            motDePasse: motDePasseHash
        });

        return res.status(201).json({
            message: "Inscription réussie !",
            utilisateur: {
                id: nouvelUtilisateur._id,
                nom: nouvelUtilisateur.nom,
                email: nouvelUtilisateur.email
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Erreur lors de l'inscription."
        });
    }
};


// CONNEXION
export const connecter = async (req, res) => {
    try {
        const { email, motDePasse } = req.body;

        if (!email || !motDePasse) {
            return res.status(400).json({
                message: "Email et mot de passe obligatoires."
            });
        }

        const utilisateur = await User.findOne({
            email: email.trim().toLowerCase()
        }).select("+motDePasse");

        if (!utilisateur) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect."
            });
        }

        const motDePasseCorrect = await bcrypt.compare(
            motDePasse,
            utilisateur.motDePasse
        );

        if (!motDePasseCorrect) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect."
            });
        }

        const token = jwt.sign(
            {
                id: utilisateur._id,
                email: utilisateur.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        return res.status(200).json({
            message: "Connexion réussie !",
            token,
            utilisateur: {
                id: utilisateur._id,
                nom: utilisateur.nom,
                email: utilisateur.email
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Erreur lors de la connexion."
        });
    }
};