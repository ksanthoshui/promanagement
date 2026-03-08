import { Role } from "../models/Role.ts";
import { User } from "../models/User.ts";

export const getRoles = async (req: any, res: any) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.json(roles);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createRole = async (req: any, res: any) => {
  try {
    const { name, description, permissions } = req.body;
    const role = new Role({ name, description, permissions });
    await role.save();
    res.status(201).json(role);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRole = async (req: any, res: any) => {
  try {
    const { name, description, permissions, isActive } = req.body;
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    if (!role.isCustom && name !== role.name) {
      return res.status(403).json({ message: "Cannot rename system roles" });
    }

    if (name) role.name = name;
    if (description) role.description = description;
    if (permissions) role.permissions = permissions;
    if (typeof isActive === "boolean") role.isActive = isActive;

    await role.save();
    res.json(role);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRole = async (req: any, res: any) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    if (!role.isCustom) {
      return res.status(403).json({ message: "Cannot delete system roles" });
    }

    // Check if any user is using this role
    const userWithRole = await User.findOne({ role: role.name });
    if (userWithRole) {
      return res.status(400).json({ message: "Cannot delete role while users are assigned to it" });
    }

    await Role.findByIdAndDelete(req.params.id);
    res.json({ message: "Role deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentChanges = async (req: any, res: any) => {
  try {
    // Just fetch the 5 most recently updated roles as "changes"
    const changes = await Role.find().sort({ updatedAt: -1 }).limit(5);
    res.json(changes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
