import mongoose from "mongoose";

const verifierId = (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Identifiant invalide."
        });
    }

    next();
};

export default verifierId;