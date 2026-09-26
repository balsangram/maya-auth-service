import Auth from "./auth.model.js";

const subAdminSchema = new Auth.base.Schema({
  permissions: {
    type: [String],
    default: [],
  },

  createdBy: {
    type: Auth.base.Schema.Types.ObjectId,
    ref: "Auth",
    default: null,
  },

  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
});

const SubAdmin = Auth.discriminator("SubAdmin", subAdminSchema);

export default SubAdmin;