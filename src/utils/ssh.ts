import { homedir } from "os";
import path from "path";
import fs from "fs";

const homeDirectory = homedir();
export const sshDirectory = path.join(homeDirectory, ".ssh");

export const getPublicKeys = () =>
  fs.readdirSync(sshDirectory).filter((file) => file.endsWith(".pub"));

export const getPublicKey = (name: string) =>
  fs.readFileSync(path.join(sshDirectory, name), "utf8");
