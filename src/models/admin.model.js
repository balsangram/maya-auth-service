import Auth from "./auth.models.js";

const adminSchema = new Auth.base.Schema({});

const Admin = Auth.discriminator("Admin", adminSchema);

export default Admin;
